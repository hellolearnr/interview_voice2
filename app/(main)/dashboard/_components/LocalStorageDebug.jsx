'use client'
import React, { useEffect, useState } from 'react'

function LocalStorageDebug() {
  const [localStorageData, setLocalStorageData] = useState({})

  useEffect(() => {
    // Function to update localStorage data
    const updateLocalStorageData = () => {
      const data = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        try {
          data[key] = JSON.parse(localStorage.getItem(key))
        } catch (e) {
          data[key] = localStorage.getItem(key)
        }
      }
      setLocalStorageData(data)
    }

    // Initial load
    updateLocalStorageData()

    // Set up interval to refresh data every 2 seconds
    const interval = setInterval(updateLocalStorageData, 2000)

    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-0 right-0 bg-black text-white p-3 text-xs z-50 max-w-md">
      <h3 className="font-bold mb-1">LocalStorage Debug</h3>
      <pre className="text-xs overflow-auto max-h-40">
        {JSON.stringify(localStorageData, null, 2)}
      </pre>
    </div>
  )
}

export default LocalStorageDebug