import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { loadJSON, saveJSON } from "./lib/storage"
import { seedMembers, seedProjects, seedTasks } from "./lib/seed"
import type { Activity, Member, Project, Task } from "./types"

type Profile = { name: string; email: string; title: string }
type Workspace = { name: string }

type Store = {
  projects: Project[]
  tasks: Task[]
  members: Member[]
  profile: Profile
  workspace: Workspace
  activities: Activity[]
  addProject: (project: Omit<Project, "id" | "createdAt">) => Project
  updateProject: (id: string, patch: Partial<Project>) => void
  deleteProject: (id: string) => void
  addTask: (task: Omit<Task, "id" | "createdAt">) => Task
  updateTask: (id: string, patch: Partial<Task>) => void
  deleteTask: (id: string) => void
  setTaskStatus: (id: string, status: Task["status"]) => void
  addMember: (member: Member) => void
  removeMember: (name: string) => void
  replaceData: (data: { projects?: Project[]; tasks?: Task[]; members?: Member[] }) => void
  updateProfile: (patch: Partial<Profile>) => void
  updateWorkspace: (patch: Partial<Workspace>) => void
  addActivity: (type: string, message: string) => void
  projectProgress: (projectName: string) => number
}

const StoreContext = createContext<Store | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => loadJSON("projects", seedProjects))
  const [tasks, setTasks] = useState<Task[]>(() => loadJSON("tasks", seedTasks))
  const [members, setMembers] = useState<Member[]>(() => loadJSON("members", seedMembers))
  const [profile, setProfile] = useState<Profile>(() => loadJSON("profile", { name: "Rajat Nath", email: "rajatnath6909@gmail.com", title: "Creative Director" }))
  const [workspace, setWorkspace] = useState<Workspace>(() => loadJSON("workspace", { name: "Acme Studio" }))
  const [activities, setActivities] = useState<Activity[]>(() => loadJSON("activities", []))

  useEffect(() => saveJSON("projects", projects), [projects])
  useEffect(() => saveJSON("tasks", tasks), [tasks])
  useEffect(() => saveJSON("members", members), [members])
  useEffect(() => saveJSON("profile", profile), [profile])
  useEffect(() => saveJSON("workspace", workspace), [workspace])
  useEffect(() => saveJSON("activities", activities), [activities])

  const addActivity = useCallback((type: string, message: string) => {
    setActivities((prev) => [
      { id: crypto.randomUUID(), type, message, createdAt: new Date().toISOString() },
      ...prev,
    ].slice(0, 50))
  }, [])

  const addProject = useCallback((input: Omit<Project, "id" | "createdAt">) => {
    const project: Project = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    setProjects((prev) => [project, ...prev])
    addActivity("project", `Created project “${project.name}”.`)
    return project
  }, [addActivity])

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
    const name = projects.find((p) => p.id === id)?.name ?? "project"
    addActivity("project", `Updated project “${name}”.`)
  }, [projects, addActivity])

  const deleteProject = useCallback((id: string) => {
    const name = projects.find((p) => p.id === id)?.name ?? "project"
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setTasks((prev) => prev.filter((t) => {
      return t.project !== name
    }))
    addActivity("project", `Archived project “${name}”.`)
  }, [projects, addActivity])

  const addTask = useCallback((input: Omit<Task, "id" | "createdAt">) => {
    const task: Task = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    setTasks((prev) => [task, ...prev])
    const assignees = task.assignees ?? (task.assignee ? [task.assignee] : [])
    if (assignees.length) {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.name !== task.project) return p
          const newTeam = [...p.team]
          assignees.forEach((a) => {
            if (!newTeam.includes(a)) newTeam.push(a)
          })
          return { ...p, team: newTeam }
        }),
      )
    }
    addActivity("task", `Created task “${task.title}”.`)
    return task
  }, [addActivity])

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    const title = tasks.find((t) => t.id === id)?.title ?? "task"
    const prevTask = tasks.find((t) => t.id === id)
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    const newAssignees = patch.assignees ?? (patch.assignee ? [patch.assignee] : null)
    if (newAssignees && newAssignees.length && prevTask) {
      const projectName = patch.project ?? prevTask.project
      setProjects((prev) =>
        prev.map((p) => {
          if (p.name !== projectName) return p
          const newTeam = [...p.team]
          newAssignees.forEach((a) => {
            if (!newTeam.includes(a)) newTeam.push(a)
          })
          return { ...p, team: newTeam }
        }),
      )
    }
    addActivity("task", `Updated task “${title}”.`)
  }, [tasks, addActivity])

  const deleteTask = useCallback((id: string) => {
    const title = tasks.find((t) => t.id === id)?.title ?? "task"
    setTasks((prev) => prev.filter((t) => t.id !== id))
    addActivity("task", `Deleted task “${title}”.`)
  }, [tasks, addActivity])

  const setTaskStatus = useCallback((id: string, status: Task["status"]) => {
    const title = tasks.find((t) => t.id === id)?.title ?? "task"
    const defaults: Record<Task["status"], number> = { "To Do": 0, "In Progress": 50, "In Review": 75, Done: 100 }
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, progress: defaults[status] } : t)),
    )
    addActivity("task", `Moved “${title}” to ${status}.`)
  }, [tasks, addActivity])

  const addMember = useCallback((member: Member) => {
    setMembers((prev) => [...prev, member])
    addActivity("team", `Added member ${member.name}.`)
  }, [addActivity])

  const removeMember = useCallback((name: string) => {
    setMembers((prev) => prev.filter((m) => m.name !== name))
    addActivity("team", `Removed member ${name}.`)
  }, [addActivity])

  const replaceData = useCallback((data: { projects?: Project[]; tasks?: Task[]; members?: Member[] }) => {
    if (data.projects) setProjects(data.projects)
    if (data.tasks) setTasks(data.tasks)
    if (data.members) setMembers(data.members)
    addActivity("system", "Restored data from backup.")
  }, [addActivity])

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...patch }))
    addActivity("settings", "Updated profile.")
  }, [addActivity])

  const updateWorkspace = useCallback((patch: Partial<Workspace>) => {
    setWorkspace((prev) => ({ ...prev, ...patch }))
    addActivity("settings", "Updated workspace details.")
  }, [addActivity])

  const projectProgress = useCallback((projectName: string) => {
    const projectTasks = tasks.filter((task) => task.project === projectName)
    if (projectTasks.length === 0) return 0
    const done = projectTasks.filter((task) => task.status === "Done").length
    return Math.round((done / projectTasks.length) * 100)
  }, [tasks])

  return (
    <StoreContext.Provider
      value={{
        projects,
        tasks,
        members,
        profile,
        workspace,
        activities,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        setTaskStatus,
        addMember,
        removeMember,
        replaceData,
        updateProfile,
        updateWorkspace,
        addActivity,
        projectProgress,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useData must be used within DataProvider")
  return ctx
}