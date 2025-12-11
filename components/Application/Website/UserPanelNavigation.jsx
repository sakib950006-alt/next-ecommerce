"use client"
import { Button } from '@/components/ui/button'
import { USER_DASHBORD, USER_ORDERS, USER_PROFILE, WEBSITE_LOGIN } from '@/routes/websiteRoute'
import { logout } from '@/store/reducer/authReducer'
import axios from 'axios'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const UserPanelNavigation = () => {
    const pathname = usePathname()
    const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { data: logoutResponse } = await axios.post("/api/auth/logout");

      if (!logoutResponse?.success) {
        throw new Error("Logout failed");
      }

      dispatch(logout());
      toast.success("Logout successful");
      router.push(WEBSITE_LOGIN);
    } catch (error) {
      toast.error("Logout failed");
    }
  };
  return (
    <div className='border shadow-sm p-4 rounded'>
        <ul>
            <li className='mb-2'>
                <Link href={USER_DASHBORD} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white 
                    ${pathname.startsWith(USER_DASHBORD)? 'bg-primary text-white' : ''}`}>Dashbord</Link>
            </li>
            <li className='mb-2'>
                <Link href={USER_PROFILE} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white 
                    ${pathname.startsWith(USER_PROFILE)? 'bg-primary text-white' : ''}`}>Profile</Link>
            </li>
            <li className='mb-2'>
                <Link href={USER_ORDERS} className={`block p-3 text-sm rounded hover:bg-primary hover:text-white 
                    ${pathname.startsWith(USER_ORDERS)? 'bg-primary text-white' : ''}`}>Orders</Link>
            </li>
            <li className='mb-2'>
                <Button type='button' onClick={handleLogout} variant="destructive" className='w-full'>
                    Logout
                </Button>
            </li>
        </ul>
        
    </div>
  )
}

export default UserPanelNavigation