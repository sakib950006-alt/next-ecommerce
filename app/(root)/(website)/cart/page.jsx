"use client"
import WebsiteBreadcrumb from '@/components/Application/Website/WebsiteBreadcrumb'
import { Button } from '@/components/ui/button'
import { WEBSITE_CHECKOUT, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from '@/routes/websiteRoute'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import  ImagePlaceholder  from '@/public/assets/images/img-placeholder.webp'
import { HiMinus, HiPlus } from 'react-icons/hi2';
import { IoCloseCircleOutline } from "react-icons/io5";
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/store/reducer/cartReducer'


const breadCrumb ={
  title: 'Cart',
  links:[
    {label:'Cart'}
  ]
}

const CartPage = () => {

  const dispatch = useDispatch()
const cart = useSelector(store => store.cartStore)

  const [subtotal, setSubtotal] = useState(0)
  const [discount, setDiscount] = useState(0)




useEffect(()=>{
    const cartProducts = cart.Products
    const totalAmount = cartProducts.reduce((sum, product) => sum + (product.sellingPrice * product.qty), 0)


    const discount = cartProducts.reduce((sum, product) => sum + ((product.mrp - product.sellingPrice )* product.qty), 0)

 setSubtotal(totalAmount)
setDiscount(discount)



  },[cart])



  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumb} />
      {cart.count === 0  
      ?
      <div className='w-screen h-[500px] flex justify-center items-center py-32'>
        <div className='text-center'>
          <h4 className='text-4xl font-semibold mb-5'> Your Cart is Empty</h4>
          <Button type="button" asChild>
            <Link href={WEBSITE_SHOP}>Continue Shopping</Link>
          </Button>
        </div>
      </div>
      :
      <div className='flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4'>
        <div className='lg:w-[70%] w-full'>
          <table className='w-full border'>
            <thead className='border-b bg-gray-50 md:table-header-group hiden'>
              <tr>
                <th className='text-start p-3'>Product</th>
                <th className='text-center p-3'>Price</th>
                <th className='text-center p-3'>Quantity</th>
                <th className='text-center p-3'>Total</th>
                <th className='text-center p-3'>Action</th>
              </tr>
            </thead>
            <tbody>
              { cart.Products.map(product => (
                <tr key={product.variantId} className='md:table-row block border-b'>
                  <td className='p-3'>
                    <div className='flex items-center gap-5'>
                      <Image
                      src={product.media || ImagePlaceholder.src}
                      width={60}
                      height={60}
                      alt={product.name}
                      />
                      <div>
                        <h4>
                          <Link className='text-lg font-medium kine-clamp-1 ' href={WEBSITE_PRODUCT_DETAILS(product.url)}>
                          {product.name}
                          </Link>
                        </h4>
                        <p className='text-sm'>Color:{product.color}</p>
                        <p className='text-sm'>Size:{product.size}</p>
                      </div>
                    </div>
                  </td>
                  <td className="flex md:table-cell justify-between md:justify-center p-3 text-center">
                    <span className='md:hidden font-medium pr-32'>Price</span>
                    <span>
                       { product.sellingPrice.toLocaleString('en-In', {style:'currency', currency : 'INR'})}  
                    </span>
                  
                  </td>
       <td className="md:table-cell md:p-3 px-3 pb-2">
  {/* Wrapper div for flex spacing */}
  <div className="flex w-full justify-between md:justify-center items-center ">

    {/* Mobile label */}
    <span className="md:hidden font-medium pr-38">Quantity</span>

    {/* Quantity box */}
    <div className="flex justify-center">
      <div className="flex justify-center items-center md:h-10 border w-fit rounded-full">
        <button
          className="h-full w-10 flex justify-center items-center cursor-pointer"
          onClick={() => dispatch(decreaseQuantity({productId:product.productId, variantId:product.variantId}))}
        >
          <HiMinus />
        </button>

        <input
          type="text"
          value={product.qty}
          readOnly
          className="md:w-14 w-8 text-center border-none outline-offset-0"
        />

        <button
          className="h-full w-10 flex justify-center items-center cursor-pointer"
          onClick={() => dispatch(increaseQuantity({productId:product.productId, variantId:product.variantId}))}
        >
          <HiPlus />
        </button>
      </div>
    </div>

  </div>
</td>
<td className='md:table-cell flex md:p-3 px-3 pb-2 text-center'>
<span className='md:hidden font-medium pr-60'>Total</span>
 <span>
     {(product.sellingPrice * product.qty).toLocaleString('en-In', {style:'currency', currency : 'INR'})}  
                    </span>
</td>


                  <td className='md:table-cell flex md:p-3 px-3 pb-2 text-center'>
                    <span className="md:hidden font-medium pr-60">Remove</span>
                    <button type='button'onClick={() => dispatch(removeFromCart({productId:product.productId, variantId:product.variantId}))}
                      className='text-red-500'
                      >
                        <IoCloseCircleOutline size={26} className='cursor-pointer' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='lg:w-[30%] w-full'>
          <div className='rounded bg-gray-50 p-5 sticky top-5 '>
            <h4 className='text-lg font-semibold mb-5'>Order Summary</h4>
            <div>
              <table className='w-full'>
                <tbody>
                  <tr>
                    <td className='font-medium py-2'>SubTotal</td>
                    <td className='text-end py-2'>
                      {subtotal.toLocaleString('en-In', {style: 'currency', currency: 'INR'})}
                    </td>
                  </tr>
                  <tr>
                    <td className='font-medium py-2'>Discount</td>
                    <td className='text-end py-2'>
                       -{discount.toLocaleString('en-In', {style: 'currency', currency: 'INR'})}
                    </td>
                  </tr>
                  <tr>
                    <td className='font-medium py-2'>Total</td>
                    <td className='text-end py-2'>
                       {subtotal.toLocaleString('en-In', {style: 'currency', currency: 'INR'})}
                    </td>
                  </tr>
                </tbody>
              </table>
              <Button type="button" asChild className='w-full bg-black rounded-full mt-5 mb-3'>
                <Link href={WEBSITE_CHECKOUT}>Procedd to Checkout</Link>
              </Button>
              <p className='text-center'>
                <Link  href={WEBSITE_SHOP} className='hover:underline'>Countinue Shopping</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  )
}

export default CartPage