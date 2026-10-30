export type Priority = "High" | "Medium" | "Low"
export type Status = "To Do" | "In Progress" | "In Review" | "Done"

export type ProjectStatus = "On track" | "At risk" | "Planning" | "Completed" | "Archived"

export type Project = {
  id: string
  name: string
  description: string
  progress: number
  due: string
  status: ProjectStatus
  tone: "indigo" | "blue" | "green" | "rose"
  team: string[]
  createdAt: string
}

export type Task = {
  id: string
  title: string
  project: string
  priority: Priority
  due: string
  status: Status
  overdue?: boolean
  assignee?: string
  assignees?: string[]
  progress?: number
  completionNote?: string
  completedAt?: string
  estimatedHours?: number
  actualHours?: number
  createdAt: string
}

export type Member = {
  name: string
  role: string
  email: string
  roleType: string
  capacity: number
  color?: string
}

export type User = {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: string
}

export type Activity = {
  id: string
  type: string
  message: string
  createdAt: string
}