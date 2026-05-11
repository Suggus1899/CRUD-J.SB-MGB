export type Role = 'USER' | 'ADMIN'
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface AuthUser {
  username: string
  role: string
}

export interface AuthResponse {
  token: string
  username: string
  role: string
}

export interface UserDto {
  id: string
  username: string
  email: string
  role: Role
  createdAt: string
}

export interface CommentDto {
  id: string
  authorId: string
  authorUsername: string
  text: string
  createdAt: string
}

export interface ChangeRecord {
  field: string
  oldValue: string
  newValue: string
  changedBy: string
  changedAt: string
}

export interface TaskDto {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  tags: string[]
  dueDate?: string
  userId: string
  comments: CommentDto[]
  history: ChangeRecord[]
  createdAt: string
  updatedAt: string
}

export interface TaskRequest {
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  tags: string[]
  dueDate?: string | null
}

export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  size: number
}

export interface StatsDto {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  inProgressTasks: number
  overdueTasks: number
  byStatus: Record<string, number>
  byPriority: Record<string, number>
}
