'use client';

import React, { useState } from 'react';
import { supabase } from '@/Services/SupabaseClient';
import { useUser } from '@/app/Provider';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';

function TestDatabaseInsertion() {
  const { user } = useUser();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testInsert = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      if (!user?.email) {
        setResult({ error: 'No user email available' });
        setLoading(false);
        return;
      }
      
      // Test data
      const testData = {
        jobPosition: 'Test Position',
        jobDescription: 'Test Description',
        duration: '30 minutes',
        type: 'Technical',
        questionList: [{ question: 'Test question?', type: 'technical' }],
        email: user.email,
        interview_id: uuidv4()
      };
      
      console.log('Inserting test data:', testData);
      
      // First check if we can read the table structure
      const { data: schemaData, error: schemaError } = await supabase
        .from('all_interviews')
        .select('*')
        .limit(0);
      
      console.log('Schema check result:', { schemaData, schemaError });
      
      // Try the insert operation
      const { data, error } = await supabase
        .from('all_interviews')
        .insert([testData])
        .select();
      
      console.log('Insert result:', { data, error });
      
      if (error) {
        setResult({ 
          error: error.message,
          details: error.details,
          hint: error.hint
        });
      } else {
        setResult({ success: true, data });
      }
    } catch (error) {
      console.error('Test insert error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-blue-800 mb-2">Test Database Insertion</h3>
      
      <div className="mb-3">
        <p className="text-sm text-blue-700">
          User email: {user?.email || 'Not available'}
        </p>
      </div>
      
      <Button 
        onClick={testInsert} 
        disabled={loading || !user?.email}
        variant="outline"
        size="sm"
        className="mb-3"
      >
        {loading ? 'Testing...' : 'Run Test Insert'}
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

export default TestDatabaseInsertion;