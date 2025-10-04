'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { CreateOKRData } from '@/types/okr'

interface CreateOKRModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (okr: CreateOKRData) => void
}

export function CreateOKRModal({ isOpen, onClose, onCreate }: CreateOKRModalProps) {
  const [formData, setFormData] = useState<CreateOKRData>({
    title: '',
    description: '',
    quarter: 'Q1 2024',
    keyResults: [
      { title: '', progress: 0, target: 100 }
    ]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields')
      return
    }

    const validKeyResults = formData.keyResults.filter(kr => kr.title.trim())
    if (validKeyResults.length === 0) {
      alert('Please add at least one key result')
      return
    }

    onCreate({
      ...formData,
      keyResults: validKeyResults
    })

    // Reset form
    setFormData({
      title: '',
      description: '',
      quarter: 'Q1 2024',
      keyResults: [{ title: '', progress: 0, target: 100 }]
    })
  }

  const addKeyResult = () => {
    setFormData({
      ...formData,
      keyResults: [...formData.keyResults, { title: '', progress: 0, target: 100 }]
    })
  }

  const removeKeyResult = (index: number) => {
    if (formData.keyResults.length > 1) {
      setFormData({
        ...formData,
        keyResults: formData.keyResults.filter((_, i) => i !== index)
      })
    }
  }

  const updateKeyResult = (index: number, field: keyof CreateOKRData['keyResults'][0], value: string | number) => {
    const updatedKeyResults = [...formData.keyResults]
    updatedKeyResults[index] = { ...updatedKeyResults[index], [field]: value }
    setFormData({ ...formData, keyResults: updatedKeyResults })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New OKR</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Objective */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objective *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="Enter your objective"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input resize-none h-20"
              placeholder="Describe your objective"
              required
            />
          </div>

          {/* Quarter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quarter
            </label>
            <input
              type="text"
              value={formData.quarter}
              onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
              className="input"
              placeholder="e.g., Q1 2024"
            />
          </div>

          {/* Key Results */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Key Results *
              </label>
              <button
                type="button"
                onClick={addKeyResult}
                className="btn btn-secondary text-sm flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Key Result</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.keyResults.map((kr, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={kr.title}
                      onChange={(e) => updateKeyResult(index, 'title', e.target.value)}
                      className="input text-sm"
                      placeholder="Key result description"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={kr.progress}
                        onChange={(e) => updateKeyResult(index, 'progress', parseInt(e.target.value) || 0)}
                        className="input text-sm w-20"
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-gray-500 self-center">% progress</span>
                      <input
                        type="number"
                        value={kr.target}
                        onChange={(e) => updateKeyResult(index, 'target', parseInt(e.target.value) || 100)}
                        className="input text-sm w-20"
                        placeholder="100"
                        min="0"
                      />
                      <span className="text-sm text-gray-500 self-center">target</span>
                    </div>
                  </div>
                  {formData.keyResults.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeKeyResult(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Create OKR
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}