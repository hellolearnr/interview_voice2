'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import { supabase } from '@/Services/SupabaseClient'
import { Clock, Info, Loader2Icon, Video } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
// import { useRouter } from 'next/router'
import React, { use, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'



function Interview() {
    const {interview_id}=useParams();
    console.log(interview_id);
    const [interviewData,setInterviewData]=useState();
    const [userName,setUserName]=useState();
    const [loading,setLoading]=useState(false);
    const {interviewInfo,setInterviewInfo}=useContext(InterviewDataContext);
    const router=useRouter();
   

    useEffect(() => {
        interview_id && GetInterviewDetails();
    }, [interview_id])

    const GetInterviewDetails=async()=>{
        setLoading(true);
        try{
        let {data:all_interviews,error}=await supabase
        .from ('all_interviews')
        .select("jobPosition,jobDescription,duration,type")
        .eq('interview_id',interview_id)
        setInterviewData(all_interviews[0]);
        setLoading(false);
        if(all_interviews?.length==0)
        {
            toast('incorrect interview link')
            return;
        }
        // console.log(Interviews);
        }
        catch(e)
        {
            setLoading(false);
            toast('incorrect interview link')
        }
        
    }

    const onJoinInterview=async()=>{    
        setLoading(true);
let { data: all_interviews, error } = await supabase
  .from('all_interviews')
  .select('*')
  .eq('interview_id', interview_id);
  console.log(all_interviews[0]);
  setInterviewInfo(all_interviews[0]);
  router.push('/interview/'+interview_id+'/start')
  setLoading(false);
    }
  return (
    <div className='px-10 md:px-28 lg:px-48 xl:px-80 mt-2 mb-20'>
      <div className='flex flex-col justify-center items-center border rounded-lg bg-gray-900 p-7 lg:px-33 xl:px-52'>
        <Image src={'/logo.png'} alt='logo'
        width={200} height={100} className='w-[140px]'/>
        <h2 className='mt-3'>AI powered Interview platform</h2>

        <Image src={'/interview.png'} alt='interview'
        width={500} height={500} className='w-[280px] my-6'/>
        <h2 className='font-bold text-xl '>{interviewData?.jobPosition}</h2>
        <h2 className=' flex gap-2 items-center text-gray-500'><Clock className='w-4 h-4'/>{interviewData?.duration} mins </h2>
        
        <div className='w-full'>
           <h2> Enter your full name</h2>
           <Input placeholder='e.g Raj kumar' onChange={(event)=> setUserName(event.target.value)}/>
            </div>
        <div className='p-3 bg-blue-100 flex gap-4 rounded-xl mt-5 '>
            <Info className='text-primary'/>
        <div>    
        <h2 className='font-bold'>Before you begin</h2>
            <ul className="">
                <li className='text-sm text-primary'>Test your camera and microphone</li>
                <li className='text-sm text-primary'>Ensure you have a stable internet connection</li>
                <li className='text-sm text-primary'>Find a quiet place for interview</li>
            </ul>
        </div>

        </div>
        <Button className={'mt-5 w-full font-bold'}
        disabled={loading||!userName}
        onClick={() =>onJoinInterview()}>
        <Video />{loading&&<Loader2Icon className='animate-spin' />}Join Interview</Button>
        
       


       
      </div>
    </div>
  )
}

export default Interview
