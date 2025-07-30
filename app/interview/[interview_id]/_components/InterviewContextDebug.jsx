'use client'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import React, { useContext, useEffect } from 'react'

function InterviewContextDebug() {
    const { interviewInfo } = useContext(InterviewDataContext)
    
    useEffect(() => {
        console.log('InterviewContextDebug - interviewInfo updated:', interviewInfo)
    }, [interviewInfo])
    
    return (
        <div className="fixed bottom-0 left-0 bg-black text-white p-2 text-xs z-50">
            <div>Context Debug:</div>
            <div>interviewInfo: {interviewInfo ? 'SET' : 'UNSET'}</div>
            {interviewInfo && (
                <div>
                    <div>userName: {interviewInfo.userName || 'UNDEFINED'}</div>
                    <div>interview_id: {interviewInfo.interviewData?.interview_id || 'UNDEFINED'}</div>
                </div>
            )}
        </div>
    )
}

export default InterviewContextDebug