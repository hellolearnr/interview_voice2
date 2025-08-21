// import React from 'react'
// import { Calendar, Clock, MessageCircleQuestion } from 'lucide-react'
// import moment from 'moment'



// function InterviewDetailContainer({interviewDetail}) {
//   return (
//     <div className='p-5  rounded-lg bg-white mt-5'>
//       <h2 className='text-lg font-bold'>{interviewDetail?.jobPosition}</h2>
//       <div className='mt-4 flex items-center justify-between lg:pr-52'>
//         <div >
//             <h2 className='text-gray-500 text-xs'>Duration</h2>
//             <h2 className='flex text-sm font-bold items-center gap-2'><Clock className='h-4 w-4' />{interviewDetail?.duration} min</h2>
//         </div>
//         <div >
//             <h2 className='text-gray-500 text-xs'>Created On</h2>
//             <h2 className='flex text-sm font-bold items-center gap-2'><Calendar className='h-4 w-4' />{moment(interviewDetail?.created_at).format('MMM DD ,YYYY')} </h2>
//         </div>
//         {interviewDetail?.type && <div >
//             <h2 className='text-gray-500 text-xs'>Type</h2>
//             <h2 className='flex text-sm font-bold items-center gap-2'><Clock className='h-4 w-4' />{interviewDetail?.type} </h2>
//         </div>}
        
//       </div>
//       <div className='mt-5'>
//         <h2 className='font-bold'>Job Description</h2>
//         <p className='text-sm leading-6'>{interviewDetail?.jobDescription}</p>
//       </div>
//       <div className='mt-5'>
//             <h2 className='font-bold'>Interview Questions</h2>
//             <div className='grid grid-cols-2 lg:grid-cols-3 gap-3 mt-3'>
//             {interviewDetail?.questionList.map((item,index)=>(
//                 <h2 className='text-sm'>{index+1}.{item.question}</h2>
//             ))} 
//             </div>
//         </div>
//     </div>
//   )
// }

// export default InterviewDetailContainer

import React from 'react'
import { Calendar, Clock, MessageCircleQuestion } from 'lucide-react'
import moment from 'moment'

function InterviewDetailContainer({interviewDetail}) {
  return (
    <div className='p-5 rounded-lg bg-white mt-5'>
      <h2 className='text-lg font-bold'>{interviewDetail?.jobPosition}</h2>
      <div className='mt-4 flex items-center justify-between lg:pr-52'>
        <div >
            <h2 className='text-gray-500 text-xs'>Duration</h2>
            <h2 className='flex text-sm font-bold items-center gap-2'><Clock className='h-4 w-4' />{interviewDetail?.duration} min</h2>
        </div>
        <div >
            <h2 className='text-gray-500 text-xs'>Created On</h2>
            <h2 className='flex text-sm font-bold items-center gap-2'><Calendar className='h-4 w-4' />{moment(interviewDetail?.created_at).format('MMM DD ,YYYY')} </h2>
        </div>
        {interviewDetail?.type && <div >
            <h2 className='text-gray-500 text-xs'>Type</h2>
            <h2 className='flex text-sm font-bold items-center gap-2'><Clock className='h-4 w-4' />{interviewDetail?.type} </h2>
        </div>}
      </div>
      
      <div className='mt-5'>
        <h2 className='font-bold'>Job Description</h2>
        <p className='text-sm leading-6'>{interviewDetail?.jobDescription}</p>
      </div>
      
      <div className='mt-5'>
        <h2 className='font-bold'>Interview Questions</h2>
        <div className='grid grid-cols-2 lg:grid-cols-3 gap-3 mt-3'>
          {interviewDetail?.questionList?.map((item, index) => (
            <h2 key={`question-${index}`} className='text-sm'>
              {index + 1}. {item.question}
            </h2>
          ))} 
        </div>
      </div>
    </div>
  )
}

export default InterviewDetailContainer