"use client";
import { useUser } from "@/app/Provider"; // Assuming UserContext is defined and provides
import React from 'react'
import Image from 'next/image';


function WelcomeContainer() {
    const {user} = useUser(); // Assuming UserContext is defined and provides user data
  return (
    <div className="bg-white p-5 rounded-xl flex items-center justify-between">
        <div>
            <h2 className="text-lg font-bold">welcome back ,{user?.name}</h2>
            <h2 className="text-gray-500">AI driven interviews and prep</h2>
        </div>
       {user && <Image
            src={user?.picture}
            alt="user profile"
            width={40}
            height={40}
            className="rounded-full"
        />}
      
    </div>
  )
}

export default WelcomeContainer
