import { useState, useEffect } from 'react'
import axios from 'axios'
import ObjectiveCard from './components/ObjectiveCard'
import ObjectiveForm from './components/ObjectiveForm'
import { Objective } from './types'

function App() {
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchObjectives()
  }, [])

  const fetchObjectives = async () => {
    try {
      const response = await axios.get('/api/objectives')
      setObjectives(response.data)
    } catch (error) {
      console.error('Error fetching objectives:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateObjective = async (data: Omit<Objective, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await axios.post('/api/objectives', data)
      setShowForm(false)
      fetchObjectives()
    } catch (error) {
      console.error('Error creating objective:', error)
    }
  }

  const handleDeleteObjective = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this objective?')) return
    try {
      await axios.delete(`/api/objectives/${id}`)
      fetchObjectives()
    } catch (error) {
      console.error('Error deleting objective:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">OKR Platform</h1>
              <p className="text-gray-600 mt-1">Objectives and Key Results Management</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
            >
              {showForm ? 'Cancel' : '+ New Objective'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="mb-8">
            <ObjectiveForm
              onSubmit={handleCreateObjective}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : objectives.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">No objectives yet</h3>
            <p className="mt-2 text-gray-600">Get started by creating your first objective.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-200"
            >
              Create Objective
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {objectives.map((objective) => (
              <ObjectiveCard
                key={objective.id}
                objective={objective}
                onDelete={handleDeleteObjective}
                onUpdate={fetchObjectives}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
