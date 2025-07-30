'use client'
import { InterviewDataContext } from '@/context/InterviewDataContext';
import {  Mic, Phone, Timer } from 'lucide-react';
import React, { useContext, useEffect } from 'react'
import Image from 'next/image'
import InterviewStartDebug from '../_components/InterviewStartDebug';





function StartInterview() {
    const {interviewInfo,setInterviewInfo}=useContext(InterviewDataContext);
    console.log(interviewInfo);

    // Restore interviewInfo from localStorage on component mount if context is empty
    useEffect(() => {
        if (!interviewInfo) {
            const savedInterviewInfo = localStorage.getItem('interviewInfo');
            if (savedInterviewInfo) {
                try {
                    const parsed = JSON.parse(savedInterviewInfo);
                    console.log("Restored interviewInfo from localStorage:", parsed);
                    setInterviewInfo(parsed);
                } catch (e) {
                    console.error("Failed to parse interviewInfo from localStorage:", e);
                }
            }
        }
    }, [interviewInfo, setInterviewInfo]);

    return (
        <div className='p-20 lg:px-48 xl:px-56 '>
            <InterviewStartDebug />
            <h2 className='font-bold text-xl justify-between flex'>AI Interview session
                <span className='flex gap-2 items-center'>
                    <Timer />
                    00:00:00
                </span>
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
                <div className='bg-white h-[400px] rounded-2xl border flex justify-center items-center flex-col gap-3'>
                    <Image src={'/ai.png'} alt='ai'
                    width={200} height={200} className='w-[180px] h-[180px] rounded-full object-cover'/>
                    <h2>AI Recruiter</h2>
                </div>
                <div className='bg-white h-[400px] rounded-2xl border flex justify-center items-center flex-col gap-3'>
                    <h2 className='w-[180px] h-[180px] rounded-full bg-primary flex items-center justify-center font-bold text-8xl text-white'>{interviewInfo?.userName?.charAt(0)?.toUpperCase() ?? ''}</h2>
                    <h2>{interviewInfo?.userName?.trim()?.split(/\s+/)?.map(namePart => 
  namePart.charAt(0).toUpperCase() + namePart.substring(1).toLowerCase()
)?.join(' ') ?? ''}</h2>
                </div>
            </div>
            <div className='flex items-center gap-5 justify-center mt-7'>
        <Mic className='h-10 w-10 p-3 bg-gray-500 text-white rounded-full cursor-pointer' />
        <Phone className='h-10 w-10 p-3 bg-red-500 text-white rounded-full cursor-pointer' />
      </div>
      <h2 className='text-sm text-gray-400 text-center mt-5 '> Interview is in progress</h2>
        </div>
    )
}

export default StartInterview
