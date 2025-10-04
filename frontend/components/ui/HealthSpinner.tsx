import React from 'react'

const HealthSpinner = () => {
  return (
    <div className="flex items-center justify-center space-x-2 animate-pulse">
      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
    </div>
  )
}

export default HealthSpinner





