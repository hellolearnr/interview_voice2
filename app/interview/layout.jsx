'use client'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import React, { useState } from 'react'
import InterviewHeader from './_components/InterviewHeader'
import { Inter } from 'next/font/google'
import Interview from './[interview_id]/page'


function InterviewLayout({children}) {
    const [interviewInfo,setInterviewInfo]=useState();
  return (
    <InterviewDataContext.Provider value={{interviewInfo,setInterviewInfo}}>  

    <div className='bg-secondary'>
        <InterviewHeader />
       {children}
    </div>
    </InterviewDataContext.Provider>
  )
}

export default InterviewLayout
