export interface Objective {
  id: number
  title: string
  description?: string
  start_date?: string
  end_date?: string
  status: 'active' | 'completed' | 'archived'
  created_at: string
  updated_at: string
  key_results_count?: number
  progress?: number
}

export interface KeyResult {
  id: number
  objective_id: number
  title: string
  target_value: number
  current_value: number
  unit: string
  status: 'not_started' | 'in_progress' | 'completed' | 'at_risk'
  created_at: string
  updated_at: string
}
