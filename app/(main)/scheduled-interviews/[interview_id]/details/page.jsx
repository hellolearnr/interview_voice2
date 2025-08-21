'use client'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/Services/SupabaseClient'; // Adjust the import based on your project structure
import { useUser } from '@/app/Provider'; // Assuming you have a custom hook for user context

function interviewDetail() {
    const { interview_id } = useParams(); // Assuming you're using react-router for routing
    const { user } = useUser();

    useEffect(() => {
        user && GetInterviewDetails();
    }, [user]);
    
    const GetInterviewDetails = async () => {
        const result = await supabase
        .from('all_interviews')
        .select('jobPosition,duration,interview_id,interview-feedback(userEmail)')
        .eq('email', user?.email)
        .eq('interview_id', interview_id)
        .order('id', { ascending: false });

        console.log(result);
    }
  return (
    <div>
      interview detail
    </div>
  )
}

export default interviewDetail
