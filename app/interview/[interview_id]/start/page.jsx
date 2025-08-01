'use client'
import { InterviewDataContext } from '@/context/InterviewDataContext';
import {  Mic, Phone, Timer } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import InterviewStartDebug from '../_components/InterviewStartDebug';
import Vapi from '@vapi-ai/web';
import AlertConfirmation from './_components/AlertConfirmation';


function StartInterview() {
    const {interviewInfo,setInterviewInfo}=useContext(InterviewDataContext);
    console.log(interviewInfo);
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY);
    const {activeUser,setActiveUser}=useState(false);
    

    useEffect(() => {
        interviewInfo&&startCall();
    }, [interviewInfo])
    
    
    const startCall = async () => {
        if(interviewInfo){
            let questionList;
            interviewInfo?.interviewData?.questionList.forEach((item,index)=>(
                questionList=item?.question+","+questionList
            ));
            // console.log(questionList);
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
"Hey there! Welcome to your `+interviewInfo?.interviewData?.jobPosition+` interview. Let's get started with a few questions!"
Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below Are
the questions ask one by one:
Questions: `+questionList+`
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
             vapi.start(assistantOptions);
        
    }
}

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

    const stopInterview=() => {
        vapi.stop()
    }
    // from vapi docs
vapi.on('call-start', () => {
  console.log('Call has started');
  toast('call has started');
});

    vapi.on('speech-start', () => {
  console.log('Assistant speech has started');
  setActiveUser(false);
});

vapi.on('speech-end', () => {
  console.log('Assistant Speech has ended');
  setActiveUser(true);
});
vapi.on('call-end', () => {
  console.log('Call has stopped');
  toast('call has stopped');
});

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
        <AlertConfirmation stopInterview={()=>stopInterview()}> 
        <Phone className='h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer' />
        </AlertConfirmation>
       
        
      </div>
      <h2 className='text-sm text-gray-400 text-center mt-5 '> Interview is in progress</h2>
        </div>
    )
}

export default StartInterview