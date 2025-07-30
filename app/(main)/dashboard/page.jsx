
import React from 'react'
import WelcomeContainer from './_components/WelcomeContainer'
import CreateOptions from './_components/CreateOptions'
import LatestInterviewList from './_components/LatestInterviewsList'
import UserDebugInfo from './_components/UserDebugInfo'
import DatabaseDebug from './_components/DatabaseDebug'
import TestDatabaseInsertion from './_components/TestDatabaseInsertion'
import AuthDebug from './_components/AuthDebug'
import TestAPIRoute from './_components/TestAPIRoute'
import ComprehensiveDebug from './_components/ComprehensiveDebug'
import InterviewCreationDebug from './_components/InterviewCreationDebug'
import LocalStorageDebug from './_components/LocalStorageDebug'
import TestLocalStorage from './_components/TestLocalStorage'

function Dashboard () {
  return (
    <div>
      {/* <WelcomeContainer /> */}
      <UserDebugInfo />
      <DatabaseDebug />
      <TestDatabaseInsertion />
      <AuthDebug />
      <TestAPIRoute />
      <ComprehensiveDebug />
      <InterviewCreationDebug />
      <LocalStorageDebug />
      <TestLocalStorage />
      <h2 className="text-2xl font-bold my-3">Dashboard</h2>
      <CreateOptions />
      <LatestInterviewList  />
    </div>
  )
}

export default Dashboard
