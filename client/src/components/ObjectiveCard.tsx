import { useState, useEffect } from 'react'
import axios from 'axios'
import { Objective, KeyResult } from '../types'
import KeyResultItem from './KeyResultItem'
import KeyResultForm from './KeyResultForm'

interface ObjectiveCardProps {
  objective: Objective
  onDelete: (id: number) => void
  onUpdate: () => void
}

export default function ObjectiveCard({ objective, onDelete, onUpdate }: ObjectiveCardProps) {
  const [keyResults, setKeyResults] = useState<KeyResult[]>([])
  const [showKeyResultForm, setShowKeyResultForm] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (expanded) {
      fetchKeyResults()
    }
  }, [expanded, objective.id])

  const fetchKeyResults = async () => {
    try {
      const response = await axios.get(`/api/objectives/${objective.id}/keyresults`)
      setKeyResults(response.data)
    } catch (error) {
      console.error('Error fetching key results:', error)
    }
  }

  const handleCreateKeyResult = async (data: Omit<KeyResult, 'id' | 'objective_id' | 'created_at' | 'updated_at'>) => {
    try {
      await axios.post(`/api/objectives/${objective.id}/keyresults`, data)
      setShowKeyResultForm(false)
      fetchKeyResults()
      onUpdate()
    } catch (error) {
      console.error('Error creating key result:', error)
    }
  }

  const handleDeleteKeyResult = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this key result?')) return
    try {
      await axios.delete(`/api/keyresults/${id}`)
      fetchKeyResults()
      onUpdate()
    } catch (error) {
      console.error('Error deleting key result:', error)
    }
  }

  const handleUpdateKeyResult = async () => {
    fetchKeyResults()
    onUpdate()
  }

  const progress = objective.progress || 0
  const statusColor = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    archived: 'bg-gray-100 text-gray-800',
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{objective.title}</h3>
            {objective.description && (
              <p className="text-gray-600 text-sm">{objective.description}</p>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[objective.status]}`}>
            {objective.status}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-semibold text-indigo-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Dates */}
        {(objective.start_date || objective.end_date) && (
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            {objective.start_date && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(objective.start_date).toLocaleDateString()}
              </div>
            )}
            {objective.end_date && (
              <div className="flex items-center">
                <span className="mr-1">→</span>
                {new Date(objective.end_date).toLocaleDateString()}
              </div>
            )}
          </div>
        )}

        {/* Key Results Count */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            <svg
              className={`w-5 h-5 mr-1 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {objective.key_results_count || 0} Key Results
          </button>
          <button
            onClick={() => onDelete(objective.id)}
            className="text-red-600 hover:text-red-700 font-medium text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Expanded Key Results */}
      {expanded && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="space-y-3">
            {keyResults.map((kr) => (
              <KeyResultItem
                key={kr.id}
                keyResult={kr}
                onDelete={handleDeleteKeyResult}
                onUpdate={handleUpdateKeyResult}
              />
            ))}
          </div>

          {showKeyResultForm ? (
            <div className="mt-4">
              <KeyResultForm
                onSubmit={handleCreateKeyResult}
                onCancel={() => setShowKeyResultForm(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowKeyResultForm(true)}
              className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition duration-200"
            >
              + Add Key Result
            </button>
          )}
        </div>
      )}
    </div>
  )
}
