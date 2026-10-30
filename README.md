# TaskFlow

TaskFlow is a lightweight project and task management dashboard for small teams (2–10 people).  
It is built as a **frontend-first, local-only tracker**: all data is stored in the browser (localStorage), with no backend required to run it.

> Status: **Frontend prototype (local-only).** Backend, auth, and multi-user collaboration are planned for future versions.

---

## Present condition

### What works today
- **Landing page** — marketing-style hero, product preview, features, testimonials, integrations, final CTA, footer.
- **Dashboard (Overview)** — stats (projects, tasks, completed, overdue), workload by assignee, recent activity.
- **Wheel-free overview layout** — stats grid + My Tasks, Project Progress, Recent Activity, Workload, with “View all” links.
- **Projects** — create, edit, archive/unarchive, search & filter tabs (Active/Planning/Completed/Archived/All), project detail page with task list.
- **Tasks** — create, edit, delete, toggle Done, multi-assignee, priority, status, due date (calendar input), completion notes, estimated/actual hours, task-level progress %.
- **Kanban board** — drag-and-drop tasks between status columns, colored by project.
- **Team** — add/remove members, assignee filters, assigned-task counts.
- **Search** — global header search with related suggestions; page-level search filters lists.
- **Settings** — profile & workspace details editing.
- **Data & backup** — export/import JSON, clear all local data.
- **Activity log** — records create/update/delete/archive actions.
- **Design system** — `DESIGN_SYSTEM.md` with tokens for color, typography, spacing, radius, cards, buttons, inputs.

### Tech stack
- React 19 + TypeScript + Vite 8
- Tailwind CSS v4
- Local persistence via `localStorage` (keys prefixed `teamflow:`)

### Local development
```bash
pnpm install
pnpm dev          # http://localhost:8443
pnpm build        # production build
pnpm exec tsc --noEmit   # type check
```

### Data storage
All data lives in the browser:
- `teamflow:projects`, `teamflow:tasks`, `teamflow:members`
- `teamflow:profile`, `teamflow:workspace`, `teamflow:activities`

Clearing browser storage resets to seed data. Use Settings → Data & backup → Export/Import to move data between devices.

---

## Future versions (roadmap)

### v2 — Backend integration
- **FastAPI + PostgreSQL** backend with REST API (`/api/v1`).
- **Auth**: register, login, logout, JWT with secure password hashing.
- **Multi-user / teams**: team creation, memberships, roles (admin/member/viewer).
- **Server-side authorization** on every protected resource.
- **Alembic migrations**, UUID primary keys, UTC timestamps.
- **TanStack Query** on frontend for API state + caching.
- **React Router** for real routing (`/login`, `/register`, `/app`, `/app/projects/:id`, `/app/board/:projectId`, etc.).
- Deploy frontend to Vercel, backend to a managed host.

### v3 — AI integration
- **AI task assistant**: turn a brief into a task plan, assign owners, set priorities/due dates.
- **Progress summarization**: weekly digest of completed/overdue work per member.
- **Blocker detection**: surface stalled tasks and suggest next actions.
- **Smart search**: natural-language search across projects, tasks, and activity.
- **AI-generated project templates** for common workflows.

### v4 — Data analytics
- **Analytics dashboard**: throughput, cycle time, lead time, burndown/burnup charts.
- **Team performance**: per-member completion rates, capacity utilization, overdue trends.
- **Project health scores**: risk indicators based on overdue ratio and velocity.
- **Exportable reports** (CSV/PDF) and scheduled email digests.
- **Forecasting**: estimated completion dates based on historical velocity.

### Additional features
- Real-time updates (WebSockets) for multi-user sessions.
- File attachments on tasks/projects.
- Comments and @mentions.
- Recurring tasks and task templates.
- Calendar view with drag-and-drop scheduling.
- Notifications (email + in-app).
- Mobile-responsive PWA with offline support.
- Dark mode.
- Role-based permissions and audit logs.
- Integrations: Slack, GitHub, Google Workspace, Figma, Zapier.

---

## Project structure
```
teamflow/
├── src/
│   ├── App.tsx            # Main app + views
│   ├── LandingPage.tsx    # Landing page (reference design)
│   ├── store.tsx          # Local data store (localStorage)
│   ├── types.ts           # Shared types
│   ├── lib/
│   │   ├── storage.ts     # localStorage helpers
│   │   └── seed.ts        # Seed data
│   ├── index.css          # Global styles + design tokens
│   └── main.tsx           # Entry point
├── reference/             # Design reference (landing page)
├── DESIGN_SYSTEM.md
├── package.json
└── vite.config.ts
```

---

## License
MIT (or your chosen license).