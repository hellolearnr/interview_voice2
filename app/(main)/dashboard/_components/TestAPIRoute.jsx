'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

function TestAPIRoute() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // Test data
      const testData = {
        jobPosition: 'Frontend Developer',
        jobDescription: 'React, Next.js, TypeScript experience required',
        duration: '45 minutes',
        type: 'Technical'
      };
      
      console.log('Calling API with test data:', testData);
      
      const response = await axios.post('/api/ai-model', testData);
      
      console.log('API response:', response.data);
      
      setResult({ 
        success: true, 
        data: response.data,
        status: response.status
      });
    } catch (error) {
      console.error('API test error:', error);
      setResult({ 
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-green-800 mb-2">Test AI Model API</h3>
      
      <Button 
        onClick={testAPI} 
        disabled={loading}
        variant="outline"
        size="sm"
        className="mb-3"
      >
        {loading ? 'Testing...' : 'Run API Test'}
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

export default TestAPIRoute;