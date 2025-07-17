import {  Phone, Video } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function createOptions() {
  return (
    <div className='grid grid-cols-2 gap-5 '>
      <Link href={'/dashboard/create-interview'} className='bg-white border border-gray-200 p-5 rounded-lg cursor-pointer'>
        <Video className='p-3 text-primary bg-blue-50 rounded-lg h-12 w-12' />
        <h2 className='font-bold'> Create New Interview</h2>
        <p className='text-gray-500'>Schedule  AI Interviews  </p>
      </Link>
      <div className='bg-white border border-gray-200 p-5 rounded-lg'>
        <Phone className='p-3 text-primary bg-blue-50 rounded-lg h-12 w-12' />
        <h2 className='font-bold'> Phone Screening</h2>
        <p className='text-gray-500'>Filter your candidates via  AI   </p>
      </div>
    </div>
  )
}

export default createOptions
