'use client'
import React, { useEffect,useState } from 'react'
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/Services/SupabaseClient';
import {v4 as uuidv4} from 'uuid';
import QuestionListContainer from './QuestionListContainer';
import { useUser } from '@/app/Provider';




function QuestionList({formData}) {
    const {user} = useUser();
    const [loading, setLoading] = useState(true);
    const [questionList, setQuestions] = useState([]);
    
    useEffect(() => {
        if(formData) {
            GenerateQuestionList()
        }
    }, [formData]);
    
    const GenerateQuestionList = async() => {
        setLoading(true);
        try {
            const result = await axios.post('/api/ai-model', {
                ...formData
            });
            
            console.log("API Response:", result.data);
            
            // Handle the response based on the new structure
            if (result.data.content) {
                // Check if content is already an object (parsed JSON)
                if (typeof result.data.content === 'object' && result.data.content.interviewQuestions) {
                    setQuestions(result.data.content.interviewQuestions);
                } else if (typeof result.data.content === 'string') {
                    // Try to parse JSON if it's a string
                    try {
                        const parsedQuestions = JSON.parse(result.data.content);
                        setQuestions(parsedQuestions.interviewQuestions || []);
                    } catch (parseError) {
                        console.log("Not JSON format, treating as plain text");
                        setQuestions([{ question: result.data.content, type: 'Generated' }]);
                    }
                } else if (result.data.content.rawText) {
                    // Handle raw text fallback
                    setQuestions([{ question: result.data.content.rawText, type: 'Generated' }]);
                }
            }
            
            setLoading(false);
        } catch(e) {
            console.error('Full error object:', e);
            console.error('Error response:', e.response?.data);
            console.error('Error status:', e.response?.status);
            
            // Show more detailed error message
            const errorMessage = e.response?.data?.details || e.response?.data?.error || 'Failed to generate questions';
            toast(errorMessage);
            setLoading(false);
        }
        
    }
    const onFinish=async()=>{
          const interview_id=uuidv4();
          
const { data, error } = await supabase
  .from('all_interviews')
  .insert([
    {
    ...formData,
    questionList:questionList,
    email:user?.email,
    interview_id:interview_id
    }
  ])
  .select()

  if(error) {
    console.error("Error inserting data:", error);
    toast("Error saving interview details");
    return;
  }
  console.log("Data inserted successfully:", data);
  toast("Interview details saved successfully");
          
        }

    return (
        <div>
            {loading && (
                <div className='bg-blue-50 p-5 border border-gray-100 rounded-xl flex gap-5 items-center'>
                    <Loader2 className='animate-spin' />
                    <div>
                        <h2>Generating Questions...</h2>
                        <p>Personalising questions</p>
                    </div>
                </div>
            )}
            
            {!loading && questionList.length > 0 && (
                <div className='mt-5'>
                    <QuestionListContainer questionList={questionList} />
                </div>
            )}
            <div className='flex justify-end mt-5'>
              <Button onClick={() => onFinish()}>Finish</Button>
            </div>
        </div>
    )
}

export default QuestionList