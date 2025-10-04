import { useState } from 'react'
import axios from 'axios'
import { KeyResult } from '../types'

interface KeyResultItemProps {
  keyResult: KeyResult
  onDelete: (id: number) => void
  onUpdate: () => void
}

export default function KeyResultItem({ keyResult, onDelete, onUpdate }: KeyResultItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentValue, setCurrentValue] = useState(keyResult.current_value)

  const handleUpdateProgress = async () => {
    try {
      await axios.put(`/api/keyresults/${keyResult.id}`, {
        ...keyResult,
        current_value: currentValue,
      })
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      console.error('Error updating key result:', error)
    }
  }

  const progress = (currentValue / keyResult.target_value) * 100

  const statusColor = {
    not_started: 'text-gray-500',
    in_progress: 'text-blue-500',
    completed: 'text-green-500',
    at_risk: 'text-red-500',
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900 flex-1">{keyResult.title}</h4>
        <button
          onClick={() => onDelete(keyResult.id)}
          className="text-gray-400 hover:text-red-600 ml-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex items-center space-x-2 mb-2">
        {isEditing ? (
          <>
            <input
              type="number"
              value={currentValue}
              onChange={(e) => setCurrentValue(Number(e.target.value))}
              className="w-20 px-2 py-1 border border-gray-300 rounded"
              min="0"
              max={keyResult.target_value}
            />
            <span className="text-gray-600">/ {keyResult.target_value} {keyResult.unit}</span>
            <button
              onClick={handleUpdateProgress}
              className="ml-2 px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setCurrentValue(keyResult.current_value)
                setIsEditing(false)
              }}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <span className="text-gray-700 font-semibold">
              {keyResult.current_value} / {keyResult.target_value} {keyResult.unit}
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-indigo-600 hover:text-indigo-700 text-sm"
            >
              Update
            </button>
          </>
        )}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            progress >= 100 ? 'bg-green-500' : progress >= 70 ? 'bg-blue-500' : 'bg-yellow-500'
          }`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-600">{Math.round(progress)}% Complete</span>
        <span className={`text-xs font-medium ${statusColor[keyResult.status]}`}>
          {keyResult.status.replace('_', ' ')}
        </span>
      </div>
    </div>
  )
}
