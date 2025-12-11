import AppSidebar from '@/components/Application/Admin/AppSidebar'
import ThemProvider from '@/components/Application/Admin/ThemProvider'
import Topbar from '@/components/Application/Admin/Topbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

const layout = ({children}) => {
  return (

<ThemProvider
 attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
>


  <SidebarProvider>
    <AppSidebar />
<main className=' md:w-[calc(100vw-16rem)] w-full'>
    <div className='pt-[70px] md:px-8 px-5 min-h-[calc(100vh-40px)] pb-10'>
      <Topbar />
      {children}
  </div>


<div className=' h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm'>
    © 20025 Developer shaquib . All Right Reserved
</div>


</main>
    </SidebarProvider>



</ThemProvider>
    
  
    
  )
}

export default layout