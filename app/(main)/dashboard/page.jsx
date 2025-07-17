
import React from 'react'
import WelcomeContainer from './_components/WelcomeContainer'
import CreateOptions from './_components/CreateOptions'
import LatestInterviewList from './_components/LatestInterviewsList'

function Dashboard () {
  return (
    <div>
      {/* <WelcomeContainer /> */}
      <h2 className="text-2xl font-bold my-3">Dashboard</h2>
      <CreateOptions />
      <LatestInterviewList  />
    </div>
  )
}

export default Dashboard
