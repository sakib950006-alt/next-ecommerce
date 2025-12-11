import Image from 'next/image'
import React from 'react'
import logo from '@/public/assets/images/logo-black.png'
import Link from 'next/link'
import { USER_DASHBORD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_REGISTER, WEBSITE_SHOP } from '@/routes/websiteRoute'
import { CiLocationOn } from "react-icons/ci";
import { MdOutlinePhone } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { AiOutlineYoutube } from "react-icons/ai";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { LiaFacebook } from "react-icons/lia";
import { FiTwitter } from "react-icons/fi";
import { FiInstagram } from "react-icons/fi";


const Footer = () => {
  return (
   <footer className='bg-gray-50 border-t'>
    <div className='grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-10 py-10 lg:px-32 px-4'>
      <div className='lg:col-span-1 md:col-span-2 col-span-1'>
         <Image 
                   src={logo}
                   width={383}
                   height={146}
                   alt='logo'
                   className='w-36 mb-2'
                   />
                   <p className='text-gray-500 text-sm'>
                    E-store is your trusted destination for quality and convenience. from fasion to essentials,
                     we bring everything you need right to your doorstep. shop smart, live better - only at E-store.
                   </p>
      </div>

<div >
  <h4 className='text-xl font-bold uppercase mb-5'>Category</h4>
  <ul>
    <li className='mb-2 text-gray-500'>
      <Link href={`${WEBSITE_SHOP}?category=t-shirt`}>
      T-shirt
      </Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href={`${WEBSITE_SHOP}?category=hoodies`}>
      Hoodies
      </Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href={`${WEBSITE_SHOP}?category=oversized`}>
      Oversized
      </Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href={`${WEBSITE_SHOP}?category=full-sleeves`}>
      Fool Sleeves
      </Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href={`${WEBSITE_SHOP}?category=polo`}>
      Polo
      </Link>
    </li>
  </ul>
</div>
<div >
  <h4 className='text-xl font-bold uppercase mb-5'>Usefull Links</h4>
  <ul>
    <li className='mb-2 text-gray-500'>
      <Link href={WEBSITE_HOME}>
      Home
      </Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href={WEBSITE_SHOP}>
      Shop
      </Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href="/about-us">
      About
      </Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href={WEBSITE_REGISTER}>
      Register
      </Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href={WEBSITE_LOGIN}>
      Login
      </Link>
    </li>
  </ul>
</div>
<div >
  <h4 className='text-xl font-bold uppercase mb-5'>Help Center</h4>
  <ul>
    <li className='mb-2 text-gray-500'>
      <Link href={WEBSITE_REGISTER}>
      Register
      </Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href={WEBSITE_LOGIN}>
      Login
      </Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href={USER_DASHBORD}>
      My Account
      </Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href="/privacy-policy">
      Privacy Policy
      </Link>
    </li>
    <li className='mb-2 text-gray-500'>
      <Link href="/terms-and-conditions">
     Terms & condition
      </Link>
    </li>
  </ul>
</div>
<div >
  <h4 className='text-xl font-bold uppercase mb-5'>Contact Us</h4>
  <ul>
    <li className='mb-2 text-gray-500 flex gap-2'>
     <CiLocationOn size={20}/>
     <span className='text-sm'>E-store market Lucknow, India 256340</span>
    </li>
    <li className='mb-2 text-gray-500 flex gap-2 text-sm'>
     <MdOutlinePhone size={20}/>
     <Link href="tel:+91-7303909683"
          className='hover:text-primary '>
            +91-7303909683</Link>
    </li>
    <li className='mb-2 text-gray-500 flex gap-2 text-sm'>
     <MdOutlineEmail size={20}/>
     <Link href="mailto:sakib950006@gmail.com"
          className='hover:text-primary '>
            sakib950006@gmail.com</Link>
    </li>
    
    
  </ul>

<div className='flex gap-5 mt-5'>
<Link href='' className='text-primary'>
<AiOutlineYoutube size={20}/>
</Link>
<Link href='' className='text-primary'>
<FiInstagram size={20}/>
</Link>
<Link href='' className='text-primary'>
<AiOutlineWhatsApp  size={20} />
</Link>
<Link href='' className='text-primary'>
<LiaFacebook  size={20}/>
</Link>
<Link href='' className='text-primary'>
<FiTwitter  size={20}/>
</Link>
</div>


</div>

    </div>

    <div className='bg-gray-100 py-5 text-center'>
     <p>©2025 E-store. All Right Reserved.</p>
    </div>
   </footer>
  )
}

export default Footer