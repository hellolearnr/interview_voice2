'use client'
import { debugLog, loadFromLocalStorage } from '@/lib/debugUtils'
import React, { useEffect } from 'react'

function InterviewStartDebug() {
    useEffect(() => {
        // Log URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const pathParts = window.location.pathname.split('/');
        const interviewIdFromUrl = pathParts[pathParts.length - 2]; // Get interview ID from URL
        
        debugLog('=== Interview Start Debug Info ===');
        debugLog('Full URL:', window.location.href);
        debugLog('Interview ID from URL:', interviewIdFromUrl);
        debugLog('URL Params:', Object.fromEntries(urlParams));
        
        // Check localStorage for interviewInfo
        const savedInterviewInfo = loadFromLocalStorage('interviewInfo');
        debugLog('Saved interviewInfo in localStorage:', savedInterviewInfo);
        
        // Check sessionStorage for interviewInfo
        const sessionInterviewInfo = loadFromLocalStorage('interviewInfo');
        debugLog('Saved interviewInfo in sessionStorage:', sessionInterviewInfo);
    }, []);
    
    return null; // This component doesn't render anything visible
}

export default InterviewStartDebug