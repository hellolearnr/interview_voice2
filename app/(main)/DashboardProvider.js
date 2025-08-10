'use client';
import { SidebarProvider } from '@/components/ui/sidebar'
// import App from 'next/app'
import React from 'react'
import {AppSidebar}  from './_components/AppSidebar'
import WelcomeContainer from "./dashboard/_components/WelcomeContainer";

function DashboardProvider ({children}){
  return (
    <SidebarProvider>
        <AppSidebar/>
    <div className="w-full">
        <WelcomeContainer />
      {children}
    </div>
            </SidebarProvider>

  )
}

export default DashboardProvider

