import { Button } from '@/components/ui/button'
import moment from 'moment'
import React from 'react'



function CandidatList({candidateList}) {
  return (
    <div className=''>
      <h2 className='my-5 font-bold'>Candidates ({candidateList?.length})</h2>
      {candidateList?.map((candidate, index) => (
        <div key={index} className='p-5 flex items-center gap-3 bg-white rounded-lg '>
          <div className='flex items-center gap-3 flex-1'>
            <h2 className='bg-primary p-3 px-4.5 font-bold text-white rounded-full'>{candidate.userName[0]}</h2>
          
            <div>
            <h2 className='font-bold'>{candidate.userName}</h2>
            <h2 className='text-gray-500 text-sm'>Completed on: {moment(candidate.created_at).format('MMM DD,YYYY')}</h2>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <h2 className='text-green-600 flex gap-3 item-center font-bold'>6/10</h2>
          <Button variant={'outline'} className='text-primary'>view report</Button>
          </div>
        </div>
  ))}
    </div>
  )
}

export default CandidatList
