# Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 20+
- PostgreSQL 15+
- Redis
- SMTP Server (for emails)
- OAuth credentials (GitHub/Google)

## Quick Start - Local Development

1. **Clone the repository**
```bash
git clone https://github.com/Git-brintsi20/Bug-tracker-SaaS.git
cd Bug-tracker-SaaS
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Start database services**
```bash
docker-compose up -d postgres redis
```

5. **Run database migrations**
```bash
cd prisma
npm install
npx prisma migrate deploy
npx prisma generate
cd ..
```

6. **Start development servers**
```bash
pnpm dev  # Frontend on http://localhost:3000
cd services/auth-service && npm run dev  # Auth on http://localhost:3001
cd services/bug-service && npm run dev   # Bug on http://localhost:3002
```

## Production Deployment

### Option 1: Docker Compose (Recommended)

1. **Configure environment**
```bash
cp .env.example .env
# Edit .env with production values
```

2. **Start all services**
```bash
docker-compose up -d
```

3. **Run migrations**
```bash
docker-compose exec bug-service npx prisma migrate deploy
```

4. **Check service health**
```bash
docker-compose ps
docker-compose logs -f
```

### Option 2: Kubernetes

See `k8s/README.md` for Kubernetes deployment guide.

### Option 3: Manual Deployment

1. **Build services**
```bash
# Frontend
pnpm build

# Bug Service
cd services/bug-service
npm run build

# Auth Service
cd services/auth-service
npm run build
```

2. **Set environment variables**
```bash
export DATABASE_URL="postgresql://user:pass@host:5432/bugtracker"
export REDIS_URL="redis://host:6379"
export JWT_SECRET="your-secret-key"
export NEXT_PUBLIC_API_URL="https://api.yourdomain.com"
```

3. **Start services**
```bash
# Frontend (Next.js)
pnpm start

# Bug Service
cd services/bug-service && npm start

# Auth Service
cd services/auth-service && npm start
```

## Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3002
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend Services (.env)
```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/bugtracker
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@bugtracker.com

# Application
NODE_ENV=production
PORT=3001  # auth-service
PORT=3002  # bug-service
FRONTEND_URL=https://yourdomain.com
```

## CI/CD Pipeline

### GitHub Actions Workflows

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Runs on every push/PR
   - Tests frontend and backend
   - Lints code
   - Builds Docker images
   - Runs security scans
   - Validates database schema

2. **Deployment Pipeline** (`.github/workflows/deploy.yml`)
   - Triggered manually or on main branch
   - Builds production Docker images
   - Pushes to GitHub Container Registry
   - Deploys to production server

### Required GitHub Secrets

Add these in Repository Settings → Secrets:

```bash
DEPLOY_HOST=your.server.ip
DEPLOY_USER=deployment_user
DEPLOY_SSH_KEY=<your-private-ssh-key>
GITHUB_TOKEN=<auto-provided>
```

## Database Migrations

### Create a new migration
```bash
cd prisma
npx prisma migrate dev --name your_migration_name
```

### Apply migrations to production
```bash
npx prisma migrate deploy
```

### Reset database (CAUTION: Deletes all data)
```bash
npx prisma migrate reset
```

## Monitoring and Logs

### Docker Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f bug-service
docker-compose logs -f auth-service
docker-compose logs -f frontend
```

### Health Checks
- Frontend: http://localhost:3000/api/health
- Auth Service: http://localhost:3001/health
- Bug Service: http://localhost:3002/health

## Testing

### Run all tests
```bash
# Frontend tests
pnpm test

# Backend tests
cd services/bug-service && npm test
cd services/auth-service && npm test
```

### Run tests with coverage
```bash
cd services/bug-service
npm run test:coverage
```

### Run E2E tests
```bash
# Install Playwright
pnpm add -D @playwright/test

# Run E2E tests
pnpm playwright test
```

## Performance Optimization

### Frontend
- Static generation for public pages
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Redis caching for API responses

### Backend
- Database indexing on frequently queried fields
- Redis caching for expensive queries
- Connection pooling for PostgreSQL
- Rate limiting on API endpoints

## Security

### HTTPS Setup
1. Obtain SSL certificates (Let's Encrypt recommended)
2. Configure reverse proxy (Nginx/Caddy)
3. Update environment URLs to use https://

### Database Security
- Use strong passwords
- Enable SSL for database connections
- Regular backups
- Limit network access

### API Security
- JWT authentication
- Rate limiting
- CORS configuration
- Input validation
- SQL injection prevention (Prisma)

## Troubleshooting

### Database connection issues
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# View database logs
docker-compose logs postgres

# Test connection
psql $DATABASE_URL
```

### Redis connection issues
```bash
# Check Redis is running
docker-compose ps redis

# Test connection
redis-cli -u $REDIS_URL ping
```

### Build failures
```bash
# Clear build cache
pnpm clean
rm -rf .next
rm -rf node_modules
pnpm install

# Rebuild
pnpm build
```

## Scaling

### Horizontal Scaling
- Run multiple instances of backend services
- Use load balancer (Nginx/HAProxy)
- Shared Redis for sessions
- PostgreSQL read replicas

### Vertical Scaling
- Increase container resources
- Optimize database queries
- Add database indexes
- Implement caching strategy

## Backup and Recovery

### Database Backup
```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres bugtracker > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres bugtracker < backup.sql
```

### File Backup
```bash
# Backup uploaded files
tar -czf files-backup.tar.gz ./uploads

# Restore files
tar -xzf files-backup.tar.gz -C ./
```

## Support

For issues and questions:
- GitHub Issues: https://github.com/Git-brintsi20/Bug-tracker-SaaS/issues
- Documentation: See README.md
