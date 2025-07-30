'use client'
import React, { useState } from 'react'

function TestLocalStorage() {
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')
  const [getResult, setGetResult] = useState('')
  const [allData, setAllData] = useState({})

  const handleSet = () => {
    if (key && value) {
      try {
        const parsedValue = JSON.parse(value)
        localStorage.setItem(key, JSON.stringify(parsedValue))
        alert(`Set ${key} to ${value}`)
      } catch (e) {
        localStorage.setItem(key, value)
        alert(`Set ${key} to ${value} (as string)`)
      }
      refreshAllData()
    }
  }

  const handleGet = () => {
    const item = localStorage.getItem(key)
    if (item) {
      try {
        setGetResult(JSON.stringify(JSON.parse(item), null, 2))
      } catch (e) {
        setGetResult(item)
      }
    } else {
      setGetResult('Key not found')
    }
  }

  const handleRemove = () => {
    localStorage.removeItem(key)
    setGetResult('')
    refreshAllData()
  }

  const refreshAllData = () => {
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      try {
        data[k] = JSON.parse(localStorage.getItem(k))
      } catch (e) {
        data[k] = localStorage.getItem(k)
      }
    }
    setAllData(data)
  }

  const clearAll = () => {
    localStorage.clear()
    setGetResult('')
    refreshAllData()
  }

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">LocalStorage Test</h1>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Value (JSON or string)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleSet} className="bg-blue-500 text-white p-2 mr-2">
          Set
        </button>
        <button onClick={handleGet} className="bg-green-500 text-white p-2 mr-2">
          Get
        </button>
        <button onClick={handleRemove} className="bg-red-500 text-white p-2 mr-2">
          Remove
        </button>
        <button onClick={clearAll} className="bg-purple-500 text-white p-2">
          Clear All
        </button>
      </div>

      {getResult && (
        <div className="mb-4">
          <h2 className="text-xl font-bold">Get Result:</h2>
          <pre className="bg-gray-100 p-2">{getResult}</pre>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold">All LocalStorage Data:</h2>
        <button onClick={refreshAllData} className="bg-gray-500 text-white p-2 mb-2">
          Refresh
        </button>
        <pre className="bg-gray-100 p-2 max-h-96 overflow-auto">
          {JSON.stringify(allData, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default TestLocalStorage