"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"
import logoBlack from "@/public/assets/images/logo-black.png"
import logoWhite from "@/public/assets/images/logo-white.png"
import { Button } from "@/components/ui/button"
import { IoMdClose } from "react-icons/io"
import { LuChevronRight } from "react-icons/lu"
import { adminSidebarMenu } from "@/lib/adminSidebarMenu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"

const AppSidebar = () => {
  const {toggleSidebar} = useSidebar()
  return (
    <Sidebar className="z-50">
      {/* Sidebar Header */}
      <SidebarHeader className=" h-14 p-0">
        <div className="flex justify-between items-center px-4">
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
          <Button onClick={toggleSidebar} type="button" size="icon" className="md:hidden">
            <IoMdClose />
          </Button>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="p-3">
        <SidebarMenu>
          {adminSidebarMenu.map((menu, index) => (
            <Collapsible key={index} className="group/collapsible">
              {/* ✅ Parent Menu */}
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild className="font-semibold px-2 py-2">
                    <Link href={menu?.url}>
                      <menu.icon className="mr-2" />
                      {menu.title}
                      {menu.submenu && (
                        <LuChevronRight className="ml-auto transition-transform duration-200 ease-in-out group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {/* ✅ Submenu Render */}
                {menu.submenu && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {menu.submenu.map((submenuItem, submenuIndex) => (
                        <SidebarMenuItem key={submenuIndex}>
                          <SidebarMenuSubButton asChild className="px-2 py-2">
                            <Link href={submenuItem.url}>
                              {submenuItem.title}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
