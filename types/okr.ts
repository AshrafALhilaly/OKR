export interface KeyResult {
  id: string
  title: string
  progress: number
  target: number
}

export interface OKR {
  id: string
  title: string
  description: string
  quarter: string
  status: 'in-progress' | 'completed' | 'cancelled'
  keyResults: KeyResult[]
  createdAt: Date
}

export interface CreateOKRData {
  title: string
  description: string
  quarter: string
  keyResults: Omit<KeyResult, 'id'>[]
}