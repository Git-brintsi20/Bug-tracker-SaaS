<div align="center">

# 🐛 BugTracker SaaS

### _Ship faster. Bug less._

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

<br/>

A **modern, real-time** bug tracking and issue management platform built with a **microservices architecture**.
Designed for teams that move fast — collaborate, track progress, and ship with confidence.

<br/>

[**Demo Video**](https://youtu.be/jkp0S1r_nMM) · [**Report Bug**](https://github.com/Git-brintsi20/Bug-tracker-SaaS/issues) · [**Request Feature**](https://github.com/Git-brintsi20/Bug-tracker-SaaS/issues)

<br/>

<img src="./public/Home_page.png" alt="BugTracker homepage preview" width="100%" />

<br/>

<a href="https://youtu.be/jkp0S1r_nMM" target="_blank" rel="noreferrer">
  <img src="https://img.shields.io/badge/%E2%96%B6%20Watch%20Demo%20Video-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Watch Demo Video" />
</a>

<br/>

<sub>Quick product walkthrough for managers, founders, and technical recruiters.</sub>

</div>

---

<br/>

## 📑 Index

- [Screenshots](#-screenshots)
- [Highlights](#-highlights)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Architecture](#-architecture)
- [Features](#-features)
- [Pages & Routes](#-pages--routes)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Docker Commands](#-docker-commands)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

<br/>

## 🖼 Screenshots

<div align="center">

### Homepage Experience

<img src="./public/Home_page.png" alt="BugTracker homepage" width="100%" />

<br/>

### Dashboard — Track & Visualize Your Bugs

<img src="./public/AddOrganizationand MAnageFromYourDashBoard.png" alt="BugTracker dashboard with bug statistics and analytics" width="100%" />

Real-time overview with total bug count, weekly trends, status distribution, and priority breakdown. Quick team insights and recent activity timeline.

<br/>

### Issues Management — Full Control Over Your Bugs

<img src="./public/IssuesPage.png" alt="Issues page with advanced filtering and bulk operations" width="100%" />

Searchable issue table with multi-select filters, bulk status/priority updates, export to CSV/PDF, and inline editing. Assign, manage status, and track everything.

<br/>

### Organization Settings — Configuration & Preferences

<img src="./public/SettingsPage.png" alt="Settings page for organization management" width="100%" />

Manage organization details, API keys, notification preferences, and system-wide configurations. Full control over your organization's environment.

<br/>

### Team Management & Permissions — Member Administration

<img src="./public/TeamManagementAndPermissionsPage.png" alt="Team management page with role-based permissions" width="100%" />

Invite team members, assign roles (Admin/Developer/Viewer), manage permissions, and track team statistics. See member details and update permissions on the fly.

</div>

<br/>

## ⚡ Highlights

<table>
<tr>
<td width="50%">

**🔐 Full Authentication**
JWT + refresh tokens, OAuth (GitHub & Google), password reset, remember me

</td>
<td width="50%">

**📡 Real-Time Updates**
Socket.IO powered live notifications — bugs, comments, and team activity stream instantly

</td>
</tr>
<tr>
<td>

**🏢 Multi-Organization**
Create & switch between organizations, invite members, role-based permissions (Admin / Developer / Viewer)

</td>
<td>

**📊 Analytics Dashboard**
Status distribution, priority breakdown, assignee workload, recent activity timeline — all at a glance

</td>
</tr>
<tr>
<td>

**🔍 Advanced Filtering**
Multi-select status, priority, assignee, labels, date range — with **saveable filter presets**

</td>
<td>

**⚡ Bulk Operations**
Select multiple issues → batch update status, priority, or delete in one action

</td>
</tr>
<tr>
<td>

**📎 File Attachments**
Upload, download, and manage file attachments on any bug

</td>
<td>

**📤 Export**
One-click export to **CSV** or **PDF** for reporting and audits

</td>
</tr>
</table>

<br/>

## 🛠️ Tech Stack

<table>
<tr>
<th align="left" width="140">Layer</th>
<th align="left">Technologies</th>
</tr>
<tr>
<td><strong>Frontend</strong></td>
<td>
  <img src="https://img.shields.io/badge/Next.js_16-black?logo=next.js&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black&style=flat-square" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/shadcn/ui-000?logo=shadcnui&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/React_Query-FF4154?logo=react-query&logoColor=white&style=flat-square" />
</td>
</tr>
<tr>
<td><strong>Backend</strong></td>
<td>
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Express-000?logo=express&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Socket.IO-010101?logo=socket.io&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/JWT-000?logo=jsonwebtokens&logoColor=white&style=flat-square" />
</td>
</tr>
<tr>
<td><strong>Database</strong></td>
<td>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Prisma_ORM-2D3748?logo=prisma&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white&style=flat-square" />
</td>
</tr>
<tr>
<td><strong>DevOps</strong></td>
<td>
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Docker_Compose-2496ED?logo=docker&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=white&style=flat-square" />
</td>
</tr>
<tr>
<td><strong>Validation</strong></td>
<td>
  <img src="https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white&style=flat-square" />
</td>
</tr>
</table>

<br/>

## 🏗 Architecture

```
                         ┌─────────────────────────────────┐
                         │         Next.js Frontend         │
                         │        (Port 3000 / Vercel)      │
                         └──────┬──────────┬───────────┬────┘
                                │          │           │
                    ┌───────────▼──┐  ┌────▼─────┐  ┌──▼──────────────┐
                    │ Auth Service │  │Bug Service│  │Notification Svc │
                    │  (Port 5001) │  │(Port 5002)│  │  (Port 5003)    │
                    └──────┬───────┘  └─────┬─────┘  └────────┬────────┘
                           │                │                  │
                    ┌──────▼────────────────▼──────┐    ┌──────▼──────┐
                    │     PostgreSQL (Port 5432)    │    │    Redis    │
                    │        Prisma ORM             │    │ (Port 6379) │
                    └───────────────────────────────┘    └─────────────┘
```

| Service | Port | Responsibility |
|---------|------|---------------|
| **Auth Service** | `5001` | Registration, login, JWT + refresh tokens, OAuth (GitHub & Google), password reset |
| **Bug Service** | `5002` | Bug CRUD, search, labels, comments, attachments, exports, bulk operations, statistics |
| **Notification Service** | `5003` | Socket.IO WebSocket server — real-time broadcasts scoped per organization |

<br/>

## ✨ Features

### 🔐 Authentication & Security
| Feature | Description |
|---------|-------------|
| Email + Password | Register & login with validated credentials |
| OAuth | One-click sign in with **GitHub** or **Google** |
| JWT + Refresh Tokens | Automatic token refresh via Axios interceptors |
| Remember Me | Persistent sessions for returning users |
| Password Reset | "Forgot Password" flow with email reset link |
| Password Strength Meter | Visual 3-segment strength bar on signup |

### 🐛 Issue Management
| Feature | Description |
|---------|-------------|
| Full CRUD | Create, view, edit, and delete bugs with detailed modals |
| Status Workflow | `Open` → `In Progress` → `In Review` → `Closed` |
| Priority Levels | `Low` · `Medium` · `High` · `Critical` — color-coded throughout |
| Assignees | Assign bugs to team members with avatar display |
| Comments | Threaded comment system on each bug |
| File Attachments | Upload, download, and delete files per bug |
| Labels | Color-coded labels — create, edit, assign to bugs |
| Search | Instant search by title or bug ID |
| Advanced Filters | Multi-select status, priority, assignee, labels, date range |
| Saved Filters | Save & load custom filter presets |
| Bulk Operations | Select multiple → batch update status, priority, or delete |
| Export | Download issues as **CSV** or **PDF** |

### 📊 Dashboard & Analytics
| Feature | Description |
|---------|-------------|
| Overview Cards | Total bugs, new this week, closed this week, open bugs |
| Status Distribution | Animated progress bars — visual breakdown by status |
| Priority Breakdown | Card grid showing counts per priority level |
| Assignee Workload | Top 5 assignees ranked by bug count with avatars |
| Recent Activity | Timeline of latest bug actions — clickable links |

### 👥 Team Management
| Feature | Description |
|---------|-------------|
| Member Directory | Card grid with avatars, roles, join dates |
| Invite Members | Send invitations to join your organization |
| Role Management | Assign roles: **Admin** / **Developer** / **Viewer** |
| Remove Members | Remove users with confirmation prompt |
| Team Stats | Total members, admins, bugs resolved, issues assigned |

### 🏢 Organizations
| Feature | Description |
|---------|-------------|
| Multi-Org Support | Create and switch between organizations |
| Org Settings | Edit name, description, manage configuration |
| API Key Management | Create, copy, and delete API keys per org |
| Notification Preferences | Toggle email & real-time notification settings |

### 👤 User Profile
| Feature | Description |
|---------|-------------|
| Profile Editor | Edit first name, last name, email |
| Change Password | Current + new + confirm password flow |
| Member Since | Account creation date display |

### 📡 Real-Time
| Feature | Description |
|---------|-------------|
| Live Bug Updates | Instant toast + auto-refresh when bugs are created/updated/deleted |
| Live Comments | Comment threads update in real-time across all clients |
| Org-Scoped Broadcasts | Updates are scoped to your active organization |

<br/>

## 🗺 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing Page | Hero section, feature grid, CTA, footer |
| `/auth/login` | Login | Email/password + OAuth + remember me |
| `/auth/signup` | Signup | Registration with password strength meter |
| `/auth/forgot-password` | Forgot Password | Email-based password reset flow |
| `/auth/callback` | OAuth Callback | Handles GitHub/Google OAuth redirect |
| `/dashboard` | Dashboard | Stats cards, charts, priority breakdown, activity feed |
| `/dashboard/issues` | Issues | Table view, search, filters, bulk actions, CRUD modals |
| `/dashboard/team` | Team | Member cards, invite, role management |
| `/dashboard/labels` | Labels | Color-coded label CRUD |
| `/dashboard/settings` | Settings | Org settings, notifications, API keys |
| `/dashboard/profile` | Profile | Personal info editor, password change |

<br/>

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Required |
|------|---------|----------|
| Node.js | 18+ | ✅ |
| pnpm | Latest | ✅ (recommended) |
| Docker & Docker Compose | Latest | ✅ |
| PostgreSQL | 16+ | ✅ (or via Docker) |
| Redis | 7.2+ | ✅ (or via Docker) |

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Git-brintsi20/Bug-tracker-SaaS.git
cd Bug-tracker-SaaS

# 2. Install frontend dependencies
pnpm install

# 3. Set up environment variables (see below)

# 4. Start all services with Docker
docker-compose up -d

# 5. Run database migrations
npx prisma generate
npx prisma migrate deploy

# 6. Start the frontend
pnpm dev
```

Open **http://localhost:3000** and you're all set! 🎉

### Environment Variables

<details>
<summary><b>📋 Click to expand — All .env configurations</b></summary>

<br/>

**`services/auth-service/.env`**
```env
PORT=5001
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/bugtracker"
JWT_SECRET=your-jwt-secret-here
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**`services/bug-service/.env`**
```env
PORT=5002
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/bugtracker"
REDIS_URL=redis://redis:6379
JWT_SECRET=your-jwt-secret-here
```

**`services/notification-service/.env`**
```env
PORT=5003
REDIS_URL=redis://redis:6379
JWT_SECRET=your-jwt-secret-here
```

**Root `.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_BUG_API_URL=http://localhost:5002/api
NEXT_PUBLIC_WS_URL=http://localhost:5003
```

</details>

### Running Without Docker

<details>
<summary><b>📋 Click to expand — Manual setup</b></summary>

<br/>

1. Start PostgreSQL and Redis manually
2. Update `.env` files to use `localhost`:
   - `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bugtracker"`
   - `REDIS_URL=redis://localhost:6379`
3. Start each service in separate terminals:

```bash
# Terminal 1 — Auth Service
cd services/auth-service && npm install && npm run dev

# Terminal 2 — Bug Service
cd services/bug-service && npm install && npm run dev

# Terminal 3 — Notification Service
cd services/notification-service && npm install && npm run dev

# Terminal 4 — Frontend
pnpm dev
```

</details>

### OAuth Setup

<details>
<summary><b>🔑 GitHub OAuth</b></summary>

1. Go to **GitHub Settings** → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set callback URL: `http://localhost:5001/api/auth/github/callback`
4. Copy Client ID & Secret to `services/auth-service/.env`

</details>

<details>
<summary><b>🔑 Google OAuth</b></summary>

1. Go to **Google Cloud Console** → APIs & Services → Credentials
2. Create OAuth 2.0 credentials
3. Set redirect URI: `http://localhost:5001/api/auth/google/callback`
4. Copy Client ID & Secret to `services/auth-service/.env`

</details>

<br/>

## 📝 API Reference

<details>
<summary><b>🔐 Auth Service — Port 5001</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User login → JWT + refresh token |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/auth/logout` | Invalidate session |
| `GET` | `/api/auth/me` | Get current user |
| `GET` | `/api/auth/github` | Initiate GitHub OAuth |
| `GET` | `/api/auth/google` | Initiate Google OAuth |

</details>

<details>
<summary><b>🐛 Bug Service — Port 5002</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/bugs` | List all bugs (with filters) |
| `POST` | `/api/bugs` | Create a bug |
| `GET` | `/api/bugs/:id` | Get bug details |
| `PUT` | `/api/bugs/:id` | Update a bug |
| `DELETE` | `/api/bugs/:id` | Delete a bug |
| `GET` | `/api/bugs/search` | Search bugs |
| `GET` | `/api/bugs/statistics` | Bug statistics per org |
| `POST` | `/api/bugs/:id/comments` | Add comment |
| `DELETE` | `/api/bugs/:id/comments/:cid` | Delete comment |
| `POST` | `/api/bugs/:id/attachments` | Upload attachment |
| `GET` | `/api/bugs/:id/attachments/:aid` | Download attachment |
| `DELETE` | `/api/bugs/:id/attachments/:aid` | Delete attachment |
| `POST` | `/api/bugs/bulk/status` | Bulk update status |
| `POST` | `/api/bugs/bulk/priority` | Bulk update priority |
| `POST` | `/api/bugs/bulk/delete` | Bulk delete |
| `GET` | `/api/bugs/export/csv` | Export as CSV |
| `GET` | `/api/bugs/export/pdf` | Export as PDF |

**Labels & Organizations** — see full API in codebase at `lib/api.ts`

</details>

<details>
<summary><b>📡 Notification Service — Port 5003</b></summary>

WebSocket events (Socket.IO):

| Event | Direction | Description |
|-------|-----------|-------------|
| `bug:created` | Server → Client | New bug created in org |
| `bug:updated` | Server → Client | Bug was modified |
| `bug:deleted` | Server → Client | Bug was deleted |
| `comment:added` | Server → Client | New comment on a bug |
| `comment:deleted` | Server → Client | Comment removed |

</details>

<br/>

## 📁 Project Structure

```
Bug-tracker-SaaS/
│
├── 📂 app/                          # Next.js App Router
│   ├── 📂 auth/                     # Authentication pages
│   │   ├── login/                   #   Login form + OAuth
│   │   ├── signup/                  #   Registration + strength meter
│   │   ├── forgot-password/         #   Password reset request
│   │   └── callback/               #   OAuth redirect handler
│   │
│   ├── 📂 dashboard/               # Protected routes
│   │   ├── issues/                  #   Issue management
│   │   ├── team/                    #   Team member management
│   │   ├── labels/                  #   Label CRUD
│   │   ├── settings/                #   Org settings & API keys
│   │   └── profile/                 #   User profile & password
│   │
│   ├── layout.tsx                   # Root layout + providers
│   ├── page.tsx                     # Landing page
│   └── globals.css                  # Global styles
│
├── 📂 components/                   # React components
│   ├── 📂 auth/                     #   Auth cards & forms
│   ├── 📂 ui/                       #   shadcn/ui library (50+ components)
│   ├── bug-detail-modal.tsx         #   Bug detail with tabs
│   ├── create-bug-modal.tsx         #   New bug form
│   ├── edit-bug-modal.tsx           #   Edit bug form
│   ├── issue-table.tsx              #   Issues data table
│   ├── advanced-filters.tsx         #   Filter modal with save/load
│   ├── sidebar.tsx                  #   Dashboard navigation
│   ├── navbar.tsx                   #   Landing page navbar
│   └── ...                          #   Other components
│
├── 📂 hooks/                        # Custom React hooks
│   ├── useSocket.ts                 #   Socket.IO connection
│   └── use-toast.ts                 #   Toast notifications
│
├── 📂 lib/                          # Utilities
│   ├── api.ts                       #   Axios client + all API calls
│   └── utils.ts                     #   Helper functions
│
├── 📂 services/                     # Backend microservices
│   ├── auth-service/                #   JWT auth + OAuth
│   ├── bug-service/                 #   Bug management + Redis cache
│   └── notification-service/        #   Socket.IO real-time
│
├── 📂 prisma/                       # Database
│   ├── schema.prisma                #   Data model
│   └── migrations/                  #   Migration history
│
├── docker-compose.yml               # Full stack orchestration
├── package.json                     # Frontend dependencies
└── tsconfig.json                    # TypeScript config
```

<br/>

## 🐳 Docker Commands

```bash
docker-compose up -d              # Start everything
docker-compose up -d --build      # Rebuild & start
docker-compose logs -f [service]  # Tail logs
docker-compose down               # Stop all
docker-compose down -v            # Stop + wipe volumes
```

<br/>

## 🛣 Roadmap

### ✅ Completed
- [x] JWT authentication with refresh tokens
- [x] OAuth (GitHub + Google)
- [x] Full bug CRUD with detail modals
- [x] Real-time updates via Socket.IO
- [x] Multi-organization support
- [x] Team management with roles
- [x] Advanced filtering with saved presets
- [x] Bulk operations (status, priority, delete)
- [x] Comments & attachments
- [x] Labels system
- [x] CSV & PDF export
- [x] Dashboard analytics
- [x] Responsive design

### 🔄 In Progress
- [ ] Production deployment (Vercel + Railway)
- [ ] Email notification system (SMTP)
- [ ] Kanban board view (components ready)

### 📋 Planned
- [ ] Two-factor authentication (2FA)
- [ ] API rate limiting
- [ ] Automated test suite
- [ ] Activity audit log
- [ ] Webhook integrations
- [ ] Dark/Light theme toggle

<br/>

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

```bash
# 1. Fork the repo
# 2. Create your branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m "feat: add amazing feature"

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

<br/>

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<br/>

## 📬 Contact

<div align="center">

**Built with ❤️ by [@Git-brintsi20](https://github.com/Git-brintsi20)**

[![GitHub](https://img.shields.io/badge/GitHub-@Git--brintsi20-181717?style=for-the-badge&logo=github)](https://github.com/Git-brintsi20)
[![Repository](https://img.shields.io/badge/Repo-Bug--tracker--SaaS-blue?style=for-the-badge&logo=github)](https://github.com/Git-brintsi20/Bug-tracker-SaaS)

</div>

---

<div align="center">
<sub>⭐ Star this repo if you find it helpful!</sub>
</div>
