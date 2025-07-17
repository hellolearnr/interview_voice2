'use client';
import { UserContext } from "@/app/Provider"; // Assuming UserContext is defined and provides
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
// import App from 'next/app'
import React from 'react'
import {AppSidebar}  from './_components/AppSidebar'
import { Sidebar } from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import WelcomeContainer from "./dashboard/_components/WelcomeContainer";

function DashboardProvider ({children}){
  return (
    <SidebarProvider>
        <AppSidebar/>
    <div className="w-full">
        {/* <SidebarTrigger /> */}
        <WelcomeContainer />
      {children}
    </div>
            </SidebarProvider>

  )
}

export default DashboardProvider

