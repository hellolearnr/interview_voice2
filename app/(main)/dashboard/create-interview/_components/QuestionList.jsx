'use client'
import React, { useEffect,useState } from 'react'
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

function QuestionList({formData}) {
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    
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
            
            console.log(result.data);
            
            // Handle the response based on the new structure
            if (result.data.content) {
                // Try to parse JSON if it's a JSON string
                try {
                    const parsedQuestions = JSON.parse(result.data.content);
                    setQuestions(parsedQuestions.interviewQuestions || []);
                } catch (parseError) {
                    // If not JSON, treat as plain text
                    setQuestions([{ question: result.data.content, type: 'Generated' }]);
                }
            }
            
            setLoading(false);
        } catch(e) {
            console.error('Error:', e);
            toast('Failed to generate questions');
            setLoading(false);
        }
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
            
            {!loading && questions.length > 0 && (
                <div className='mt-5'>
                    <h2 className='text-lg font-semibold mb-3'>Generated Questions:</h2>
                    {questions.map((q, index) => (
                        <div key={index} className='mb-3 p-3 border rounded-lg'>
                            <p className='font-medium'>{q.question}</p>
                            <span className='text-sm text-gray-500'>Type: {q.type}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default QuestionList