'use client'
import { InterviewDataContext } from '@/context/InterviewDataContext';
import { Loader2Icon, Mic, Phone, Timer } from 'lucide-react';
import React, { useContext, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import InterviewStartDebug from '../_components/InterviewStartDebug';
import Vapi from '@vapi-ai/web';
import AlertConfirmation from './_components/AlertConfirmation';
import { toast } from 'sonner';
import { supabase } from '@/Services/SupabaseClient';
import { debugVapiInit } from '@/lib/audioDebug';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';





function StartInterview() {
    const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
    const vapiRef = useRef(null);
    const [activeUser, setActiveUser] = useState(false);
    const [conversation, setConversation] = useState([]);
    const conversationRef = useRef([]);
    const { interview_id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        // Initialize Vapi once
        if (!vapiRef.current) {
            try {
                const apiKey = process.env.NEXT_PUBLIC_VAPI_KEY;
                if (!apiKey) {
                    console.error('Missing NEXT_PUBLIC_VAPI_KEY');
                    toast.error('Voice is unavailable: missing API key');
                    return;
                }
                vapiRef.current = new Vapi(apiKey);
                // Log client audio/debug info (non-blocking)
                try { debugVapiInit(); } catch {}
            } catch (error) {
                console.error('Failed to initialize Vapi:', error);
                toast.error('Failed to initialize voice');
                return;
            }
        }

        // Attach event listeners with stable handler references
        const handleMessage = (message) => {
            console.log('Message:', message);
            // Prefer full conversation array if provided by SDK
            if (Array.isArray(message?.conversation)) {
                setConversation(message.conversation);
                conversationRef.current = message.conversation;
                return;
            }

            // Fallback: accumulate turn-by-turn messages when no conversation array is provided
            const role = message?.role || (message?.source === 'user' ? 'user' : message?.source) || undefined;
            const content = message?.content || message?.text || undefined;
            if (role && content) {
                const previous = Array.isArray(conversationRef.current) ? conversationRef.current : [];
                const next = [...previous, { role, content }];
                setConversation(next);
                conversationRef.current = next;
            }
        };

        const handleCallStart = () => {
            console.log('Call has started');
            toast('call has started');
        };

        const handleSpeechStart = () => {
            console.log('Assistant speech has started');
            setActiveUser(false);
        };

        const handleSpeechEnd = () => {
            console.log('Assistant Speech has ended');
            setActiveUser(true);
        };

        const handleCallEnd = () => {
            console.log('Call has stopped');
            toast('call has stopped');
            // Only attempt to generate feedback if we actually captured a conversation
            const convo = Array.isArray(conversationRef.current) ? conversationRef.current : [];
            if (convo.length > 0) {
                generateFeedback();
            } else {
                console.warn('No conversation captured by call end; skipping feedback generation');
                router.replace('/interview/'+interview_id+'/completed');
            }
        };

        const handleError = (error) => {
            // Vapi can emit non-Error objects; make logging robust and extract nested validation messages
            const safeString = (() => {
                try { return JSON.stringify(error); } catch { return String(error); }
            })();
            let parsed;
            try { parsed = typeof error === 'string' ? JSON.parse(error) : error; } catch {}
            const errorType = parsed?.type || error?.type;
            const nestedMessages = Array.isArray(error?.error?.error?.message)
                ? error.error.error.message.join('; ')
                : (error?.error?.error?.message || undefined);
            const errorMessage = nestedMessages || error?.message || error?.code || error?.name || 'Unknown error';
            console.error('Vapi error:', errorMessage, safeString);
            toast.error(`Voice error: ${errorMessage}`);

            if (errorType === 'daily-call-object-creation-error') {
                toast.error('Could not access microphone or initialize call. Check mic permissions and reload.');
                return;
            }

            // Daily meeting ends or ejection
            if (parsed?.error?.type === 'ejected' || /Meeting has ended/i.test(parsed?.errorMsg || '')) {
                console.warn('Daily meeting ended or ejected. Skipping feedback generation.');
                try { vapiRef.current?.stop(); } catch {}
                router.replace('/interview/'+interview_id+'/completed');
                return;
            }
        };

        const vapi = vapiRef.current;
        vapi.on('message', handleMessage);
        vapi.on('call-start', handleCallStart);
        vapi.on('speech-start', handleSpeechStart);
        vapi.on('speech-end', handleSpeechEnd);
        vapi.on('call-end', handleCallEnd);
        vapi.on('error', handleError);

        // Start automatically when interviewInfo is available
        if (interviewInfo) {
            startCall();
        }

        return () => {
            if (!vapiRef.current) return;
            vapi.off('message', handleMessage);
            vapi.off('call-start', handleCallStart);
            vapi.off('speech-start', handleSpeechStart);
            vapi.off('speech-end', handleSpeechEnd);
            vapi.off('call-end', handleCallEnd);
            vapi.off('error', handleError);
            // Ensure VAPI is stopped when component unmounts
            try { vapi.stop(); } catch {}
        };
    // We intentionally omit startCall from deps; handlers are stable within this effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interviewInfo]);
    
    
    const startCall = async () => {
        if (!interviewInfo || !vapiRef.current) return;

        try {
            // Pre-flight: ensure mic is accessible; avoids silent Daily creation failures
            const hasMic = await ensureMicrophoneAccess();
            if (!hasMic) {
                toast.error('Microphone permission is required to start the interview.');
                return;
            }
            let questionList = (interviewInfo?.interviewData?.questionList || [])
                .map((item) => item?.question)
                .filter(Boolean)
                .join(', ');

            const assistantOptions = {
                name: 'AI Recruiter',
                firstMessage: `Hi ${interviewInfo?.userName}, how are you? Ready for your interview on ${interviewInfo?.interviewData?.jobPosition}`,
                transcriber: {
                    provider: 'deepgram',
                    model: 'nova-2',
                    language: 'en-US',
                },
                voice: {
                    provider: 'playht',
                    voiceId: 'Jennifer',
                },
                model: {
                    provider: 'openai',
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: `You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition} interview. Let's get started with a few questions!"
Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below are the questions. Ask them one by one:
Questions: ${questionList}
If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Hint: Think about how React tracks component updates!"
Provide brief, encouraging feedback after each answer. Example:
"Nice! That's a solid answer."
"Hmm, not quite! Want to try again?"
Keep the conversation natural and engaging — use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"
After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"
End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"
Key Guidelines:
Be friendly, engaging, and witty
Keep responses short and natural, like a real conversation
Adapt based on the candidate's confidence level
Ensure the interview remains focused on React`.trim(),
                        },
                    ],
                },
            };

            setLoading(true);
            // Call Vapi.start without unsupported assistantOverrides
            await vapiRef.current.start(assistantOptions);
            setLoading(false);
        } catch (error) {
            const nestedMessages = Array.isArray(error?.error?.error?.message)
                ? error.error.error.message.join('; ')
                : (error?.error?.error?.message || undefined);
            const errorMessage = nestedMessages || error?.message || 'Failed to start voice';
            console.error('Failed to start call:', errorMessage, error);
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    // Request mic permissions in advance to reduce Daily initialization failures
    const ensureMicrophoneAccess = async () => {
        try {
            if (!navigator?.mediaDevices?.getUserMedia) {
                console.warn('getUserMedia not available');
                return false;
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false,
                }
            });
            // Immediately stop tracks; we only need permission grant
            stream.getTracks().forEach((t) => t.stop());
            return true;
        } catch (e) {
            console.error('Microphone access denied or failed:', e);
            return false;
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
        console.log('STOP...');
        try {
            vapiRef.current?.stop();
        } catch (e) {
            console.error('Error stopping call:', e);
        }
        // generateFeedback will be triggered on 'call-end'
    }
//     // from vapi docs
// vapi.on('call-start', () => {
//   console.log('Call has started');
//   toast('call has started');
// });

//     vapi.on('speech-start', () => {
//   console.log('Assistant speech has started');
//   setActiveUser(false);
// });

// vapi.on('speech-end', () => {
//   console.log('Assistant Speech has ended');
//   setActiveUser(true);
// });
// vapi.on('call-end', () => {
//   console.log('Call has stopped');
//   toast('call has stopped');
//   generateFeedback
// });
// vapi.on('message', (message) => {
//   console.log(message?.conversation);
//   setConversation(message?.conversation);
// });

// listeners are initialized in the effect above

const generateFeedback=async()=>{
  console.log("Generating feedback with conversation:", conversation);
  
  // Check if conversation is valid
  if (!conversation || conversation.length === 0) {
    console.warn("No conversation data found");
    toast("No conversation captured. Finishing interview.");
    router.replace('/interview/'+interview_id+'/completed');
    return;
  }
  
  // Send the conversation array directly
  const result=await axios.post('/api/ai-feedback',{
    conversation: conversation
  });
  
  console.log(result?.data);
  const content=result.data.content;
  
  // Handle both possible response formats from the API
  let FINAL_CONTENT;
  if (typeof content === 'string') {
    // If content is already a string, process it as before
    FINAL_CONTENT = content.replace('```json\n','').replace('```','');
  } else if (content.rawText) {
    // If content has rawText property, use that
    FINAL_CONTENT = content.rawText.replace('```json\n','').replace('```','');
  } else {
    // If content is a parsed JSON object, stringify it
    FINAL_CONTENT = JSON.stringify(content);
  }
  
  console.log("FINAL_CONTENT:", FINAL_CONTENT);
  
  // Parse the final content for database insertion
  let feedbackData;
  try {
    feedbackData = JSON.parse(FINAL_CONTENT);
  } catch (parseError) {
    // If parsing fails, store as is
    console.error("Failed to parse feedback data:", parseError);
    feedbackData = { rawFeedback: FINAL_CONTENT };
  }

  //save to supabase
const { data, error } = await supabase
  .from('interview-feedback')
  .insert([
    { userName: interviewInfo?.userName,
    userEmail: interviewInfo?.userEmail,
     interview_id: interview_id,
     feedback: feedbackData,
     // removed recommended field to avoid schema issues
    },
  ])
  .select()
  console.log(data);
  console.log(error);

  router.replace('/interview/'+interview_id+'/completed');
  // Add a small delay to ensure VAPI is fully stopped
  setTimeout(() => {
    setLoading(false);
  }, 1000);

}

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
                    <div className='relative'>
                        {!activeUser&&<span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping"/>}
                    <Image src={'/ai.png'} alt='ai'
                    width={200} height={200} className='w-[180px] h-[180px] rounded-full object-cover'
                    />
                    </div>
                    
                    <h2>AI Recruiter</h2>
                </div>
                <div className='bg-white h-[400px] rounded-2xl border flex justify-center items-center flex-col gap-3'>
                    <div className='relative'>
                        {activeUser&&<span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping"/>}
                        <h2 className='w-[180px] h-[180px] rounded-full bg-primary flex items-center justify-center font-bold text-8xl text-white'>
                            {interviewInfo?.userName?.charAt(0)?.toUpperCase() ?? ''}</h2>
                    </div>
                    
                    <h2>{interviewInfo?.userName?.trim()?.split(/\s+/)?.map(namePart => 
  namePart.charAt(0).toUpperCase() + namePart.substring(1).toLowerCase()
)?.join(' ') ?? ''}</h2>
                </div>
            </div>
            <div className='flex items-center gap-5 justify-center mt-7'>
        <Mic className='h-10 w-10 p-3 bg-gray-500 text-white rounded-full cursor-pointer' />
        {/* <AlertConfirmation stopInterview={()=>stopInterview()}>  */}
        {!loading?<Phone className='h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer'
        onClick={()=>stopInterview()} 
        />: <Loader2Icon className='animate-spin'/>}
        {/* </AlertConfirmation> */}
       
        
      </div>
      <h2 className='text-sm text-gray-400 text-center mt-5 '> Interview is in progress</h2>
        </div>
    )
}

export default StartInterview