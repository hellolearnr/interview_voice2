'use client';

import React, { useState } from 'react';
import { supabase } from '@/Services/SupabaseClient';
import { useUser } from '@/app/Provider';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';

function InterviewCreationDebug() {
  const { user } = useUser();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testFullFlow = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      if (!user?.email) {
        setResult({ error: 'No user email available' });
        setLoading(false);
        return;
      }
      
      // Step 1: Test form data structure
      const formData = {
        jobPosition: 'Software Engineer',
        jobDescription: 'Full-stack development with React and Node.js',
        duration: '60 minutes',
        type: 'Technical'
      };
      
      console.log('Step 1 - Form data:', formData);
      
      // Step 2: Test question list generation (mock)
      const questionList = [
        { question: 'What is React?', type: 'technical' },
        { question: 'Explain closures in JavaScript', type: 'technical' },
        { question: 'How do you handle state management?', type: 'technical' }
      ];
      
      console.log('Step 2 - Generated questions:', questionList);
      
      // Step 3: Test interview ID generation
      const interview_id = uuidv4();
      console.log('Step 3 - Generated interview ID:', interview_id);
      
      // Step 4: Prepare insert data
      const insertData = {
        jobPosition: formData.jobPosition,
        jobDescription: formData.jobDescription,
        duration: formData.duration,
        type: formData.type,
        questionList: questionList,
        email: user.email,
        interview_id: interview_id
      };
      
      console.log('Step 4 - Insert data:', insertData);
      
      // Step 5: Test database insertion
      console.log('Step 5 - Attempting database insertion...');
      
      const { data, error } = await supabase
        .from('all_interviews')
        .insert([insertData])
        .select();
      
      console.log('Insert result:', { data, error });
      
      if (error) {
        setResult({ 
          error: `Database error: ${error.message}`,
          details: error.details,
          hint: error.hint,
          step: 5
        });
      } else {
        setResult({ 
          success: true, 
          message: 'Interview created successfully',
          data: data,
          step: 5
        });
      }
    } catch (error) {
      console.error('Full flow test error:', error);
      setResult({ 
        error: `Test error: ${error.message}`,
        step: 'exception'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-purple-800 mb-2">Interview Creation Debug</h3>
      
      <div className="mb-3">
        <p className="text-sm text-purple-700">
          User email: {user?.email || 'Not available'}
        </p>
      </div>
      
      <Button 
        onClick={testFullFlow} 
        disabled={loading || !user?.email}
        variant="outline"
        size="sm"
        className="mb-3"
      >
        {loading ? 'Testing...' : 'Run Full Creation Flow'}
      </Button>
      
      {result && (
        <div className="text-sm">
          <h4 className="font-medium mb-1">Result:</h4>
          <pre className="bg-white p-2 rounded border text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default InterviewCreationDebug;