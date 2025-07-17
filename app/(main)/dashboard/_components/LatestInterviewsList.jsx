'use client'
import { Button } from '@/components/ui/button';
import { Camera, Video } from 'lucide-react';
import React from 'react'

function LatestInterviewList() {
  const [interviewList, setInterviewList] = React.useState([]);
  return (
    <div className="my-5">
      <h2 className='text-2xl font-bold my-5'>Previously created interview list</h2>

      {interviewList.length == 0 &&
        <div className=" p-5 flex flex-col items-center gap-3 mt-5 ">
              <Video className='h-10 w-10 text-primary' />
              <h2>No interviews created yet</h2>
              <Button>+ Create New Interview</Button>
        </div>
      }

    </div>
  )
}

export default LatestInterviewList
