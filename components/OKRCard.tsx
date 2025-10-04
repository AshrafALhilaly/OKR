'use client'

import { useState } from 'react'
import { Edit, Trash2, MoreVertical, CheckCircle, Circle, X } from 'lucide-react'
import { OKR } from '@/types/okr'

interface OKRCardProps {
  okr: OKR
  onUpdate: (id: string, updatedOKR: Partial<OKR>) => void
  onDelete: (id: string) => void
}

export function OKRCard({ okr, onUpdate, onDelete }: OKRCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [editData, setEditData] = useState({
    title: okr.title,
    description: okr.description,
    quarter: okr.quarter,
  })

  const handleSave = () => {
    onUpdate(okr.id, editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      title: okr.title,
      description: okr.description,
      quarter: okr.quarter,
    })
    setIsEditing(false)
  }

  const handleStatusChange = (status: OKR['status']) => {
    onUpdate(okr.id, { status })
    setShowMenu(false)
  }

  const getStatusColor = (status: OKR['status']) => {
    switch (status) {
      case 'completed':
        return 'text-success-600 bg-success-100'
      case 'in-progress':
        return 'text-warning-600 bg-warning-100'
      case 'cancelled':
        return 'text-danger-600 bg-danger-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: OKR['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'in-progress':
        return <Circle className="h-4 w-4" />
      case 'cancelled':
        return <X className="h-4 w-4" />
      default:
        return <Circle className="h-4 w-4" />
    }
  }

  const overallProgress = okr.keyResults.length > 0 
    ? Math.round(okr.keyResults.reduce((sum, kr) => sum + kr.progress, 0) / okr.keyResults.length)
    : 0

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="input text-lg font-semibold"
                placeholder="Objective title"
              />
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="input resize-none h-20"
                placeholder="Objective description"
              />
              <input
                type="text"
                value={editData.quarter}
                onChange={(e) => setEditData({ ...editData, quarter: e.target.value })}
                className="input"
                placeholder="Quarter (e.g., Q1 2024)"
              />
              <div className="flex space-x-2">
                <button onClick={handleSave} className="btn btn-primary text-sm">
                  Save
                </button>
                <button onClick={handleCancel} className="btn btn-secondary text-sm">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{okr.title}</h3>
              <p className="text-gray-600 mb-2">{okr.description}</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{okr.quarter}</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(okr.status)}`}>
                  {getStatusIcon(okr.status)}
                  <span className="ml-1 capitalize">{okr.status.replace('-', ' ')}</span>
                </span>
              </div>
            </>
          )}
        </div>
        
        {!isEditing && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsEditing(true)
                      setShowMenu(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  {okr.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusChange('completed')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </button>
                  )}
                  {okr.status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusChange('cancelled')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onDelete(okr.id)
                      setShowMenu(false)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!isEditing && (
        <>
          {/* Overall Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Key Results */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Key Results</h4>
            {okr.keyResults.map((kr) => (
              <div key={kr.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{kr.title}</span>
                  <span className="text-gray-500">{kr.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(kr.progress, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}