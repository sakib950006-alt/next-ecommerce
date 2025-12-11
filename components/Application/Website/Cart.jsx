"use client"
import { BsCart2 } from "react-icons/bs";
 import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import ImagePlaceholder  from '@/public/assets/images/img-placeholder.webp';
import { removeFromCart } from "@/store/reducer/cartReducer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WEBSITE_CART, WEBSITE_CHECKOUT } from "@/routes/websiteRoute";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Cart = () => {
  const [open,setOpen] = useState(false)
  const [subtotal, setSubtotal] = useState(0)
  const [discount, setDiscount] = useState(0)

 const cart = useSelector(store => store.cartStore);
  const dispatch = useDispatch()


  useEffect(()=>{
    const cartProducts = cart.Products
    const totalAmount = cartProducts.reduce((sum, product) => sum + (product.sellingPrice * product.qty), 0)


    const discount = cartProducts.reduce((sum, product) => sum + ((product.mrp - product.sellingPrice )* product.qty), 0)

 setSubtotal(totalAmount)
setDiscount(discount)



  },[cart])


 
  return (
 <Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger className="relative">
    <BsCart2 size={25}  className="text-gray-500 hover:text-primary cursor-pointer"/>
    <span className="absolute bg-red-500 text-white text-xs rounded-full w-4 h-4 flex justify-center items-center -right-2 -top-1">{cart.count}</span>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle className='text-2xl'>My Cart</SheetTitle>
      <SheetDescription></SheetDescription>
    </SheetHeader>

<div className="h-[calc(100vh-40px)] pb-10 ">
  <div className="h-[calc(100%-135px)] overflow-auto px-2">

{cart.count === 0 && <div className="h-full flex justify-center items-center text-xl font-semibold">
  Your Cart is Empty.
  
  </div>}

{cart.Products?.map(product => (
  <div key={product.variantId} className="flex justify-between items-center gap-5 mb-4 border-b pb-4">
    <div className="flex gap-5 items-center">
      <Image
        src={product.media || ImagePlaceholder.src}
        height={100}
        width={100}
        alt={product.name}
        className="w-20 h-20 rounded border"
      />
      <div>
        <h4 className="text-lg-mb-1">{product.name}</h4>
        <p className="text-gray-500">
          {product.size}/{product.color}
        </p>
      </div>
    </div>

<div>
  <button  type="button" className="text-red-500 underline underline-offset-1 mb-2 cursor-pointer"
  onClick={()=>dispatch(removeFromCart({productId : product.productId, variantId : product.variantId}))}
  >
    Remove
  </button>
  <p className="font-semibold">
    {product.qty} x {product.sellingPrice.toLocaleString('en-In', {style:'currency', currency : 'INR'})}
  </p>
</div>

  </div>
))}


  </div>
  <div className="h-32 border-t pt-5 px-2">
    <h2 className="flex justify-between items-center text-lg font-semibold">
      <span>Subtotal</span>
      <span>{subtotal.toLocaleString('en-In', {style:'currency', currency : 'INR'})}</span>
    </h2>
    <h2 className="flex justify-between items-center text-lg font-semibold">
      <span>Discount</span>
      <span>{discount.toLocaleString('en-In', {style:'currency', currency : 'INR'})}</span>
    </h2>
    <div className="flex justify-between gap-5 mt-3">
      <Button type="button" asChild variant="secondary" className='w-[170px]' onClick={()=> setOpen(false)}>
        <Link href={WEBSITE_CART}>View Cart</Link>
      </Button>
      <Button type="button" asChild  className='w-[170px]' onClick={()=> setOpen(false)}>
      {cart.count?
      <Link href={WEBSITE_CHECKOUT}>Checkout</Link>
      :
      <button type="button" onClick={() => toast.error('Your cart is Empty!')}>Checkout</button>
    }
        
      </Button>
    </div>
  </div>
</div>


  </SheetContent>
</Sheet>

 
  )
}

export default Cart