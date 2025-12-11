'use client'
import React, { use } from 'react'
import ThemSwitch from './ThemSwitch'
import UserDropdown from './UserDropdown'
import { Button } from '@/components/ui/button'
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from '@/components/ui/sidebar';
import AdminSearch from './AdminSearch'
import logoBlack from "@/public/assets/images/logo-black.png"
import logoWhite from "@/public/assets/images/logo-white.png"
import Image from 'next/image'
import AdminMobileSearch from './AdminMobileSearch'

const Topbar = () => {
  const {toggleSidebar} = useSidebar()
  return (
    <div className='fixed border h-14 w-full top-0 left-0 z-30 
  md:pl-72 md:pr-8 px-5 flex justify-between items-center 
  bg-white dark:bg-card'>
       <div className='flex items-center md:hidden'>
        <Image
                    src={logoBlack}
                    height={50}
                    width={logoBlack.width}
                    className="block dark:hidden h-[50px] w-auto"
                    alt="logo dark"
                  />
                  <Image
                    src={logoWhite}
                    height={50}
                    width={logoBlack.width}
                    className="hidden dark:block h-[50px] w-auto"
                    alt="logo white"
                  />
       </div>
        <div className=' md:block hidden' >
            <AdminSearch />
        </div>
        <div className='flex items-center gap-2 '>
          <AdminMobileSearch />
            <ThemSwitch />
           <UserDropdown />
           <Button onClick={toggleSidebar} type="button" size="icon" className="ms-2 md:hidden">
            <RiMenu4Fill />
           </Button>
        </div>


    </div>
  )
}

export default Topbar