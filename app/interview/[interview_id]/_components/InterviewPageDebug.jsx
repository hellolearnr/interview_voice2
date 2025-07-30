'use client'
import { debugLog, saveToLocalStorage } from '@/lib/debugUtils'
import React, { useEffect } from 'react'

function InterviewPageDebug({ interviewId, userName, interviewInfo }) {
    useEffect(() => {
        debugLog('=== Interview Page Debug Info ===');
        debugLog('Interview ID:', interviewId);
        debugLog('User Name:', userName);
        debugLog('Interview Info:', interviewInfo);
        
        // Save to localStorage whenever these values change
        if (interviewId && userName) {
            const debugInfo = {
                interviewId,
                userName,
                timestamp: new Date().toISOString()
            };
            saveToLocalStorage('interviewPageDebug', debugInfo);
        }
    }, [interviewId, userName, interviewInfo]);
    
    return null; // This component doesn't render anything visible
}

export default InterviewPageDebug