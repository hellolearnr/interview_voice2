'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/Services/SupabaseClient'; // Adjust the import based on your project structure
import { useUser } from '@/app/Provider'; // Assuming you have a custom hook for user context
import InterviewDetailContainer from './_components/InterviewDetailContainer';


function InterviewDetail() {
    const { interview_id } = useParams(); // Assuming you're using react-router for routing
    const { user } = useUser();
    const [interviewDetail, setInterviewDetail] = useState();

    useEffect(() => {
        user && GetInterviewDetail();
    }, [user]);
    
    const GetInterviewDetail = async () => {
        const result = await supabase
        .from('all_interviews')
        .select(`jobPosition,jobDescription,type,questionList,duration,interview_id,created_at,interview-feedback(userEmail,userName,feedback,created_at)`)
        .eq('email', user?.email)
        .eq('interview_id', interview_id)
        // .order('id', { ascending: false });

        setInterviewDetail(result?.data[0]);
        console.log(result);
    }
  return (
    <div className='mt-5'>
      <h2 className='text-2xl font-bold'>Interview Details</h2>
      <InterviewDetailContainer interviewDetail={interviewDetail} />
    </div>
  )
}

export default InterviewDetail
