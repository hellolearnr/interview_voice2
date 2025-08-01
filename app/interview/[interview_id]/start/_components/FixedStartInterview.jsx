'use client'

import { InterviewDataContext } from '@/context/InterviewDataContext';
import { Mic, Phone, Timer } from 'lucide-react';
import React, { useContext, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import InterviewStartDebug from '../_components/InterviewStartDebug';
import Vapi from '@vapi-ai/web';
import AlertConfirmation from './_components/AlertConfirmation';
import VapiDebugFix from './_components/VapiDebugFix';
import { toast } from 'sonner';
import VAPI_DEBUG_CONFIG, { logVapiDebugInfo, handleKrispError, handleEjectionError } from './_components/VapiDebugConfig';

function FixedStartInterview() {
    const {interviewInfo,setInterviewInfo}=useContext(InterviewDataContext);
    const vapiRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);

    // Initialize Vapi with error handling
    useEffect(() => {
        let retryTimeout;
        let retryCount = 0;
        
        const initializeVapi = () => {
            try {
                if (!vapiRef.current) {
                    logVapiDebugInfo('Initializing Vapi with debug config...');
                    vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY);
                    
                    // Add event listeners
                    vapiRef.current.on('error', handleVapiError);
                    vapiRef.current.on('disconnect', handleDisconnect);
                    vapiRef.current.on('connect', handleConnect);
                    vapiRef.current.on('speech-start', () => logVapiDebugInfo('Speech started'));
                    vapiRef.current.on('speech-end', () => logVapiDebugInfo('Speech ended'));
                }
            } catch (error) {
                console.error('Failed to initialize Vapi:', error);
                setConnectionError('Failed to initialize Vapi: ' + error.message);
            }
        };
        
        const handleVapiError = (error) => {
            logVapiDebugInfo('Vapi error received:', error);
            setConnectionError(error.message);
            
            // Handle KrispSDK noise filter error specifically
            if (error.message && error.message.includes('KrispSDK')) {
                const krispResult = handleKrispError(error);
                logVapiDebugInfo(krispResult.message);
                toast.info('Audio processing issue detected. Continuing...');
                // The call should continue despite this error
                return;
            } else {
                toast.error('Connection error: ' + error.message);
            }
            
            // Handle retry logic for other errors
            if (retryCount < VAPI_DEBUG_CONFIG.retryConfig.maxRetries) {
                retryCount++;
                logVapiDebugInfo(`Retrying connection (${retryCount}/${VAPI_DEBUG_CONFIG.retryConfig.maxRetries})...`);
                retryTimeout = setTimeout(() => {
                    if (vapiRef.current) {
                        vapiRef.current.stop();
                        vapiRef.current = null;
                    }
                    initializeVapi();
                    if (interviewInfo) {
                        startCall();
                    }
                }, VAPI_DEBUG_CONFIG.retryConfig.retryDelay);
            }
        };
        
        const handleConnect = () => {
            logVapiDebugInfo('Vapi connected successfully');
            setIsConnected(true);
            setConnectionError(null);
            retryCount = 0; // Reset retry count on successful connection
        };
        
        const handleDisconnect = (reason) => {
            logVapiDebugInfo('Vapi disconnected. Reason:', reason);
            setIsConnected(false);
            
            // Handle ejection reason
            if (reason?.type === 'ejection') {
                const ejectionResult = handleEjectionError(reason);
                logVapiDebugInfo('Meeting ended due to ejection:', ejectionResult);
                toast.info('Interview ended');
            }
        };
        
        initializeVapi();
        
        // Start call if interview info is available
        if (interviewInfo && vapiRef.current) {
            startCall();
        }
        
        // Cleanup on unmount
        return () => {
            if (retryTimeout) clearTimeout(retryTimeout);
            if (vapiRef.current) {
                vapiRef.current.stop();
                vapiRef.current = null;
            }
        };
    }, [interviewInfo]);

    const startCall = async () => {
        if (!interviewInfo || !vapiRef.current) return;
        
        try {
            console.log('Starting Vapi call...');
            
            let questionList = '';
            interviewInfo?.interviewData?.questionList.forEach((item) => {
                questionList = item?.question + "," + questionList;
            });
            
            const assistantOptions = {
                name: "AI Recruiter",
                firstMessage: "Hi "+interviewInfo?.userName+", how are you? Ready for your interview on "+interviewInfo?.interviewData?.jobPosition,
                transcriber: {
                    provider: "deepgram",
                    model: "nova-2",
                    language: "en-US",
                },
                voice: {
                    provider: "playht",
                    voiceId: "Jennifer",
                },
                model: {
                    provider: "openai",
                    model: "gpt-4",
                    messages: [
                        {
                            role: "system",
                            content: `You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition} interview. Let's get started with a few questions!"
Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below Are
the questions ask one by one:
Questions: ${questionList}
If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Hint: Think about how React tracks component updates!"
Provide brief, encouraging feedback after each answer. Example:
"Nice! That's a solid answer."
"Hmm, not quite! Want to try again?"
Keep the conversation natural and engaging-use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"
After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"
End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"
Key Guidelines:
Be friendly, engaging, and witty
Keep responses short and natural, like a real conversation
Adapt based on the candidate's confidence level
Ensure the interview remains focused on React`
                            .trim(),
                        },
                    ],
                }
            };
            
            // Start the call
            vapiRef.current.start(assistantOptions);
            
        } catch (error) {
            console.error('Failed to start call:', error);
            setConnectionError('Failed to start interview: ' + error.message);
            toast.error('Failed to start interview: ' + error.message);
        }
    };

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

    const stopInterview = () => {
        try {
            if (vapiRef.current) {
                console.log('Stopping interview...');
                vapiRef.current.stop();
                toast.info('Interview ended');
            }
        } catch (error) {
            console.error('Error stopping interview:', error);
            toast.error('Error ending interview: ' + error.message);
        }
    };

    return (
        <div className='p-5 lg:p-10'>
            <InterviewStartDebug />
            <VapiDebugFix vapiInstance={vapiRef.current} />
            
            {/* Connection status indicator */}
            {process.env.NODE_ENV === 'development' && (
                <div className={`p-2 rounded mb-3 text-sm ${
                    isConnected ? 'bg-green-100 text-green-800' : 
                    connectionError ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                }`}>
                    Status: {isConnected ? 'Connected' : connectionError ? `Error: ${connectionError}` : 'Connecting...'}
                </div>
            )}
            
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
                    <h2 className='w-[180px] h-[180px] rounded-full bg-primary flex items-center justify-center font-bold text-8xl text-white'>
                        {interviewInfo?.userName?.charAt(0)?.toUpperCase() ?? ''}
                    </h2>
                    <h2>
                        {interviewInfo?.userName?.trim()?.split(/\s+/)?.map(namePart => 
                            namePart.charAt(0).toUpperCase() + namePart.substring(1).toLowerCase()
                        )?.join(' ') ?? ''}
                    </h2>
                </div>
            </div>
            <div className='flex items-center gap-5 justify-center mt-7'>
                <Mic className='h-10 w-10 p-3 bg-gray-500 text-white rounded-full cursor-pointer' />
                <AlertConfirmation stopInterview={stopInterview}> 
                    <Phone className='h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer' />
                </AlertConfirmation>
            </div>
            <h2 className='text-sm text-gray-400 text-center mt-5 '>Interview is in progress</h2>
        </div>
    )
}

export default FixedStartInterview;