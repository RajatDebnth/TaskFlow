import { useEffect, useMemo, useState, type ReactNode } from "react"
import { useData } from "./store"
import LandingPage from "./LandingPage"
import type { Project } from "./types"

function formatDue(due: string) {
  if (!due) return due
  if (due === "Today" || due === "Tomorrow" || due === "Yesterday") return due
  const d = new Date(due)
  if (isNaN(d.getTime())) return due
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(d)
  dueDate.setHours(0, 0, 0, 0)
  const diff = Math.round((dueDate.getTime() - today.getTime()) / 86400000)
  if (diff === 0) return "Today"
  if (diff === 1) return "Tomorrow"
  if (diff === -1) return "Yesterday"
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function projectColor(name: string) {
  const palette = ["#4f46e5", "#3b82f6", "#16a34a", "#d97706", "#dc2626", "#8b5cf6", "#0891b2", "#be185d"]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return palette[hash % palette.length]
}

function isOverdue(due: string, status: string) {
  if (status === "Done") return false
  if (!due || due === "Today" || due === "Tomorrow" || due === "Yesterday") return due === "Yesterday" ? true : false
  const d = new Date(due)
  if (isNaN(d.getTime())) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(d)
  dueDate.setHours(0, 0, 0, 0)
  return dueDate.getTime() < today.getTime()
}

type IconName = "activity" | "bell" | "check" | "chevronDown" | "chevronRight" | "circleCheck" | "clock" | "folder" | "grid" | "help" | "menu" | "plus" | "search" | "settings" | "tasks" | "team" | "x"

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    activity: (
      <>
        <path d="M4 19V9" />
        <path d="M10 19V5" />
        <path d="M16 19v-7" />
        <path d="M22 19V3" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevronDown: <path d="m6 9 6 6 6-6" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    circleCheck: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.7 2.7L16 9" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    folder: (
      <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H9l2 2h7.5A2.5 2.5 0 0 1 21 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5z" />
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.8 9a2.3 2.3 0 1 1 3.5 2c-.8.5-1.3 1-1.3 2" />
        <path d="M12 17h.01" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    tasks: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="m8 8 1.3 1.3L12 6.5" />
        <path d="M14 9h3" />
        <path d="m8 14 1.3 1.3L12 12.5" />
        <path d="M14 15h3" />
      </>
    ),
    team: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
        <path d="M16 3.1a4 4 0 0 1 0 7.8" />
      </>
    ),
    x: (
      <>
        <path d="m6 6 12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
  }
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  )
}

const avatarColors = ["indigo", "orange", "blue", "green", "rose"] as const

function Avatar({
  name,
  size = "md",
  color = "indigo",
}: {
  name: string
  size?: "sm" | "md" | "lg"
  color?: typeof avatarColors[number]
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
  return (
    <span aria-label={name} className={`avatar avatar-${size} avatar-${color}`}>
      {initials}
    </span>
  )
}

function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
}: {
  children: ReactNode
  variant?: "primary" | "secondary" | "icon"
  onClick?: () => void
  type?: "button" | "submit"
  disabled?: boolean
}) {
  return (
    <button
      className={`button button-${variant}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}

const navItems: { label: string; icon: IconName }[] = [
  { label: "Overview", icon: "grid" },
  { label: "Board", icon: "tasks" },
  { label: "Projects", icon: "folder" },
  { label: "My Tasks", icon: "tasks" },
  { label: "Team", icon: "team" },
]

function NavItem({
  label,
  icon,
  active,
  onClick,
}: {
  label: string
  icon: IconName
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`nav-item ${active ? "active" : ""}`}
      onClick={onClick}
      type="button"
    >
      <Icon name={icon} />
      <span>{label}</span>
    </button>
  )
}

function Brand() {
  return (
    <div className="brand">
      <span className="logo-symbol" />
      <span>
        taskflow<span className="brand-dot">.</span>
      </span>
    </div>
  )
}

function Sidebar({
  active,
  onNavigate,
  open,
  onClose,
}: {
  active: string
  onNavigate: (label: string) => void
  open: boolean
  onClose: () => void
}) {
  const { profile } = useData()
  return (
    <>
      <div
        className={`sidebar-scrim ${open ? "visible" : ""}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-head">
          <Brand />
          <button
            aria-label="Close menu"
            className="mobile-close"
            onClick={onClose}
          >
            <Icon name="x" />
          </button>
        </div>
        <button className="workspace" type="button">
          <span className="workspace-logo">A</span>
          <span>
            <small>Workspace</small>
            <strong>Acme Studio</strong>
          </span>
          <Icon name="chevronDown" size={15} />
        </button>
        <nav className="main-nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          {navItems.map((item) => (
            <NavItem
              {...item}
              active={active === item.label}
              key={item.label}
              onClick={() => {
                onNavigate(item.label)
                onClose()
              }}
            />
          ))}
        </nav>
        <div className="sidebar-bottom">
          <NavItem
            active={active === "Settings"}
            icon="settings"
            label="Settings"
            onClick={() => onNavigate("Settings")}
          />
          <NavItem
            active={active === "Help & Support"}
            icon="help"
            label="Help & Support"
            onClick={() => onNavigate("Help & Support")}
          />
          <button className="profile-card" type="button">
            <Avatar color="indigo" name={profile.name} />
            <span className="profile-copy">
              <strong>{profile.name}</strong>
              <small>Admin</small>
            </span>
            <Icon name="chevronRight" size={16} />
          </button>
        </div>
      </aside>
    </>
  )
}

const stats: {
  label: string
  value: number
  context: string
  icon: IconName
  tone: string
}[] = [
  {
    label: "Active Projects",
    value: 8,
    context: "3 due this month",
    icon: "folder",
    tone: "indigo",
  },
  {
    label: "Total Tasks",
    value: 64,
    context: "18 assigned to you",
    icon: "tasks",
    tone: "blue",
  },
  {
    label: "Completed Tasks",
    value: 42,
    context: "Across all projects",
    icon: "circleCheck",
    tone: "green",
  },
  {
    label: "Overdue Tasks",
    value: 5,
    context: "Needs your attention",
    icon: "clock",
    tone: "red",
  },
]

function StatCard({ label, value, context, icon, tone }: typeof stats[number]) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span className={`stat-icon tone-${tone}`}>
          <Icon name={icon} />
        </span>
        <span className={`context-dot dot-${tone}`} />
      </div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-label">{label}</span>
      <small className={tone === "red" ? "danger-copy" : ""}>{context}</small>
    </article>
  )
}

type Status = "To Do" | "In Progress" | "In Review" | "Done"
type Priority = "High" | "Medium" | "Low"
type Task = {
  id?: string
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
  createdAt?: string
}

const tasks: Task[] = [
  {
    title: "Finalize homepage wireframes",
    project: "Website Redesign",
    priority: "High",
    due: "Today",
    status: "In Progress",
  },
  {
    title: "Review API integration",
    project: "Mobile App",
    priority: "Medium",
    due: "Tomorrow",
    status: "In Review",
  },
  {
    title: "Prepare launch checklist",
    project: "Marketing Website",
    priority: "High",
    due: "Sep 18",
    status: "To Do",
    overdue: true,
  },
  {
    title: "Update onboarding flow",
    project: "Product Dashboard",
    priority: "Low",
    due: "Sep 22",
    status: "Done",
  },
]

function Badge({ children, kind }: { children: ReactNode; kind: string }) {
  return (
    <span className={`badge badge-${kind.toLowerCase().replace(/ /g, "-")}`}>
      {children}
    </span>
  )
}

function TaskRow({ task, onEdit }: { task: Task; onEdit?: (task: Task) => void }) {
  const { setTaskStatus, deleteTask } = useData()
  const toggle = () => setTaskStatus(task.id!, task.status === "Done" ? "To Do" : "Done")
  return (
    <div className={`task-row ${isOverdue(task.due, task.status) ? "overdue" : ""}`}>
      <button
        aria-label={`Mark ${task.title} complete`}
        className={`task-check ${task.status === "Done" ? "checked" : ""}`}
        onClick={toggle}
        type="button"
      >
        {task.status === "Done" && <Icon name="check" size={13} />}
      </button>
      <div className="task-title">
        <strong>{task.title}</strong>
        <span>{task.project}{(task.assignees ?? (task.assignee ? [task.assignee] : [])).length ? ` · ${(task.assignees ?? (task.assignee ? [task.assignee] : [])).join(", ")}` : ""}</span>
        {task.status === "Done" && task.completionNote && (
          <small className="task-note">{task.completionNote}</small>
        )}
        {(task.progress ?? 0) > 0 && (
          <div className="task-progress">
            <div className="task-progress-bar" style={{ width: `${task.progress}%` }} />
            <span>{task.progress}%</span>
          </div>
        )}
      </div>
      <div className="task-meta-grid">
        <Badge kind={task.priority}>{task.priority}</Badge>
        <Badge kind={task.status}>{task.status}</Badge>
        <span className={`due-date ${isOverdue(task.due, task.status) ? "overdue" : ""}`}>
          <Icon name="clock" size={12} />
          {formatDue(task.due)}
        </span>
        {(task.estimatedHours || task.actualHours) ? (
          <span className="hours-badge">
            {task.actualHours ?? 0}/{task.estimatedHours ?? 0}h
          </span>
        ) : (
          <span className="hours-badge empty">—</span>
        )}
      </div>
      {onEdit && (
        <button
          aria-label={`Edit ${task.title}`}
          className="row-action"
          onClick={() => onEdit(task)}
          type="button"
        >
          <Icon name="settings" size={17} />
        </button>
      )}
      <button
        aria-label={`Delete ${task.title}`}
        className="row-action"
        onClick={() => deleteTask(task.id!)}
        type="button"
      >
        <Icon name="x" size={17} />
      </button>
    </div>
  )
}

const projects = [
  {
    name: "Website Redesign",
    detail: "24 of 32 tasks",
    value: 75,
    tone: "indigo",
  },
  { name: "Mobile App", detail: "15 of 31 tasks", value: 48, tone: "blue" },
  {
    name: "Marketing Website",
    detail: "18 of 20 tasks",
    value: 90,
    tone: "green",
  },
]

function ProgressRow({ name, detail, value, tone }: typeof projects[number]) {
  return (
    <div className="progress-row">
      <div className="progress-copy">
        <strong>{name}</strong>
        <span>{detail}</span>
      </div>
      <div className="progress-track">
        <span
          className={`progress-fill progress-${tone}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <strong className="progress-value">{value}%</strong>
    </div>
  )
}

const activities = [
  {
    name: "Sarah Chen",
    color: "orange" as const,
    action: "completed",
    target: "Homepage UI",
    time: "12 min ago",
    status: "complete",
  },
  {
    name: "David Lee",
    color: "blue" as const,
    action: "created a task",
    target: "API integration",
    time: "48 min ago",
    status: "new",
  },
  {
    name: "Alex Morgan",
    color: "indigo" as const,
    action: "updated",
    target: "Website Redesign",
    time: "2 hours ago",
    status: "update",
  },
  {
    name: "Maya Patel",
    color: "green" as const,
    action: "commented on",
    target: "Launch checklist",
    time: "4 hours ago",
    status: "comment",
  },
  {
    name: "Sarah Chen",
    color: "orange" as const,
    action: "moved a task to review",
    target: "Mobile navigation",
    time: "Yesterday",
    status: "review",
  },
]

function ActivityItem({ item }: { item: typeof activities[number] }) {
  return (
    <div className="activity-item">
      <div className="avatar-wrap">
        <Avatar color={item.color} name={item.name} size="sm" />
        <span className={`activity-status activity-${item.status}`} />
      </div>
      <div className="activity-copy">
        <p>
          <strong>{item.name}</strong> {item.action} <b>{item.target}</b>
        </p>
        <time>{item.time}</time>
      </div>
    </div>
  )
}

const members = [
  {
    name: "Sarah Chen",
    role: "Product Designer",
    tasks: 8,
    color: "orange" as const,
  },
  { name: "David Lee", role: "Engineer", tasks: 6, color: "blue" as const },
  {
    name: "Maya Patel",
    role: "Marketing Lead",
    tasks: 5,
    color: "green" as const,
  },
  { name: "Jordan Kim", role: "Engineer", tasks: 4, color: "rose" as const },
]

function SectionCard({
  title,
  action,
  onAction,
  children,
  className = "",
}: {
  title: string
  action?: string
  onAction?: () => void
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`section-card ${className}`}>
      <header className="section-header">
        <h2>{title}</h2>
        {action && (
          <button className="text-link" onClick={onAction} type="button">
            {action}
            <Icon name="chevronRight" size={14} />
          </button>
        )}
      </header>
      {children}
    </section>
  )
}

function TaskFormDialog({
  open,
  onClose,
  task,
  defaultProject,
}: {
  open: boolean
  onClose: () => void
  task?: Task
  defaultProject?: string
}) {
  const { projects, members, profile, addTask, updateTask } = useData()
  const editing = !!task
  const [title, setTitle] = useState(task?.title ?? "")
  const [project, setProject] = useState(task?.project ?? defaultProject ?? (projects[0]?.name ?? ""))
  const [priority, setPriority] = useState<Priority>(task?.priority ?? "Medium")
  const [status, setStatus] = useState<Status>(task?.status ?? "To Do")
  const [due, setDue] = useState(task?.due ?? new Date().toISOString().slice(0, 10))
  const [assignee, setAssignee] = useState(task?.assignee ?? "")
  const [assignees, setAssignees] = useState<string[]>(task?.assignees ?? (task?.assignee ? [task.assignee] : []))
  const [progress, setProgress] = useState(task?.progress ?? 0)
  const [completionNote, setCompletionNote] = useState(task?.completionNote ?? "")
  const [assigneeOpen, setAssigneeOpen] = useState(false)
  const [estimatedHours, setEstimatedHours] = useState(task?.estimatedHours ?? 0)
  const [actualHours, setActualHours] = useState(task?.actualHours ?? 0)
  const [created, setCreated] = useState(false)

  useEffect(() => {
    if (!open) {
      setCreated(false)
      return
    }
    setTitle(task?.title ?? "")
    setProject(task?.project ?? defaultProject ?? (projects[0]?.name ?? ""))
    setPriority(task?.priority ?? "Medium")
    setStatus(task?.status ?? "To Do")
    setDue(task?.due ?? new Date().toISOString().slice(0, 10))
    setAssignee(task?.assignee ?? "")
    setAssignees(task?.assignees ?? (task?.assignee ? [task.assignee] : []))
    setProgress(task?.progress ?? 0)
    setCompletionNote(task?.completionNote ?? "")
    setEstimatedHours(task?.estimatedHours ?? 0)
    setActualHours(task?.actualHours ?? 0)
  }, [open, task, defaultProject, projects])

  if (!open) return null

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const completedAt = status === "Done" ? task?.completedAt ?? new Date().toISOString() : undefined
    if (editing && task?.id) {
      updateTask(task.id, {
        title,
        project,
        priority,
        status,
        due,
        assignee: assignees[0],
        assignees,
        progress,
        completionNote: status === "Done" ? completionNote : undefined,
        completedAt,
        estimatedHours: estimatedHours || undefined,
        actualHours: actualHours || undefined,
      })
    } else {
      addTask({
        title,
        project,
        priority,
        due,
        status,
        assignee: assignees[0],
        assignees,
        progress,
        completionNote: status === "Done" ? completionNote : undefined,
        completedAt,
        estimatedHours: estimatedHours || undefined,
        actualHours: actualHours || undefined,
      })
    }
    setCreated(true)
  }

  return (
    <div aria-modal="true" className="dialog-backdrop" role="dialog">
      <div className="dialog">
        <div className="dialog-head">
          <div>
            <span>TASK</span>
            <h2>{created ? (editing ? "Task updated" : "Task created") : editing ? "Edit task" : "New task"}</h2>
          </div>
          <Button onClick={onClose} variant="icon">
            <Icon name="x" />
          </Button>
        </div>
        {created ? (
          <div className="dialog-success">
            <span>
              <Icon name="check" size={24} />
            </span>
            <h3>{title}</h3>
            <p>{editing ? "Changes saved." : "Task added to your workspace."}</p>
            <Button onClick={onClose}>Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Title
              <input onChange={(e) => setTitle(e.target.value)} required value={title} />
            </label>
            <label>
              Project
              <select onChange={(e) => setProject(e.target.value)} value={project}>
                {projects.map((p) => (
                  <option key={p.id ?? p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-row">
              <label>
                Priority
                <select onChange={(e) => setPriority(e.target.value as Priority)} value={priority}>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </label>
              <label>
                Status
                <select
                  onChange={(e) => {
                    const next = e.target.value as Status
                    setStatus(next)
                    const defaults: Record<Status, number> = { "To Do": 0, "In Progress": 50, "In Review": 75, Done: 100 }
                    setProgress(defaults[next])
                  }}
                  value={status}
                >
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>In Review</option>
                  <option>Done</option>
                </select>
              </label>
            </div>
            <div className="form-row">
              <label>
                Due date
                <input onChange={(e) => setDue(e.target.value)} type="date" value={due} />
              </label>
              <label className="full">
                Assignees
                <select
                  className="multi-select"
                  multiple
                  onChange={(event) => {
                    const selected = Array.from(event.target.selectedOptions).map((option) => option.value)
                    setAssignees(selected)
                  }}
                  value={assignees}
                >
                  <option value={profile.name}>{profile.name} (you)</option>
                  {members.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <small className="hint">Hold Ctrl/Cmd to select multiple.</small>
              </label>
            </div>
            <div className="form-row">
              <label>
                Estimated hrs
                <input
                  min={0}
                  onChange={(e) => setEstimatedHours(Number(e.target.value))}
                  type="number"
                  value={estimatedHours}
                />
              </label>
              <label>
                Actual hrs
                <input
                  min={0}
                  onChange={(e) => setActualHours(Number(e.target.value))}
                  type="number"
                  value={actualHours}
                />
              </label>
            </div>
            {status === "Done" && (
              <label className="full">
                Completion note
                <textarea
                  onChange={(e) => setCompletionNote(e.target.value)}
                  rows={3}
                  value={completionNote}
                />
              </label>
            )}
            <div className="dialog-actions">
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button type="submit">
                <Icon name="plus" size={17} />
                {editing ? "Save changes" : "Create task"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}


function OverviewView({
  filter,
  onFilter,
  onNavigate,
}: {
  filter: string
  onFilter: (filter: string) => void
  onNavigate?: (label: string) => void
}) {
  const { projects, tasks, members, profile, activities, projectProgress } = useData()
  const [selectedWheel, setSelectedWheel] = useState<string | null>(null)
  const filteredTasks =
    filter === "All"
      ? tasks
      : filter === "In Progress"
        ? tasks.filter((task) => task.status === "In Progress")
        : tasks.filter((task) => task.status !== "Done")

  const stats = [
    {
      label: "Active Projects",
      value: projects.filter((project) => project.status !== "Archived").length,
      context: `${projects.filter((project) => project.status !== "Planning" && project.status !== "Archived").length} in progress`,
      icon: "folder" as IconName,
      tone: "indigo",
    },
    {
      label: "Total Tasks",
      value: tasks.length,
      context: `${tasks.filter((task) => task.status !== "Done").length} open`,
      icon: "tasks" as IconName,
      tone: "blue",
    },
    {
      label: "Completed Tasks",
      value: tasks.filter((task) => task.status === "Done").length,
      context: "Across all projects",
      icon: "circleCheck" as IconName,
      tone: "green",
    },
    {
      label: "Overdue Tasks",
      value: tasks.filter((task) => isOverdue(task.due, task.status)).length,
      context: "Needs your attention",
      icon: "clock" as IconName,
      tone: "red",
    },
  ]

  const assignees = [profile.name, ...members.map((member) => member.name)]
  const workload = assignees.map((name) => ({
    name,
    total: tasks.filter((task) => (task.assignees ?? (task.assignee ? [task.assignee] : [])).includes(name)).length,
    done: tasks.filter((task) => (task.assignees ?? (task.assignee ? [task.assignee] : [])).includes(name) && task.status === "Done").length,
    overdue: tasks.filter((task) => (task.assignees ?? (task.assignee ? [task.assignee] : [])).includes(name) && isOverdue(task.due, task.status)).length,
  }))

  return (
    <div className="dashboard">
      <section aria-label="Workspace statistics" className="stats-grid">
        {stats.map((stat) => (
          <StatCard {...stat} key={stat.label} />
        ))}
      </section>
      <div className="dashboard-grid">
        <div className="main-column">
          <SectionCard
            action="View all"
            className="tasks-card"
            onAction={() => onNavigate?.("My Tasks")}
            title="My Tasks"
          >
            <div className="task-tabs" role="tablist">
              {["All", "In Progress", "Upcoming"].map((tab) => (
                <button
                  aria-selected={filter === tab}
                  className={filter === tab ? "selected" : ""}
                  key={tab}
                  onClick={() => onFilter(tab)}
                  role="tab"
                  type="button"
                >
                  {tab}
                  {tab === "All" && <span>{filteredTasks.length}</span>}
                </button>
              ))}
            </div>
            <div className="task-list">
              {filteredTasks.length ? (
                filteredTasks.slice(0, 4).map((task) => (
                  <TaskRow key={task.title} task={task} />
                ))
              ) : (
                <p className="empty-state">No tasks match this filter.</p>
              )}
            </div>
          </SectionCard>
          <SectionCard action="View all" onAction={() => onNavigate?.("Projects")} title="Project Progress">
            <div className="progress-list">
              {projects.slice(0, 4).map((project) => (
                <ProgressRow
                  detail={`${project.team.length} members · due ${project.due}`}
                  key={project.id}
                  name={project.name}
                  tone={project.tone}
                  value={projectProgress(project.name)}
                />
              ))}
            </div>
          </SectionCard>
        </div>
        <div className="side-column">
          <SectionCard title="Recent Activity">
            <div className="activity-list">
              {activities.length === 0 && <div className="activity-empty">No activity yet.</div>}
              {activities.slice(0, 5).map((item) => (
                <div className="activity-item" key={item.id}>
                  <div className="activity-copy">
                    <p>{item.message}</p>
                    <time>{new Date(item.createdAt).toLocaleString()}</time>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard action="View team" onAction={() => onNavigate?.("Team")} title="Workload by assignee">
            <div className="workload-list">
              {workload.slice(0, 4).map((item) => (
                <div className="workload-row" key={item.name}>
                  <strong>{item.name}</strong>
                  <span>{item.total} tasks · {item.done} done · {item.overdue} overdue</span>
                </div>
              ))}
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  )
}
function PageToolbar({
  placeholder,
  tabs,
  active,
  onTab,
  searchValue = "",
  onSearch,
}: {
  placeholder: string
  tabs: string[]
  active: string
  onTab: (tab: string) => void
  searchValue?: string
  onSearch?: (value: string) => void
}) {
  return (
    <div className="page-toolbar">
      <div className="segmented">
        {tabs.map((tab) => (
          <button
            className={active === tab ? "active" : ""}
            key={tab}
            onClick={() => onTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="toolbar-search">
        <Icon name="search" size={16} />
        <input
          onChange={(event) => onSearch?.(event.target.value)}
          placeholder={placeholder}
          value={searchValue}
        />
      </div>
      <Button variant="secondary">
        <Icon name="settings" size={16} />
        Filter
      </Button>
    </div>
  )
}

function ProjectsView({ onOpenProject }: { onOpenProject?: (id: string) => void }) {
  const { projects, updateProject, projectProgress } = useData()
  const [tab, setTab] = useState("Active")
  const [search, setSearch] = useState("")
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined)
  const visibleProjects = (tab === "All"
    ? projects
    : tab === "Completed"
      ? projects.filter((project) => projectProgress(project.name) >= 90 && project.status !== "Archived")
      : tab === "Planning"
        ? projects.filter((project) => project.status === "Planning")
        : tab === "Archived"
          ? projects.filter((project) => project.status === "Archived")
          : projects.filter((project) => project.status !== "Planning" && project.status !== "Archived")
  ).filter((project) =>
    search.trim()
      ? (project.name + " " + project.description + " " + project.status)
          .toLowerCase()
          .includes(search.toLowerCase())
      : true,
  )
  return (
    <div className="dashboard page-view">
      <div className="page-summary">
        <div>
          <span className="eyebrow">PROJECT PORTFOLIO</span>
          <h2>All projects</h2>
          <p>Plan, track, and manage your team’s active work.</p>
        </div>
        <div className="summary-metrics">
          <div>
            <strong>8</strong>
            <span>Active</span>
          </div>
          <div>
            <strong>2</strong>
            <span>Planning</span>
          </div>
          <div>
            <strong>71%</strong>
            <span>Avg. progress</span>
          </div>
        </div>
      </div>
      <PageToolbar
        active={tab}
        onSearch={setSearch}
        onTab={setTab}
        placeholder="Search projects..."
        searchValue={search}
        tabs={["Active", "Planning", "Completed", "Archived", "All"]}
      />
      <div className="project-card-grid">
        {visibleProjects.map((project) => (
          <article className="project-card" key={project.name}>
            <div className="project-card-top">
              <span className={`project-symbol symbol-${project.tone}`}>
                <Icon name="folder" size={18} />
              </span>
              <Badge kind={project.status === "At risk" ? "High" : "Done"}>
                {project.status}
              </Badge>
            </div>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="project-meta">
              <span>
                <Icon name="clock" size={14} /> Due {project.due}
              </span>
              <span>{projectProgress(project.name)}% complete</span>
            </div>
            <div className="progress-track">
              <span
                className={`progress-fill progress-${project.tone}`}
                style={{ width: `${projectProgress(project.name)}%` }}
              />
            </div>
            <div className="project-card-footer">
              <div className="avatar-stack">
                {project.team.map((name, index) => (
                  <Avatar
                    color={avatarColors[(index + 1) % avatarColors.length]}
                    key={name}
                    name={name}
                    size="sm"
                  />
                ))}
              </div>
              <button
                onClick={() => {
                  setEditingProject(project)
                  setProjectDialogOpen(true)
                }}
                type="button"
              >
                Edit
              </button>
              {project.status === "Archived" ? (
                <button
                  onClick={() => updateProject(project.id!, { status: "On track" })}
                  type="button"
                >
                  Unarchive
                </button>
              ) : (
                <button
                  onClick={() => updateProject(project.id!, { status: "Archived" })}
                  type="button"
                >
                  Archive
                </button>
              )}
              <button
                onClick={() => onOpenProject?.(project.id!)}
                type="button"
              >
                Open project <Icon name="chevronRight" size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
      <ProjectFormDialog
        onClose={() => {
          setProjectDialogOpen(false)
          setEditingProject(undefined)
        }}
        open={projectDialogOpen}
        project={editingProject}
      />
    </div>
  )
}

const allTasks: Task[] = [
  ...tasks,
  {
    title: "Create mobile navigation prototype",
    project: "Mobile App",
    priority: "Medium",
    due: "Sep 25",
    status: "In Progress",
  },
  {
    title: "Approve campaign messaging",
    project: "Marketing Website",
    priority: "High",
    due: "Sep 26",
    status: "In Review",
  },
  {
    title: "Document design tokens",
    project: "Brand Refresh",
    priority: "Low",
    due: "Sep 30",
    status: "To Do",
  },
]

function MyTasksView() {
  const { tasks, members, profile } = useData()
  const [tab, setTab] = useState("All tasks")
  const [search, setSearch] = useState("")
  const [assigneeFilter, setAssigneeFilter] = useState("All")
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)
  const allAssignees = [profile.name, ...members.map((m) => m.name)]
  const shown = (tab === "Completed"
    ? tasks.filter((task) => task.status === "Done")
    : tab === "In progress"
      ? tasks.filter((task) => task.status === "In Progress")
      : tab === "Due soon"
        ? tasks.filter((task) => {
            const d = new Date(task.due)
            if (isNaN(d.getTime())) return task.due === "Today" || task.due === "Tomorrow"
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const dueDate = new Date(d)
            dueDate.setHours(0, 0, 0, 0)
            const diff = Math.round((dueDate.getTime() - today.getTime()) / 86400000)
            return diff === 0 || diff === 1
          })
        : tasks
  )
    .filter((task) =>
      assigneeFilter === "All" ? true : assigneeFilter === "Unassigned" ? !(task.assignees?.length || task.assignee) : (task.assignees ?? (task.assignee ? [task.assignee] : [])).includes(assigneeFilter),
    )
    .filter((task) =>
      search.trim()
        ? (task.title + " " + task.project + " " + task.status + " " + task.priority + " " + (task.assignee ?? ""))
            .toLowerCase()
            .includes(search.toLowerCase())
        : true,
    )

  const [page, setPage] = useState(1)
  const pageSize = 5
  const totalPages = Math.max(1, Math.ceil(shown.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageItems = shown.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  useEffect(() => {
    setPage(1)
  }, [tab, search, assigneeFilter])
  return (
    <div className="dashboard page-view">
      <div className="page-actions">
        <div className="assignee-filter">
          <label>
            Assignee
            <select onChange={(e) => setAssigneeFilter(e.target.value)} value={assigneeFilter}>
              <option value="All">All assignees</option>
              <option value="Unassigned">Unassigned</option>
              {allAssignees.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Button
          onClick={() => {
            setEditingTask(undefined)
            setTaskDialogOpen(true)
          }}
        >
          <Icon name="plus" size={17} /> New task
        </Button>
      </div>
      <section className="task-summary-grid">
        <div>
          <span className="tone-indigo">
            <Icon name="tasks" />
          </span>
          <p>Assigned to me</p>
          <strong>18</strong>
        </div>
        <div>
          <span className="tone-blue">
            <Icon name="clock" />
          </span>
          <p>Due this week</p>
          <strong>7</strong>
        </div>
        <div>
          <span className="tone-green">
            <Icon name="circleCheck" />
          </span>
          <p>Completed</p>
          <strong>12</strong>
        </div>
        <div>
          <span className="tone-red">
            <Icon name="activity" />
          </span>
          <p>Overdue</p>
          <strong>3</strong>
        </div>
      </section>
      <SectionCard title="My work">
        <PageToolbar
          active={tab}
          onSearch={setSearch}
          onTab={setTab}
          placeholder="Search my tasks..."
          searchValue={search}
          tabs={["All tasks", "In progress", "Due soon", "Completed"]}
        />
        <div className="tasks-table-head">
          <span>Task</span>
          <span>Priority</span>
          <span>Due date</span>
          <span>Status</span>
        </div>
        <div className="task-list large">
          {pageItems.map((task) => (
            <TaskRow
              key={task.title}
              onEdit={(selected) => {
                setEditingTask(selected)
                setTaskDialogOpen(true)
              }}
              task={task}
            />
          ))}
        </div>
        <div className="table-footer">
          <span>
            Showing {pageItems.length} of {shown.length} tasks (page {currentPage} of {totalPages})
          </span>
          <div>
            <Button
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              variant="secondary"
            >
              Previous
            </Button>
            <Button
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              variant="secondary"
            >
              Next
            </Button>
          </div>
        </div>
      </SectionCard>
      <TaskFormDialog
        onClose={() => {
          setTaskDialogOpen(false)
          setEditingTask(undefined)
        }}
        open={taskDialogOpen}
        task={editingTask}
      />
    </div>
  )
}

const teamMembers = [
  {
    ...members[0],
    email: "sarah@acmestudio.co",
    roleType: "Member",
    capacity: 80,
  },
  {
    ...members[1],
    email: "david@acmestudio.co",
    roleType: "Member",
    capacity: 60,
  },
  {
    ...members[2],
    email: "maya@acmestudio.co",
    roleType: "Member",
    capacity: 50,
  },
  {
    ...members[3],
    email: "jordan@acmestudio.co",
    roleType: "Member",
    capacity: 40,
  },
]

function TeamInviteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addMember } = useData()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("Member")
  const [created, setCreated] = useState(false)

  useEffect(() => {
    if (!open) {
      setCreated(false)
      setName("")
      setEmail("")
      setRole("Member")
    }
  }, [open])

  if (!open) return null

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    addMember({
      name,
      role,
      email,
      roleType: role,
      capacity: 0,
      color: "indigo",
    })
    setCreated(true)
  }

  return (
    <div aria-modal="true" className="dialog-backdrop" role="dialog">
      <div className="dialog">
        <div className="dialog-head">
          <div>
            <span>INVITE MEMBER</span>
            <h2>{created ? "Member added" : "Add a teammate"}</h2>
          </div>
          <Button onClick={onClose} variant="icon">
            <Icon name="x" />
          </Button>
        </div>
        {created ? (
          <div className="dialog-success">
            <span>
              <Icon name="check" size={24} />
            </span>
            <h3>{name}</h3>
            <p>{email} has been added to Acme Studio.</p>
            <Button onClick={onClose}>Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Name
              <input onChange={(e) => setName(e.target.value)} required value={name} />
            </label>
            <label>
              Email
              <input onChange={(e) => setEmail(e.target.value)} required type="email" value={email} />
            </label>
            <label>
              Role
              <select onChange={(e) => setRole(e.target.value)} value={role}>
                <option>Admin</option>
                <option>Member</option>
                <option>Viewer</option>
              </select>
            </label>
            <div className="dialog-actions">
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button type="submit">
                <Icon name="plus" size={17} />
                Add member
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
function TeamView() {
  const { members, tasks, removeMember, profile } = useData()
  const [inviteOpen, setInviteOpen] = useState(false)
  return (
    <div className="dashboard page-view">
      <div className="team-hero">
        <div className="team-hero-mark">A</div>
        <div>
          <span className="eyebrow">ACME STUDIO</span>
          <h2>Small team, focused work.</h2>
          <p>5 members collaborating across 8 active projects.</p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <Icon name="plus" size={17} /> Invite member
        </Button>
      </div>
      <div className="team-insights">
        <div>
          <span>TEAM CAPACITY</span>
          <strong>68%</strong>
          <div className="progress-track">
            <i style={{ width: "68%" }} />
          </div>
          <small>Healthy workload across the team</small>
        </div>
        <div>
          <span>TASKS THIS WEEK</span>
          <strong>23</strong>
          <p>
            <b>16 completed</b> · 7 remaining
          </p>
        </div>
        <div>
          <span>ACTIVE PROJECTS</span>
          <strong>8</strong>
          <p>3 projects due this month</p>
        </div>
      </div>
      <SectionCard title="Team members">
        <div className="member-table-head">
          <span>Member</span>
          <span>Role</span>
          <span>Assigned</span>
          <span />
        </div>
        <div className="team-table">
          <div className="team-table-row">
            <div className="member-identity">
              <Avatar color="indigo" name={profile.name} />
              <span>
                <strong>{profile.name}</strong>
                <small>{profile.email}</small>
              </span>
            </div>
            <Badge kind="tasks">Admin</Badge>
            <span className="assigned-count">
              {tasks.filter((t) => (t.assignees ?? (t.assignee ? [t.assignee] : [])).includes(profile.name)).length} tasks
            </span>
            <button
              aria-label={`Remove ${profile.name}`}
              className="row-action"
              type="button"
            >
              <Icon name="x" size={17} />
            </button>
          </div>
          {members.map((member) => (
            <div className="team-table-row" key={member.name}>
              <div className="member-identity">
                <Avatar color={member.color as "indigo" | "blue" | "green" | "rose" | "orange"} name={member.name} />
                <span>
                  <strong>{member.name}</strong>
                  <small>{member.email}</small>
                </span>
              </div>
              <Badge kind="tasks">{member.roleType}</Badge>
              <span className="assigned-count">
                {tasks.filter((t) => (t.assignees ?? (t.assignee ? [t.assignee] : [])).includes(member.name)).length} tasks
              </span>
              <button
                aria-label={`Remove ${member.name}`}
                className="row-action"
                onClick={() => removeMember(member.name)}
                type="button"
              >
                <Icon name="x" size={17} />
              </button>
            </div>
          ))}
        </div>
      </SectionCard>
      <TeamInviteDialog onClose={() => setInviteOpen(false)} open={inviteOpen} />
    </div>
  )
}

function Toggle({ checked = false }: { checked?: boolean }) {
  return (
    <label className="toggle">
      <input defaultChecked={checked} type="checkbox" />
      <span />
    </label>
  )
}

function SettingsView() {
  const { profile, workspace, updateProfile, updateWorkspace, projects, tasks, members, replaceData } = useData()
  const [section, setSection] = useState("Profile")
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [title, setTitle] = useState(profile.title)
  const [workspaceName, setWorkspaceName] = useState(workspace.name)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setName(profile.name)
    setEmail(profile.email)
    setTitle(profile.title)
    setWorkspaceName(workspace.name)
  }, [profile, workspace])

  const handleExport = () => {
    const data = JSON.stringify({ projects, tasks, members }, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "teamflow-backup.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        replaceData({
          projects: parsed.projects,
          tasks: parsed.tasks,
          members: parsed.members,
        })
        alert("Backup restored.")
      } catch {
        alert("Invalid backup file.")
      }
    }
    reader.readAsText(file)
    event.target.value = ""
  }

  return (
    <div className="dashboard page-view settings-layout">
      <aside className="settings-nav">
        <span>PERSONAL</span>
        {["Profile", "Notifications"].map((item) => (
          <button
            className={section === item ? "active" : ""}
            key={item}
            onClick={() => setSection(item)}
          >
            {item}
          </button>
        ))}
        <span>WORKSPACE</span>
        {["General", "Members & roles", "Billing", "Data & backup"].map((item) => (
          <button
            className={section === item ? "active" : ""}
            key={item}
            onClick={() => setSection(item)}
          >
            {item}
          </button>
        ))}
      </aside>
      <div className="settings-content">
        <div className="settings-title">
          <h2>{section}</h2>
          <p>
            Manage your {section.toLowerCase()} preferences and information.
          </p>
        </div>
        {section === "Notifications" ? (
          <SectionCard title="Notification preferences">
            <div className="preference-list">
              {[
                [
                  "Task assignments",
                  "Notify me when a task is assigned to me",
                  true,
                ],
                [
                  "Mentions and comments",
                  "Notify me when someone mentions me",
                  true,
                ],
                [
                  "Project updates",
                  "Weekly progress updates for my projects",
                  true,
                ],
                [
                  "Product updates",
                  "Occasional news and feature announcements",
                  false,
                ],
              ].map(([title, copy, checked]) => (
                <div key={String(title)}>
                  <span>
                    <strong>{title}</strong>
                    <small>{copy}</small>
                  </span>
                  <Toggle checked={Boolean(checked)} />
                </div>
              ))}
            </div>
          </SectionCard>
        ) : section === "Profile" ? (
          <>
            <SectionCard title="Personal information">
              <div className="profile-form">
                <div className="profile-photo">
                  <Avatar name={profile.name} size="lg" />
                  <div>
                    <strong>Profile photo</strong>
                    <small>PNG or JPG, up to 2 MB</small>
                  </div>
                  <Button variant="secondary">Change photo</Button>
                </div>
                <div className="settings-form-grid">
                  <label>
                    First name
                    <input
                      onChange={(e) => {
                        const last = name.split(" ").slice(1).join(" ")
                        setName(`${e.target.value} ${last}`.trim())
                      }}
                      value={name.split(" ")[0] ?? ""}
                    />
                  </label>
                  <label>
                    Last name
                    <input
                      onChange={(e) => {
                        const first = name.split(" ")[0] ?? ""
                        setName(`${first} ${e.target.value}`.trim())
                      }}
                      value={name.split(" ").slice(1).join(" ")}
                    />
                  </label>
                  <label className="full">
                    Email address
                    <input onChange={(e) => setEmail(e.target.value)} type="email" value={email} />
                  </label>
                  <label className="full">
                    Role
                    <input onChange={(e) => setTitle(e.target.value)} value={title} />
                  </label>
                </div>
                <div className="settings-actions">
                  <Button
                    onClick={() => {
                      updateProfile({ name, email, title })
                      setSaved(true)
                      setTimeout(() => setSaved(false), 1500)
                    }}
                  >
                    Save changes
                  </Button>
                  {saved && <span className="save-note">Saved</span>}
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Security">
              <div className="security-row">
                <div>
                  <strong>Password</strong>
                  <span>Last changed 3 months ago</span>
                </div>
                <Button variant="secondary">Update password</Button>
              </div>
            </SectionCard>
          </>
        ) : section === "Data & backup" ? (
          <SectionCard title="Data & backup">
            <div className="backup-actions">
              <p>Export your projects, tasks, and team members as a JSON file, or restore from a backup.</p>
              <div className="backup-buttons">
                <Button onClick={handleExport}>Export backup</Button>
                <label className="backup-import">
                  <input
                    accept="application/json"
                    onChange={handleImport}
                    type="file"
                  />
                  <span>Import backup</span>
                </label>
                <Button
                  onClick={() => {
                    if (confirm("Clear all local data? This cannot be undone.")) {
                      Object.keys(localStorage)
                        .filter((key) => key.startsWith("teamflow:"))
                        .forEach((key) => localStorage.removeItem(key))
                      window.location.reload()
                    }
                  }}
                  variant="secondary"
                >
                  Clear all data
                </Button>
              </div>
            </div>
          </SectionCard>
        ) : section === "General" ? (
          <SectionCard title="Workspace details">
            <div className="settings-form-grid">
              <label className="full">
                Workspace name
                <input
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  value={workspaceName}
                />
              </label>
            </div>
            <div className="settings-actions">
              <Button
                onClick={() => {
                  updateWorkspace({ name: workspaceName })
                  setSaved(true)
                  setTimeout(() => setSaved(false), 1500)
                }}
              >
                Save changes
              </Button>
              {saved && <span className="save-note">Saved</span>}
            </div>
          </SectionCard>
        ) : (
          <SectionCard title={`${section} settings`}>
            <div className="placeholder-settings">
              <span className="stat-icon tone-indigo">
                <Icon name="settings" />
              </span>
              <h3>{section}</h3>
              <p>
                Manage {section.toLowerCase()} for the Acme Studio workspace.
              </p>
              <Button variant="secondary">Review settings</Button>
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  )
}

function BoardView() {
  const { tasks, members, profile, setTaskStatus } = useData()
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [assigneeFilter, setAssigneeFilter] = useState("All")
  const columns: Status[] = ["To Do", "In Progress", "In Review", "Done"]
  const allAssignees = [profile.name, ...members.map((m) => m.name)]

  const handleDrop = (status: Status) => {
    if (draggingId) setTaskStatus(draggingId, status)
    setDraggingId(null)
  }

  const visibleTasks = tasks.filter((task) =>
    assigneeFilter === "All"
      ? true
      : assigneeFilter === "Unassigned"
        ? !(task.assignees?.length || task.assignee)
        : (task.assignees ?? (task.assignee ? [task.assignee] : [])).includes(assigneeFilter),
  )

  return (
    <div className="dashboard page-view">
      <div className="page-actions">
        <div className="assignee-filter">
          <label>
            Assignee
            <select onChange={(e) => setAssigneeFilter(e.target.value)} value={assigneeFilter}>
              <option value="All">All assignees</option>
              <option value="Unassigned">Unassigned</option>
              {allAssignees.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="board-columns">
        {columns.map((column) => {
          const columnTasks = visibleTasks.filter((task) => task.status === column)
          return (
            <section
              className="board-column"
              key={column}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(column)}
            >
              <header className="board-column-head">
                <h3>{column}</h3>
                <Badge kind={column === "Done" ? "done" : "tasks"}>{columnTasks.length}</Badge>
              </header>
              <div className="board-cards">
                {columnTasks.map((task) => (
                  <article
                    className={`board-card ${isOverdue(task.due, task.status) ? "overdue" : ""}`}
                    draggable
                    key={task.id ?? task.title}
                    onDragStart={() => setDraggingId(task.id ?? null)}
                    style={{ borderLeft: `4px solid ${projectColor(task.project)}` }}
                  >
                    <strong>{task.title}</strong>
                    <span>{task.project}{(task.assignees ?? (task.assignee ? [task.assignee] : [])).length ? ` · ${(task.assignees ?? (task.assignee ? [task.assignee] : [])).join(", ")}` : ""}</span>
                    <div className="board-card-meta">
                      <Badge kind={task.priority}>{task.priority}</Badge>
                      <span className="due-date">
                        <Icon name="clock" size={12} />
                        {formatDue(task.due)}
                      </span>
                    </div>
                  </article>
                ))}
                {columnTasks.length === 0 && <div className="board-empty">Drop tasks here</div>}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}


function ProjectFormDialog({
  open,
  onClose,
  project,
}: {
  open: boolean
  onClose: () => void
  project?: Project
}) {
  const { addProject, updateProject, members, profile } = useData()
  const editing = !!project
  const [name, setName] = useState(project?.name ?? "Marketing Campaign")
  const [description, setDescription] = useState(project?.description ?? "Plan and coordinate the upcoming product campaign.")
  const [status, setStatus] = useState<"Active" | "Planning">(project?.status === "Planning" ? "Planning" : "Active")
  const [due, setDue] = useState(project?.due ?? new Date().toISOString().slice(0, 10))
  const [team, setTeam] = useState<string[]>(project?.team ?? [])
  const [createdName, setCreatedName] = useState("")
  const [created, setCreated] = useState(false)

  useEffect(() => {
    if (!open) {
      setCreated(false)
      setCreatedName("")
      return
    }
    setName(project?.name ?? "Marketing Campaign")
    setDescription(project?.description ?? "Plan and coordinate the upcoming product campaign.")
    setStatus(project?.status === "Planning" ? "Planning" : "Active")
    setDue(project?.due ?? new Date().toISOString().slice(0, 10))
    setTeam(project?.team ?? [])
  }, [open, project])

  if (!open) return null

  const allMembers = [profile.name, ...members.map((m) => m.name)]

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (editing && project?.id) {
      updateProject(project.id, {
        name,
        description,
        due,
        status: status === "Planning" ? "Planning" : "On track",
        team,
      })
    } else {
      addProject({
        name,
        description,
        progress: 0,
        due,
        status: status === "Planning" ? "Planning" : "On track",
        tone: "indigo",
        team,
      })
    }
    setCreatedName(name)
    setCreated(true)
  }

  return (
    <div aria-modal="true" className="dialog-backdrop" role="dialog">
      <div className="dialog">
        <div className="dialog-head">
          <div>
            <span>{editing ? "EDIT PROJECT" : "NEW PROJECT"}</span>
            <h2>{created ? (editing ? "Project updated" : "Project created") : editing ? "Edit project" : "Start something new"}</h2>
          </div>
          <Button onClick={onClose} variant="icon">
            <Icon name="x" />
          </Button>
        </div>
        {created ? (
          <div className="dialog-success">
            <span>
              <Icon name="check" size={24} />
            </span>
            <h3>{createdName} is ready</h3>
            <p>{editing ? "Changes saved." : "Your new project has been added to Acme Studio."}</p>
            <Button onClick={onClose}>{editing ? "Done" : "View project"}</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Project name
              <input onChange={(event) => setName(event.target.value)} required value={name} />
            </label>
            <label>
              Description
              <textarea onChange={(event) => setDescription(event.target.value)} rows={3} value={description} />
            </label>
            <div className="form-row">
              <label>
                Status
                <select onChange={(event) => setStatus(event.target.value as "Active" | "Planning")} value={status}>
                  <option>Active</option>
                  <option>Planning</option>
                </select>
              </label>
              <label>
                Due date
                <input onChange={(event) => setDue(event.target.value)} type="date" value={due} />
              </label>
            </div>
            <label className="full">
              Team members
              <div className="team-checkboxes">
                {allMembers.map((memberName) => (
                  <label className="checkbox-row" key={memberName}>
                    <input
                      checked={team.includes(memberName)}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setTeam((prev) => [...prev, memberName])
                        } else {
                          setTeam((prev) => prev.filter((n) => n !== memberName))
                        }
                      }}
                      type="checkbox"
                    />
                    {memberName}
                  </label>
                ))}
              </div>
            </label>
            <div className="dialog-actions">
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
              <Button type="submit">
                <Icon name="plus" size={17} />
                {editing ? "Save changes" : "Create project"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function ProjectDetailView({ projectId, onBack }: { projectId: string; onBack: () => void }) {
  const { projects, tasks, updateProject, projectProgress } = useData()
  const project = projects.find((p) => p.id === projectId)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)
  const projectTasks = tasks.filter((task) => task.project === project?.name)

  if (!project) {
    return (
      <div className="dashboard page-view">
        <Button onClick={onBack} variant="secondary">
          Back to projects
        </Button>
        <p>Project not found.</p>
      </div>
    )
  }

  return (
    <div className="dashboard page-view">
      <div className="page-actions">
        <Button onClick={onBack} variant="secondary">
          Back to projects
        </Button>
        <Button
          onClick={() => {
            setEditingTask(undefined)
            setTaskDialogOpen(true)
          }}
        >
          <Icon name="plus" size={17} /> New task
        </Button>
      </div>
      <SectionCard title={project.name}>
        <div className="project-detail-meta">
          <p>{project.description}</p>
          <div className="project-detail-stats">
            <span>Status: {project.status}</span>
            <span>Progress: {projectProgress(project.name)}%</span>
            <span>Due: {project.due}</span>
            <span>Team: {project.team.join(", ") || "—"}</span>
          </div>
          <div className="project-card-actions">
            <button
              onClick={() => {
                const next = prompt("Edit project name", project.name)
                if (next && next !== project.name) updateProject(project.id!, { name: next })
              }}
              type="button"
            >
              Rename
            </button>
            {project.status === "Archived" ? (
              <button
                onClick={() => updateProject(project.id!, { status: "On track" })}
                type="button"
              >
                Unarchive
              </button>
            ) : (
              <button
                onClick={() => updateProject(project.id!, { status: "Archived" })}
                type="button"
              >
                Archive
              </button>
            )}
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Tasks">
        <div className="task-list large">
          {projectTasks.length === 0 && <div className="board-empty">No tasks yet.</div>}
          {projectTasks.map((task) => (
            <TaskRow
              key={task.id ?? task.title}
              onEdit={(selected) => {
                setEditingTask(selected)
                setTaskDialogOpen(true)
              }}
              task={task}
            />
          ))}
        </div>
      </SectionCard>
      <TaskFormDialog
        defaultProject={project.name}
        onClose={() => {
          setTaskDialogOpen(false)
          setEditingTask(undefined)
        }}
        open={taskDialogOpen}
        task={editingTask}
      />
    </div>
  )
}

function HelpView() {
  const [openFaq, setOpenFaq] = useState(0)
  const faqs = [
    ["How do I track work for my team?", "Create tasks and assign them to yourself or a co-worker. Update status and add completion notes as work progresses."],
    ["Can co-workers log in?", "No. This is an admin-managed tracker. The admin records and updates everyone’s work."],
    ["How is project progress calculated?", "Progress is based on the percentage of project tasks marked as Done."],
    ["How do I back up my data?", "Open Settings → Data & backup to export or import a JSON file."],
  ]
  return (
    <div className="dashboard page-view">
      <section className="help-hero">
        <h2>Help & Support</h2>
        <p>Find guidance and get support when you need it.</p>
        <div className="help-search">
          <Icon name="search" />
          <input placeholder="Search for articles and answers..." />
          <kbd>⌘ K</kbd>
        </div>
      </section>
      <div className="help-topic-grid">
        {[
          ["folder", "Projects & planning", "Create projects, set milestones, and track progress."],
          ["tasks", "Tasks & workflows", "Assign work, manage status, and stay on schedule."],
          ["team", "Team management", "Invite teammates and manage workspace roles."],
          ["settings", "Account & settings", "Update your profile, preferences, and workspace."],
        ].map(([icon, title, copy]) => (
          <button className="help-topic" key={title} type="button">
            <span>
              <Icon name={icon as IconName} />
            </span>
            <strong>{title}</strong>
            <p>{copy}</p>
            <b>
              Browse articles <Icon name="chevronRight" size={14} />
            </b>
          </button>
        ))}
      </div>
      <div className="help-bottom-grid">
        <SectionCard title="Frequently asked questions">
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <button key={question} onClick={() => setOpenFaq(index)} type="button">
                <span>
                  <strong>{question}</strong>
                  {openFaq === index && <p>{answer}</p>}
                </span>
                <Icon name={openFaq === index ? "chevronDown" : "chevronRight"} size={16} />
              </button>
            ))}
          </div>
        </SectionCard>
        <section className="contact-card">
          <span>
            <Icon name="help" size={22} />
          </span>
          <h3>Still need help?</h3>
          <p>Our support team typically responds within one business day.</p>
          <Button>Contact support</Button>
          <small>Available Monday–Friday</small>
        </section>
      </div>
    </div>
  )
}

export default function App() {
  const { projects, tasks, members, profile } = useData()
  const [page, setPage] = useState<"landing" | "app">("landing")
  const [activeNav, setActiveNav] = useState("Overview")
  const [filter, setFilter] = useState("All")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const handleNavigate = (label: string) => {
    if (label !== "Projects") setSelectedProjectId(null)
    setActiveNav(label)
  }
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const descriptions: Record<string, string> = {
    Overview: "Here’s what’s happening with your team today.",
    Board: "Visualize and move tasks across statuses.",
    Projects: "Plan, organize, and track work across your project portfolio.",
    "My Tasks": "Stay focused on the work assigned to you.",
    Team: "Manage members, roles, and team capacity.",
    Settings: "Manage your account and workspace preferences.",
    "Help & Support": "Find guidance and get support when you need it.",
  }

  const searchIndex = useMemo(
    () => [
      ...navItems.map((item) => ({
        type: "Page",
        title: item.label,
        subtitle: "Navigate to page",
        action: () => handleNavigate(item.label),
      })),
      { type: "Page", title: "Settings", subtitle: "Account & workspace", action: () => handleNavigate("Settings") },
      { type: "Page", title: "Help & Support", subtitle: "Guidance & support", action: () => handleNavigate("Help & Support") },
      ...projects.map((project) => ({
        type: "Project",
        title: project.name,
        subtitle: project.description,
        action: () => handleNavigate("Projects"),
      })),
      ...tasks.map((task) => ({
        type: "Task",
        title: task.title,
        subtitle: `${task.project} · ${task.status}`,
        action: () => handleNavigate("My Tasks"),
      })),
      ...members.map((member) => ({
        type: "Member",
        title: member.name,
        subtitle: member.role,
        action: () => handleNavigate("Team"),
      })),
    ],
    [projects, tasks, members],
  )

  const suggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return []
    return searchIndex
      .filter((item) =>
        (item.title + " " + item.subtitle + " " + item.type)
          .toLowerCase()
          .includes(query),
      )
      .slice(0, 8)
  }, [searchIndex, searchQuery])

  if (page === "landing") {
    return <LandingPage onEnter={() => setPage("app")} />
  }

  return (
    <div className="app-shell">
      <Sidebar
        active={activeNav}
        onClose={() => setSidebarOpen(false)}
        onNavigate={handleNavigate}
        open={sidebarOpen}
      />
      <main className="main-content">
        <div className="mobile-bar">
          <button aria-label="Open menu" onClick={() => setSidebarOpen(true)}>
            <Icon name="menu" />
          </button>
          <Brand />
          <Avatar name="Alex Morgan" size="sm" />
        </div>
        <header className="top-header">
          <div>
            <div className="breadcrumb">
              <span>Workspace</span>
              <Icon name="chevronRight" size={13} />
              <strong>{activeNav}</strong>
            </div>
            <h1>
              {activeNav === "Overview" ? "Good morning, Alex" : activeNav}
            </h1>
            <p>{descriptions[activeNav]}</p>
          </div>
          <div className="header-actions">
            {searchOpen && (
              <div className="header-search-wrap">
                <div className="header-search">
                  <Icon name="search" size={16} />
                  <input
                    autoFocus
                    onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search workspace..."
                    value={searchQuery}
                  />
                  {searchQuery && (
                    <button
                      className="search-clear"
                      onClick={() => setSearchQuery("")}
                      type="button"
                    >
                      <Icon name="x" size={14} />
                    </button>
                  )}
                </div>
                {suggestions.length > 0 && (
                  <div className="search-suggestions">
                    {suggestions.map((item, index) => (
                      <button
                        className="search-suggestion"
                        key={`${item.type}-${item.title}-${index}`}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          item.action()
                          setSearchOpen(false)
                          setSearchQuery("")
                        }}
                        type="button"
                      >
                        <span className="search-suggestion-type">{item.type}</span>
                        <span className="search-suggestion-title">{item.title}</span>
                        <span className="search-suggestion-sub">{item.subtitle}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery.trim() && suggestions.length === 0 && (
                  <div className="search-suggestions">
                    <div className="search-empty">No matching results</div>
                  </div>
                )}
              </div>
            )}
            <Button onClick={() => setPage("landing")} variant="secondary">
              Home
            </Button>
            {!searchOpen && (
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSearchOpen(true)
                }}
                variant="icon"
              >
                <Icon name="search" />
              </Button>
            )}
            <Button variant="icon">
              <Icon name="bell" />
              <span className="notification-dot" />
            </Button>
            <span className="header-avatar">
              <Avatar name={profile.name} />
            </span>
            <Button onClick={() => setDialogOpen(true)}>
              <Icon name="plus" size={18} />
              New Project
            </Button>
          </div>
        </header>

        {activeNav === "Overview" && (
          <OverviewView filter={filter} onFilter={setFilter} onNavigate={handleNavigate} />
        )}
        {activeNav === "Board" && <BoardView />}
        {activeNav === "Projects" && selectedProjectId && (
          <ProjectDetailView
            onBack={() => setSelectedProjectId(null)}
            projectId={selectedProjectId}
          />
        )}
        {activeNav === "Projects" && !selectedProjectId && (
          <ProjectsView onOpenProject={setSelectedProjectId} />
        )}
        {activeNav === "My Tasks" && <MyTasksView />}
        {activeNav === "Team" && <TeamView />}
        {activeNav === "Settings" && <SettingsView />}
        {activeNav === "Help & Support" && <HelpView />}
      </main>
      <ProjectFormDialog
        onClose={() => setDialogOpen(false)}
        open={dialogOpen}
      />
    </div>
  )
}
