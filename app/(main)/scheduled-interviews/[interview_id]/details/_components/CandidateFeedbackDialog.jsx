import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

function CandidateFeedbackDialog({candidate}) {
    const feedback = candidate?.feedback?.feedback || "No feedback provided yet.";
  return (
    <div>
      <Dialog>
  <DialogTrigger asChild>
    <Button variant={'outline'} className='text-primary'>view report</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Feedback</DialogTitle>
      <DialogDescription asChild>
        <div>
            <div className='flex justify-between items-center '>
            <div className='flex items-center gap-3 flex-1'>
                        <h2 className='bg-primary p-3 px-4.5 font-bold text-white rounded-full'>{candidate.userName[0]}</h2>
                      
                        <div>
                        <h2 className='font-bold'>{candidate.userName}</h2>
                        <h2 className='text-gray-500 text-sm'>{candidate?.userEmail}</h2>
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        <h2 className='text-primary text-2xl font-bold'>6/10</h2>
                        
                      </div>
                      </div>
                      <div className='mt-5'>
                        <h2 className='font-bold'>Skill assessment</h2>
                        <div className='mt-3 grid grid-cols-2 lg:grid-cols-3 gap-10'>
                            <div>
                                <h2 className='flex justify-between'>Technical Skills<span>{feedback?.rating?.technicalSkills}/10</span></h2>
                                <Progress value={feedback?.rating?.technicalSkills * 10} className='rounded-full mt-1 ' />
                            </div>
                            <div>
                                <h2 className='flex justify-between'>Communication Skills<span>{feedback?.rating?.communication}/10</span></h2>
                                <Progress value={feedback?.rating?.communication * 10} className='rounded-full mt-1 ' />
                            </div>
                            <div>
                                <h2 className='flex justify-between'>Problem Solving<span>{feedback?.rating?.problemSolving}/10</span></h2>
                                <Progress value={feedback?.rating?.problemSolving * 10} className='rounded-full mt-1 ' />
                            </div>
                            <div>
                                <h2 className='flex justify-between'>Experience<span>{feedback?.rating?.experience}/10</span></h2>
                                <Progress value={feedback?.rating?.experience * 10} className='rounded-full mt-1 ' />
                            </div>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <h2 className='font-bold'>Performance Summary</h2>
                        <div className='my-3 rounded-md p-5 bg-secondary'>
                            {feedback?.summary || 'No summary available.'}
                        {/* {feedback?.summary?.map((summary,index)=>(
                            <p key={index} className='text-sm leading-6 mt-2'>{summary}</p>
                        ))} */}
                        </div>
                    </div>  

                    <div className={` p-5 rounded-md flex items-center justify-between ${feedback?.recommendation=='No' ? 'bg-red-100' : 'bg-green-100' }`}>
                        <div>
                        <h2 className={` font-bold p-5 rounded-md ${feedback?.recommendation=='No' ? 'text-red-700' : 'text-green-700' }`}>Recommendation</h2>
                        <p className={` p-5 rounded-md ${feedback?.recommendation=='No' ? 'text-red-500' : 'text-green-500' }`}>{feedback?.recommendationMsg || 'No recommendation provided.'}</p>
                        </div>
                        <Button className={` p-5 rounded-md ${feedback?.recommendation=='No' ? 'bg-red-700' : 'bg-green-700' }`}>Send Message</Button>
                    </div> 

        </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
    </div>
  )
}

export default CandidateFeedbackDialog
