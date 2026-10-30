import type { Member, Project, Task } from "../types"

export const seedMembers: Member[] = [
  { name: "Priya Sharma", role: "Product Designer", email: "priya@acmestudio.co", roleType: "Member", capacity: 0, color: "indigo" },
  { name: "Rahul Verma", role: "Frontend Engineer", email: "rahul@acmestudio.co", roleType: "Member", capacity: 0, color: "blue" },
  { name: "Ananya Iyer", role: "Marketing Lead", email: "ananya@acmestudio.co", roleType: "Member", capacity: 0, color: "green" },
  { name: "Vikram Singh", role: "Backend Engineer", email: "vikram@acmestudio.co", roleType: "Member", capacity: 0, color: "rose" },
  { name: "Neha Gupta", role: "QA Engineer", email: "neha@acmestudio.co", roleType: "Member", capacity: 0, color: "amber" },
  { name: "Arjun Patel", role: "DevOps Engineer", email: "arjun@acmestudio.co", roleType: "Member", capacity: 0, color: "blue" },
  { name: "Kavya Reddy", role: "UX Researcher", email: "kavya@acmestudio.co", roleType: "Member", capacity: 0, color: "green" },
  { name: "Rohan Mehta", role: "Data Analyst", email: "rohan@acmestudio.co", roleType: "Member", capacity: 0, color: "indigo" },
]

export const seedProjects: Project[] = [
  { id: "p1", name: "Website Redesign", description: "Refresh the public site and improve the conversion journey.", progress: 0, due: "2025-09-24", status: "On track", tone: "indigo", team: ["Priya Sharma", "Rajat Nath", "Rahul Verma"], createdAt: new Date().toISOString() },
  { id: "p2", name: "Mobile App", description: "Ship the first native mobile experience for customers.", progress: 0, due: "2025-10-12", status: "At risk", tone: "blue", team: ["Rahul Verma", "Vikram Singh", "Rajat Nath"], createdAt: new Date().toISOString() },
  { id: "p3", name: "Marketing Website", description: "Launch campaign pages for the new product release.", progress: 0, due: "2025-09-18", status: "On track", tone: "green", team: ["Ananya Iyer", "Priya Sharma"], createdAt: new Date().toISOString() },
  { id: "p4", name: "Product Dashboard", description: "Simplify onboarding and core reporting workflows.", progress: 0, due: "2025-10-04", status: "On track", tone: "indigo", team: ["Priya Sharma", "Vikram Singh"], createdAt: new Date().toISOString() },
  { id: "p5", name: "Brand Refresh", description: "Create a flexible visual language across all touchpoints.", progress: 0, due: "2025-10-28", status: "Planning", tone: "blue", team: ["Priya Sharma", "Ananya Iyer"], createdAt: new Date().toISOString() },
  { id: "p6", name: "Customer Portal", description: "Build a self-serve space for account and billing updates.", progress: 0, due: "2025-11-14", status: "Planning", tone: "indigo", team: ["Rahul Verma", "Vikram Singh"], createdAt: new Date().toISOString() },
  { id: "p7", name: "API Gateway", description: "Consolidate backend services behind a single gateway.", progress: 0, due: "2025-09-30", status: "On track", tone: "green", team: ["Vikram Singh", "Arjun Patel"], createdAt: new Date().toISOString() },
  { id: "p8", name: "Analytics Dashboard", description: "Real-time metrics and reporting for product usage.", progress: 0, due: "2025-10-15", status: "At risk", tone: "blue", team: ["Rohan Mehta", "Neha Gupta"], createdAt: new Date().toISOString() },
  { id: "p9", name: "Mobile Onboarding", description: "Streamline first-time user experience on mobile.", progress: 0, due: "2025-10-20", status: "On track", tone: "indigo", team: ["Rahul Verma", "Kavya Reddy"], createdAt: new Date().toISOString() },
  { id: "p10", name: "Payment Integration", description: "Add Razorpay and UPI payment flows.", progress: 0, due: "2025-10-08", status: "Completed", tone: "green", team: ["Vikram Singh", "Arjun Patel"], createdAt: new Date().toISOString() },
  { id: "p11", name: "Email Campaigns", description: "Automated email sequences for user engagement.", progress: 0, due: "2025-10-22", status: "Planning", tone: "blue", team: ["Ananya Iyer", "Neha Gupta"], createdAt: new Date().toISOString() },
  { id: "p12", name: "Search Optimization", description: "Improve search relevance and speed.", progress: 0, due: "2025-09-28", status: "On track", tone: "indigo", team: ["Rohan Mehta", "Rahul Verma"], createdAt: new Date().toISOString() },
  { id: "p13", name: "Security Audit", description: "Review auth, permissions, and data protection.", progress: 0, due: "2025-10-18", status: "At risk", tone: "indigo", team: ["Vikram Singh", "Arjun Patel"], createdAt: new Date().toISOString() },
  { id: "p14", name: "Documentation Portal", description: "Centralized docs for developers and users.", progress: 0, due: "2025-11-01", status: "Planning", tone: "blue", team: ["Priya Sharma", "Kavya Reddy"], createdAt: new Date().toISOString() },
  { id: "p15", name: "Performance Tuning", description: "Optimize load times and bundle size.", progress: 0, due: "2025-10-10", status: "Completed", tone: "green", team: ["Rahul Verma", "Arjun Patel"], createdAt: new Date().toISOString() },
  { id: "p16", name: "Accessibility Review", description: "WCAG compliance and keyboard navigation.", progress: 0, due: "2025-10-25", status: "On track", tone: "indigo", team: ["Priya Sharma", "Kavya Reddy"], createdAt: new Date().toISOString() },
  { id: "p17", name: "Notification System", description: "Email and in-app notifications.", progress: 0, due: "2025-10-30", status: "Planning", tone: "blue", team: ["Vikram Singh", "Neha Gupta"], createdAt: new Date().toISOString() },
  { id: "p18", name: "Localization", description: "Multi-language support (Hindi, Tamil, etc.).", progress: 0, due: "2025-11-05", status: "Planning", tone: "green", team: ["Ananya Iyer", "Rohan Mehta"], createdAt: new Date().toISOString() },
  { id: "p19", name: "Backup & Restore", description: "Automated backups and one-click restore.", progress: 0, due: "2025-10-14", status: "On track", tone: "indigo", team: ["Arjun Patel", "Vikram Singh"], createdAt: new Date().toISOString() },
  { id: "p20", name: "User Feedback Portal", description: "Collect and triage user feedback.", progress: 0, due: "2025-11-10", status: "Planning", tone: "blue", team: ["Ananya Iyer", "Neha Gupta"], createdAt: new Date().toISOString() },
]

export const seedTasks: Task[] = [
  { id: "t1", title: "Finalize homepage wireframes", project: "Website Redesign", priority: "High", due: new Date().toISOString().slice(0, 10), status: "In Progress", assignees: ["Priya Sharma"], progress: 50, createdAt: new Date().toISOString() },
  { id: "t2", title: "Review API integration", project: "Mobile App", priority: "Medium", due: new Date(Date.now() + 86400000).toISOString().slice(0, 10), status: "In Review", assignees: ["Rahul Verma", "Vikram Singh"], progress: 75, createdAt: new Date().toISOString() },
  { id: "t3", title: "Prepare launch checklist", project: "Marketing Website", priority: "High", due: "2025-09-18", status: "To Do", overdue: true, assignees: ["Ananya Iyer"], progress: 0, createdAt: new Date().toISOString() },
  { id: "t4", title: "Update onboarding flow", project: "Product Dashboard", priority: "Low", due: "2025-09-22", status: "Done", assignees: ["Rajat Nath"], completionNote: "Shipped new onboarding steps and validated with 5 users.", completedAt: new Date().toISOString(), progress: 100, createdAt: new Date().toISOString() },
  { id: "t5", title: "Create mobile navigation prototype", project: "Mobile App", priority: "Medium", due: "2025-09-25", status: "In Progress", assignees: ["Kavya Reddy"], progress: 50, createdAt: new Date().toISOString() },
  { id: "t6", title: "Approve campaign messaging", project: "Marketing Website", priority: "High", due: "2025-09-26", status: "In Review", assignees: ["Ananya Iyer", "Neha Gupta"], progress: 75, createdAt: new Date().toISOString() },
  { id: "t7", title: "Document design tokens", project: "Brand Refresh", priority: "Low", due: "2025-09-30", status: "To Do", assignees: ["Priya Sharma"], progress: 0, createdAt: new Date().toISOString() },
  { id: "t8", title: "Set up CI pipeline", project: "API Gateway", priority: "High", due: "2025-09-30", status: "Done", assignees: ["Vikram Singh", "Arjun Patel"], completionNote: "GitHub Actions configured.", completedAt: new Date().toISOString(), progress: 100, createdAt: new Date().toISOString() },
  { id: "t9", title: "Build analytics charts", project: "Analytics Dashboard", priority: "Medium", due: "2025-10-10", status: "In Progress", assignees: ["Rohan Mehta"], progress: 40, createdAt: new Date().toISOString() },
  { id: "t10", title: "Design mobile splash screen", project: "Mobile Onboarding", priority: "Low", due: "2025-10-05", status: "To Do", overdue: true, assignees: ["Kavya Reddy"], progress: 0, createdAt: new Date().toISOString() },
  { id: "t11", title: "Integrate Razorpay", project: "Payment Integration", priority: "High", due: "2025-10-01", status: "Done", assignees: ["Vikram Singh"], completionNote: "UPI and cards working.", completedAt: new Date().toISOString(), progress: 100, createdAt: new Date().toISOString() },
  { id: "t12", title: "Draft email templates", project: "Email Campaigns", priority: "Medium", due: "2025-10-12", status: "In Review", assignees: ["Ananya Iyer"], progress: 60, createdAt: new Date().toISOString() },
  { id: "t13", title: "Optimize search index", project: "Search Optimization", priority: "High", due: "2025-09-28", status: "In Progress", assignees: ["Rohan Mehta", "Rahul Verma"], progress: 30, createdAt: new Date().toISOString() },
  { id: "t14", title: "Run penetration test", project: "Security Audit", priority: "High", due: "2025-10-15", status: "To Do", assignees: ["Vikram Singh", "Arjun Patel"], progress: 0, createdAt: new Date().toISOString() },
  { id: "t15", title: "Write API docs", project: "Documentation Portal", priority: "Low", due: "2025-10-20", status: "In Progress", assignees: ["Priya Sharma"], progress: 20, createdAt: new Date().toISOString() },
]