'use client'

import { useState } from 'react'
import { Plus, Target, TrendingUp, CheckCircle, Circle } from 'lucide-react'
import { OKRCard } from '@/components/OKRCard'
import { CreateOKRModal } from '@/components/CreateOKRModal'
import { OKR } from '@/types/okr'

export default function Home() {
  const [okrs, setOkrs] = useState<OKR[]>([
    {
      id: '1',
      title: 'Increase User Engagement',
      description: 'Boost user engagement across all platforms',
      quarter: 'Q1 2024',
      status: 'in-progress',
      keyResults: [
        { id: '1', title: 'Increase daily active users by 25%', progress: 60, target: 100 },
        { id: '2', title: 'Achieve 90% user satisfaction score', progress: 75, target: 90 },
        { id: '3', title: 'Reduce churn rate to under 5%', progress: 40, target: 5 },
      ],
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      title: 'Improve Product Performance',
      description: 'Enhance overall product performance and reliability',
      quarter: 'Q1 2024',
      status: 'completed',
      keyResults: [
        { id: '4', title: 'Reduce page load time to under 2 seconds', progress: 100, target: 2 },
        { id: '5', title: 'Achieve 99.9% uptime', progress: 100, target: 99.9 },
        { id: '6', title: 'Fix 95% of critical bugs', progress: 100, target: 95 },
      ],
      createdAt: new Date('2024-01-15'),
    },
  ])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleCreateOKR = (newOKR: Omit<OKR, 'id' | 'createdAt'>) => {
    const okr: OKR = {
      ...newOKR,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setOkrs([okr, ...okrs])
    setIsCreateModalOpen(false)
  }

  const handleUpdateOKR = (id: string, updatedOKR: Partial<OKR>) => {
    setOkrs(okrs.map(okr => okr.id === id ? { ...okr, ...updatedOKR } : okr))
  }

  const handleDeleteOKR = (id: string) => {
    setOkrs(okrs.filter(okr => okr.id !== id))
  }

  const inProgressOKRs = okrs.filter(okr => okr.status === 'in-progress')
  const completedOKRs = okrs.filter(okr => okr.status === 'completed')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">OKR Platform</h1>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New OKR</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Target className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total OKRs</p>
                <p className="text-2xl font-bold text-gray-900">{okrs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressOKRs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedOKRs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* OKRs List */}
        <div className="space-y-6">
          {inProgressOKRs.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Circle className="h-5 w-5 text-warning-500 mr-2" />
                In Progress
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {inProgressOKRs.map(okr => (
                  <OKRCard
                    key={okr.id}
                    okr={okr}
                    onUpdate={handleUpdateOKR}
                    onDelete={handleDeleteOKR}
                  />
                ))}
              </div>
            </div>
          )}

          {completedOKRs.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-success-500 mr-2" />
                Completed
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {completedOKRs.map(okr => (
                  <OKRCard
                    key={okr.id}
                    okr={okr}
                    onUpdate={handleUpdateOKR}
                    onDelete={handleDeleteOKR}
                  />
                ))}
              </div>
            </div>
          )}

          {okrs.length === 0 && (
            <div className="text-center py-12">
              <Target className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No OKRs yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first OKR.</p>
              <div className="mt-6">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn btn-primary"
                >
                  Create OKR
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create OKR Modal */}
      <CreateOKRModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateOKR}
      />
    </div>
  )
}