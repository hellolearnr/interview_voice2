"use client"
import React, { useEffect } from 'react'
import { supabase } from '@/Services/SupabaseClient'; // Adjust the import based on your project structure
import { useUser } from '@/app/Provider';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import InterviewCard from '@/app/(main)/dashboard/_components/InterviewCard';




function ScheduledInterview() {
    const {user} = useUser();
    const [interviewList, setInterviewList] = React.useState([]);
    React.useEffect(() => {
        user && GetInterviewList();
    }, [user]);
  const GetInterviewList=async() => {
    // Logic to fetch scheduled interviews
  const result = await supabase
        .from('all_interviews')
        .select('jobPosition,duration,interview_id,interview-feedback(userEmail)')
        .eq('email', user?.email)
        .order('id', { ascending: false });
        console.log(result);
        setInterviewList(result.data);
  }
    return (
    <div className='mt-5'>
      <h2 className='text-lg font-bold'>Interview report with candiate feedback</h2>
    {interviewList?.length == 0 &&
        <div className=" p-5 flex flex-col items-center gap-3 mt-5 ">
              <Video className='h-10 w-10 text-primary' />
              <h2>No interviews created yet</h2>
              <Button>+ Create New Interview</Button>
        </div>
      }
      {interviewList&&
        <div className="grid grid-cols-2 mt-5 xl:grid-cols-3 gap-5">
          {interviewList.map((interview, index) => (
            <InterviewCard  interview={interview} key={index} 
            viewDetail={true}
            />

          ))}
        </div>
      }
    </div>
  )
}

export default ScheduledInterview