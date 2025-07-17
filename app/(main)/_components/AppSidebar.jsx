"use client";
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import Image from "next/image"
import { SideBarOptions } from  "@/Services/Constants";
import Link from "next/link"
import { use } from "react";
import { usePathname } from "next/navigation";



export function AppSidebar() {
// to show the active state of the sidebar items
    const path= usePathname();
    console.log("Current path:", path);
    //end of code showing the active state of the sidebar items

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center mt-5">
        <Image src="/logo.png" alt="logo" width={200} height={100}  className="w-[150px]" />
        <Button className="w-full mt-5"> <Plus/> Create New Interview</Button>
      </SidebarHeader >
      <SidebarContent>
        <SidebarGroup />
            <SidebarMenu>
            {SideBarOptions.map((option,index) => (
                <SidebarMenuItem key={index} className="p-1">
                    <SidebarMenuButton asChild className={`p-5 ${path===option.path&& 'bg-blue-100'}`}>
                        <Link href={option.path}>
                            <option.icon className={`${path===option.path&& 'text-primary'}`}/>
                            <span className={`text-[16px] font-medium ${path===option.path&& 'text-primary'}`}>{option.name}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem> 
            ))}

            </SidebarMenu>

        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  ) 
}

