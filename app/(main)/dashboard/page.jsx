
import React from 'react'
import WelcomeContainer from './_components/WelcomeContainer'
import CreateOptions from './_components/CreateOptions'
import LatestInterviewsList from './_components/LatestInterviewsList'

function Dashboard () {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <div>
      {/* <WelcomeContainer /> */}
      <h2 className="text-2xl font-bold my-3">Dashboard</h2>
      {isDevelopment && (
        <div className="mb-4">
          <a href="/debug" className="text-blue-500 hover:text-blue-700 text-sm underline">
            Debug Information (Development Only)
          </a>
        </div>
      )}
      <CreateOptions />
      <LatestInterviewsList  />
    </div>
  )
}

export default Dashboard
