import React from 'react'

function QuestionListContainer({questionList}) {
  return (
    <div>
      <h2 className='text-xl font-semibold mb-5'>Generated Interview Questions:</h2>
                    <div className='space-y-4'>
                        {questionList.map((q, index) => (
                            <div key={index} className='bg-white p-6 border border-gray-200 rounded-xl shadow-sm'>
                                <p className='text-gray-800 text-base leading-relaxed mb-3'>{q.question}</p>
                                <span className='inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium'>
                                    Type: {q.type}
                                </span>
                            </div>
                        ))}
                    </div>
    </div>
  )
}

export default QuestionListContainer
