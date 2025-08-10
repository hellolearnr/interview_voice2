'use client'
import { Button } from '@/components/ui/button';
import { Camera, Video } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { supabase } from '@/Services/SupabaseClient'; // Adjust the import based on your project structure
import { useUser } from '@/app/Provider';
import { Inter } from 'next/font/google';
import InterviewCard from './InterviewCard'; // Adjust the import based on your project structure

function LatestInterviewsList() {
  const [interviewList, setInterviewList] = React.useState([]);
  const {user} = useUser();

  useEffect(() => {
    user&&GetInterviewsList();
  }, [user]);

  const GetInterviewsList=async()=>{
    // Fetch the list of interviews from the server or API

let { data: all_interviews, error } = await supabase
  .from('all_interviews')
  .select('*')
  .eq('email',user?.email)
  .order('id', { ascending: false })
  .limit(6);

  console.log(all_interviews);
  setInterviewList(all_interviews);
}

  
  return (
    <div className="my-5">
      <h2 className='text-2xl font-bold'>Previously created interview list</h2>

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
            <InterviewCard  interview={interview} key={index} />
          ))}
        </div>
      }
    </div>
  )
}

export default LatestInterviewsList
