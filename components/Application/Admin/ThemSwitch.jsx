"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";


const ThemSwitch = () => {
      const { setTheme } = useTheme()
  return (
  <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button type="button" variant="ghost" size="icon" className="cursor-pointer">
      <IoSunnyOutline className="dark:hidden" />
      <IoMoonOutline className="hidden dark:block" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
   
   
    <DropdownMenuItem onClick={()=>setTheme('light')}>
        light
    </DropdownMenuItem>
     <DropdownMenuItem onClick={()=>setTheme('dark')}>
        Dark
    </DropdownMenuItem>
     <DropdownMenuItem onClick={()=>setTheme('system')}>
        System
    </DropdownMenuItem>


  </DropdownMenuContent>
</DropdownMenu>

  )
}

export default ThemSwitch