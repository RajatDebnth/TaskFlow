import type { Member, Project, Task } from "../types"

export const seedMembers: Member[] = [
  { name: "Sarah Chen", role: "Product Designer", email: "sarah@acmestudio.co", roleType: "Member", capacity: 80, color: "indigo" },
  { name: "David Lee", role: "Frontend Engineer", email: "david@acmestudio.co", roleType: "Member", capacity: 60, color: "blue" },
  { name: "Maya Patel", role: "Marketing Lead", email: "maya@acmestudio.co", roleType: "Member", capacity: 50, color: "green" },
  { name: "Jordan Kim", role: "Backend Engineer", email: "jordan@acmestudio.co", roleType: "Member", capacity: 40, color: "rose" },
]

export const seedProjects: Project[] = [
  { id: "p1", name: "Website Redesign", description: "Refresh the public site and improve the conversion journey.", progress: 75, due: "Sep 24", status: "On track", tone: "indigo", team: ["Sarah Chen", "Alex Morgan", "David Lee"], createdAt: new Date().toISOString() },
  { id: "p2", name: "Mobile App", description: "Ship the first native mobile experience for customers.", progress: 48, due: "Oct 12", status: "At risk", tone: "blue", team: ["David Lee", "Jordan Kim", "Alex Morgan"], createdAt: new Date().toISOString() },
  { id: "p3", name: "Marketing Website", description: "Launch campaign pages for the new product release.", progress: 90, due: "Sep 18", status: "On track", tone: "green", team: ["Maya Patel", "Sarah Chen"], createdAt: new Date().toISOString() },
  { id: "p4", name: "Product Dashboard", description: "Simplify onboarding and core reporting workflows.", progress: 62, due: "Oct 04", status: "On track", tone: "indigo", team: ["Sarah Chen", "Jordan Kim"], createdAt: new Date().toISOString() },
  { id: "p5", name: "Brand Refresh", description: "Create a flexible visual language across all touchpoints.", progress: 35, due: "Oct 28", status: "Planning", tone: "blue", team: ["Sarah Chen", "Maya Patel"], createdAt: new Date().toISOString() },
  { id: "p6", name: "Customer Portal", description: "Build a self-serve space for account and billing updates.", progress: 20, due: "Nov 14", status: "Planning", tone: "indigo", team: ["David Lee", "Jordan Kim"], createdAt: new Date().toISOString() },
]

export const seedTasks: Task[] = [
  { id: "t1", title: "Finalize homepage wireframes", project: "Website Redesign", priority: "High", due: new Date().toISOString().slice(0, 10), status: "In Progress", assignee: "Sarah Chen", createdAt: new Date().toISOString() },
  { id: "t2", title: "Review API integration", project: "Mobile App", priority: "Medium", due: new Date(Date.now() + 86400000).toISOString().slice(0, 10), status: "In Review", assignee: "David Lee", createdAt: new Date().toISOString() },
  { id: "t3", title: "Prepare launch checklist", project: "Marketing Website", priority: "High", due: "2025-09-18", status: "To Do", overdue: true, assignee: "Maya Patel", createdAt: new Date().toISOString() },
  { id: "t4", title: "Update onboarding flow", project: "Product Dashboard", priority: "Low", due: "2025-09-22", status: "Done", assignee: "Alex Morgan", completionNote: "Shipped new onboarding steps and validated with 5 users.", completedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
  { id: "t5", title: "Create mobile navigation prototype", project: "Mobile App", priority: "Medium", due: "2025-09-25", status: "In Progress", assignee: "Jordan Kim", createdAt: new Date().toISOString() },
  { id: "t6", title: "Approve campaign messaging", project: "Marketing Website", priority: "High", due: "2025-09-26", status: "In Review", assignee: "Maya Patel", createdAt: new Date().toISOString() },
  { id: "t7", title: "Document design tokens", project: "Brand Refresh", priority: "Low", due: "2025-09-30", status: "To Do", assignee: "Sarah Chen", createdAt: new Date().toISOString() },
]