'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addInToCart } from "@/store/reducer/cartReducer";
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import ButtonLoading from '@/components/Application/ButtonLoading';
import { Button } from '@/components/ui/button';
import { HiMinus, HiPlus } from 'react-icons/hi2';
import imgPlaceholder from '@/public/assets/images/img-placeholder.webp';
import { IoStar } from "react-icons/io5";
import { decode, encode } from "entities";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { WEBSITE_CART } from '@/routes/websiteRoute';
import ProductReview from '@/components/Application/Website/ProductReview';

const ProductDetails = ({ product, variant, colors = [], sizes = [], reviewCount = 0 }) => {
  const dispatch = useDispatch();

  // Redux safe access
  const cartStore = useSelector((store) => store.cartStore || { Products: [], count: 0 });

  // States
  const [activeThumb, setActiveThumb] = useState(variant?.media?.[0]?.secure_url || imgPlaceholder.src);
  const [qty, setQty] = useState(1);
  const [isAddedInToCart, setIsAddedInToCart] = useState(false);

  // Selected color & size state for UI highlight
  const [selectedColor, setSelectedColor] = useState(variant?.color || '');
  const [selectedSize, setSelectedSize] = useState(variant?.size || '');

  // Update selected color/size whenever variant changes
  useEffect(() => {
    setActiveThumb(variant?.media?.[0]?.secure_url || imgPlaceholder.src);
    setSelectedColor(variant?.color || '');
    setSelectedSize(variant?.size || '');

    // Check if this variant is already in cart
    const existingProduct = cartStore?.Products?.findIndex(
      (cartProduct) => cartProduct.productId === product._id && cartProduct.variantId === variant._id
    );
    setIsAddedInToCart(existingProduct >= 0);
  }, [variant, cartStore.Products, product._id, variant._id]);

  const handleThumb = (thumbUrl) => setActiveThumb(thumbUrl);

  const handleQty = (action) => {
    if (action === 'inc') setQty(qty + 1);
    else if (action === 'dec' && qty > 1) setQty(qty - 1);
  };

  const handleAddToCart = () => {
    const cartProduct = {
      productId: product._id,
      variantId: variant._id,
      name: product.name,
      url: product.slug,
      size: variant.size,
      color: variant.color,
      mrp: variant.mrp,
      sellingPrice: variant.sellingPrice,
      media: variant?.media?.[0]?.secure_url,
      qty: qty,
    };

    dispatch(addInToCart(cartProduct));
    setIsAddedInToCart(true);
    toast.success('Product added to cart successfully!');
  };

  return (
    <div className='lg:px-32 px-4'>
      {/* Breadcrumb */}
      <div className='my-10'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/shop">Product</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/product/${product?.slug}`}>
                  {product?.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className='md:flex justify-between items-start lg:gap-10 gap-5 mb-20'>
        {/* Images */}
        <div className='md:w-1/2 xl:flex xl:justify-center xl:gap-5 md:sticky md:top-0'>
          <div className='xl:order-last xl:mb-0 mb-5 xl:w-[calc(100%-144px)]'>
            <Image
              src={activeThumb}
              width={650}
              height={650}
              alt='Product'
              className='border rounded max-w-full'
            />
          </div>
          <div className='flex xl:flex-col items-center xl:gap-5 gap-3 xl:w-36 overflow-auto xl:pb-0 pb-2 max-h-[600px]'>
            {variant?.media?.map((thumb) => (
              <Image
                key={thumb._id}
                src={thumb?.secure_url || imgPlaceholder.src}
                width={100}
                height={100}
                alt='Product thumbnail'
                className={`md:max-w-full max-w-16 rounded cursor-pointer ${thumb.secure_url === activeThumb ? 'border-2 border-primary' : 'border'}`}
                onClick={() => handleThumb(thumb.secure_url)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className='md:w-1/2 md:mt-0 mt-5'>
          <h1 className='text-3xl font-semibold mb-2'>{product.name}</h1>
          <div className='flex items-center gap-1 mb-5'>
            {Array.from({ length: 5 }).map((_, i) => (
              <IoStar key={i} />
            ))}
            <span className='text-sm ps-2'>({reviewCount} Reviews)</span>
          </div>

          <div className='flex items-center gap-2 mb-3'>
            <span className='text-xl font-semibold'>
              {variant.sellingPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
            </span>
            <span className='text-sm line-through text-gray-500'>
              {variant.mrp.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
            </span>
            <span className='bg-red-500 rounded-2xl px-3 py-1 text-white text-xs ms-5'>
              -{variant.discountPercentage}%
            </span>
          </div>

          <div className='line-clamp-3' dangerouslySetInnerHTML={{ __html: decode(product.description) }}></div>

          {/* Color */}
          <div className='mt-5'>
            <p className='mb-2 font-semibold'>Color : {selectedColor}</p>
            <div className='flex gap-5'>
              {colors.map(color => (
                <Link
                  key={color}
                  href={`/product/${product.slug}?color=${color}&size=${selectedSize}`}
                  className={`border py-1 px-3 rounded-lg cursor-pointer hover:bg-primary hover:text-white ${color === selectedColor ? 'bg-primary text-white' : ''}`}
                >
                  {color}
                </Link>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className='mt-5'>
            <p className='mb-2 font-semibold'>Size : {selectedSize}</p>
            <div className='flex gap-5'>
              {sizes.map(size => (
                <Link
                  key={size}
                  href={`/product/${product.slug}?color=${selectedColor}&size=${size}`}
                  className={`border py-1 px-3 rounded-lg cursor-pointer hover:bg-primary hover:text-white ${size === selectedSize ? 'bg-primary text-white' : ''}`}
                >
                  {size}
                </Link>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className='mt-5'>
            <p className='font-bold mb-2'>Quantity</p>
            <div className='flex items-center h-10 border w-fit rounded-full'>
              <button className='h-full w-10 flex justify-center items-center' onClick={() => handleQty('dec')}>
                <HiMinus />
              </button>
              <input type='text' value={qty} readOnly className='w-14 text-center border-none outline-offset-0' />
              <button className='h-full w-10 flex justify-center items-center' onClick={() => handleQty('inc')}>
                <HiPlus />
              </button>
            </div>
          </div>

          {/* Add To Cart */}
          <div className='mt-5'>
            {!isAddedInToCart ? (
              <ButtonLoading type='button' text='Add To Cart' className='w-full rounded-full py-6 text-md' onClick={handleAddToCart} />
            ) : (
              <Button className='w-full rounded-full py-6 text-md' type="button">
                <Link href={WEBSITE_CART}>Go To Cart</Link>
              </Button>
            )}
          </div>
        </div>
      </div>


<div className='mb-10'>
  <div className='shadow rounded border-b'>
    <div className='p-3 bg-gray-50'> 
      <h2 className='font-semibold text-2xl'> Product Description</h2>
       </div>
       <div className='p-3'>
 <div  dangerouslySetInnerHTML={{__html:encode(product.description)}}></div>
       </div>
      
  </div>
</div>

<ProductReview productId={product._id} />

    </div>
  );
};

export default ProductDetails;
