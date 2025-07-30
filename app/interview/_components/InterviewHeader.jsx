import Image from 'next/image'
import React from 'react'

function InterviewHeader() {
  return (
    <div className='p-4 shadow-sm'>
      <Image src={'/logo.png'} alt='logo'
      width={200} height={100} className='w-[140px]'/>
      {/* <h2 className='font bold text-lg mt-4'>Your AI Interview Link is ready</h2>
      <p className='mt-3'>Share this link with your candidates</p> */}
      
    </div>
  )
}

export default InterviewHeader
