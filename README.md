# Bug Tracker SaaS

A modern bug tracking and project management platform built with Next.js and microservices architecture.

## 🎯 Project Overview

This is a learning-focused bug tracking application featuring a microservices backend and Next.js frontend. The project demonstrates modern web development practices including:

- **Microservices Architecture**: Separate services for authentication, bug management, and notifications
- **Real-time Updates**: WebSocket integration for live notifications
- **Modern Frontend**: Next.js 14 with App Router and TypeScript
- **Caching Layer**: Redis for improved performance
- **Containerization**: Docker setup for development and deployment

## 🛠️ Tech Stack

### Frontend
- **Next.js** 14 with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Hook Form** & **Zod** for form handling

### Backend Services
- **Node.js** & **Express.js** for API services
- **Socket.io** for WebSocket communication
- **PostgreSQL** with **Prisma ORM**
- **Redis** for caching and session management
- **JWT** authentication with OAuth support (GitHub, Google)

### DevOps
- **Docker** & **Docker Compose** for containerization
- Microservices: Auth Service (5001), Bug Service (5002), Notification Service (5003)

## ✨ Current Features

### Authentication
- JWT-based authentication system
- OAuth integration prepared for GitHub and Google (requires configuration)
- User registration and login
- Password hashing with bcrypt

### Bug Management
- Create, read, update, and delete bugs
- Bug status tracking (Open, In Progress, Resolved, Closed)
- Priority levels (Low, Medium, High, Critical)
- Bug assignment to team members
- Comments on bugs
- File attachments support
- Labels and tags

### Real-time Features
- WebSocket integration with Socket.io
- Live notifications for bug updates
- Real-time activity feeds

### Performance
- Redis caching layer for frequently accessed data
- Optimized database queries with Prisma
- Session management

### UI/UX
- Modern, responsive design with Tailwind CSS
- Component library using shadcn/ui
- Dark mode support (theme provider configured)
- Form validation with React Hook Form and Zod

## 🏗️ Architecture

The application follows a microservices architecture:

```
Frontend (Next.js)  ←→  Auth Service (5001)
                    ←→  Bug Service (5002)
                    ←→  Notification Service (5003)
                           ↓
                    PostgreSQL + Redis
```

### Services
- **Auth Service**: Handles user authentication, registration, and OAuth
- **Bug Service**: Manages bug CRUD operations, caching, and data persistence
- **Notification Service**: WebSocket server for real-time updates

## 📁 Project Structure

```
NewBugTracker/
├── app/                             # Next.js App Router
│   ├── auth/                        # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── dashboard/                   # Protected dashboard routes
│   │   ├── issues/
│   │   ├── profile/
│   │   ├── settings/
│   │   └── team/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/                      # React components
│   ├── ui/                          # shadcn/ui components
│   ├── auth/                        # Auth-related components
│   ├── bug-detail-modal.tsx
│   ├── issue-table.tsx
│   ├── kanban-card.tsx
│   ├── navbar.tsx
│   ├── sidebar.tsx
│   └── theme-provider.tsx
│
├── services/                        # Backend microservices
│   ├── auth-service/                # Authentication Service (Port 5001)
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   ├── utils/
│   │   │   └── server.js
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── bug-service/                 # Bug Management Service (Port 5002)
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   ├── utils/
│   │   │   └── server.js
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── notification-service/        # WebSocket Service (Port 5003)
│       ├── src/
│       │   ├── socket/
│       │   └── server.js
│       ├── Dockerfile
│       └── package.json
│
├── prisma/                          # Database schema and migrations
│   ├── schema.prisma
│   └── migrations/
│
├── lib/                             # Utility functions
├── hooks/                           # Custom React hooks
├── docker-compose.yml               # Docker orchestration
├── Dockerfile.auth-service          # Auth service Docker config
├── Dockerfile.bug-service           # Bug service Docker config
├── Dockerfile.client                # Frontend Docker config
└── package.json                     # Frontend dependencies
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **pnpm** (recommended) or npm
- **Docker** and **Docker Compose**
- **PostgreSQL** 16+ (or use Docker)
- **Redis** 7.2+ (or use Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Git-brintsi20/Bug-tracker-SaaS.git
   cd NewBugTracker
   ```

2. **Install frontend dependencies**
   ```bash
   pnpm install
   ```

3. **Install backend dependencies**
   ```bash
   cd services/auth-service && npm install && cd ../..
   cd services/bug-service && npm install && cd ../..
   cd services/notification-service && npm install && cd ../..
   ```

4. **Configure environment variables**

   Create `.env` files in each service directory with the required variables:

   **services/auth-service/.env:**
   ```env
   PORT=5001
   DATABASE_URL="postgresql://postgres:postgres@postgres:5432/bugtracker"
   JWT_SECRET=your-jwt-secret-here
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

   **services/bug-service/.env:**
   ```env
   PORT=5002
   DATABASE_URL="postgresql://postgres:postgres@postgres:5432/bugtracker"
   REDIS_URL=redis://redis:6379
   JWT_SECRET=your-jwt-secret-here
   ```

   **services/notification-service/.env:**
   ```env
   PORT=5003
   REDIS_URL=redis://redis:6379
   JWT_SECRET=your-jwt-secret-here
   ```

   **Root .env.local:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   NEXT_PUBLIC_BUG_API_URL=http://localhost:5002/api
   NEXT_PUBLIC_WS_URL=http://localhost:5003
   ```

5. **Start services with Docker**
   ```bash
   # Start database services
   docker-compose up -d postgres redis
   
   # Wait for databases to be ready, then run migrations
   npx prisma generate
   npx prisma migrate deploy
   
   # Start backend services
   docker-compose up -d auth-service bug-service notification-service
   
   # Or start all services at once
   docker-compose up -d
   ```

6. **Start the frontend** (in a separate terminal)
   ```bash
   pnpm dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Auth Service: http://localhost:5001
   - Bug Service: http://localhost:5002
   - Notification Service: http://localhost:5003

### Development Without Docker

If you prefer to run services without Docker:

1. Start PostgreSQL and Redis manually
2. Update `.env` files to use `localhost` instead of Docker service names:
   - `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bugtracker"`
   - `REDIS_URL=redis://localhost:6379`
3. Start each service manually:
   ```bash
   # Terminal 1 - Auth Service
   cd services/auth-service && npm run dev
   
   # Terminal 2 - Bug Service
   cd services/bug-service && npm run dev
   
   # Terminal 3 - Notification Service
   cd services/notification-service && npm run dev
   
   # Terminal 4 - Frontend
   pnpm dev
   ```

## 🔧 Configuration

### OAuth Setup

To enable GitHub and Google OAuth login:

1. **GitHub OAuth:**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set callback URL to: `http://localhost:5001/api/auth/github/callback`
   - Copy Client ID and Secret to `services/auth-service/.env`

2. **Google OAuth:**
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Set authorized redirect URI to: `http://localhost:5001/api/auth/google/callback`
   - Copy Client ID and Secret to `services/auth-service/.env`

### SMTP Setup (Email Notifications)

Update `services/auth-service/.env` with your email provider:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 📝 API Endpoints

### Auth Service (Port 5001)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/github` - GitHub OAuth
- `GET /api/auth/google` - Google OAuth
- `POST /api/auth/logout` - User logout

### Bug Service (Port 5002)
- `GET /api/bugs` - List all bugs
- `POST /api/bugs` - Create a bug
- `GET /api/bugs/:id` - Get bug details
- `PUT /api/bugs/:id` - Update a bug
- `DELETE /api/bugs/:id` - Delete a bug
- `POST /api/bugs/:id/comments` - Add comment
- `POST /api/bugs/:id/attachments` - Upload attachment

### Notification Service (Port 5003)
- WebSocket connection for real-time updates
- Events: `bug:created`, `bug:updated`, `bug:deleted`, `comment:added`

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# Remove volumes (clean database)
docker-compose down -v
```

## 🛣️ Roadmap

### In Progress
- [ ] Frontend deployment to Vercel
- [ ] Backend deployment to Railway/Render
- [ ] Complete OAuth integration testing
- [ ] Email notification system

### Planned Features
- [ ] Team collaboration features
- [ ] Advanced search and filtering
- [ ] Bug analytics dashboard
- [ ] Export to PDF/CSV
- [ ] Email notifications for bug updates
- [ ] Role-based access control (RBAC)
- [ ] Two-factor authentication (2FA)
- [ ] API rate limiting
- [ ] Automated testing suite

## 🤝 Contributing

Contributions are welcome! This is a learning project, and feedback is appreciated.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📧 Contact

For questions or feedback:
- GitHub: [@Git-brintsi20](https://github.com/Git-brintsi20)
- Repository: [Bug-tracker-SaaS](https://github.com/Git-brintsi20/Bug-tracker-SaaS)

---

**Note**: This is an educational project built to demonstrate microservices architecture, real-time communication, and modern web development practices. It's actively being developed and improved.
