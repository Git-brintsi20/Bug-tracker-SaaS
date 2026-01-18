# Bug Tracker SaaS - Quick Start Guide

## 🚀 Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 18.x
- **PostgreSQL** >= 14.x running on port 5433
- **Redis** >= 7.x running on port 6379
- **npm** or **pnpm** package manager

## 📦 Initial Setup

### 1. Clone & Install Dependencies

```bash
# Install frontend dependencies
npm install
# or
pnpm install

# Install service dependencies
cd services/auth-service && npm install && cd ../..
cd services/bug-service && npm install && cd ../..
cd services/notification-service && npm install && cd ../..
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb -p 5433 -U postgres bugtracker

# Run Prisma migrations for each service
cd services/auth-service
npx prisma migrate dev
npx prisma generate

cd ../bug-service
npx prisma migrate dev
npx prisma generate

cd ../..
```

### 3. Environment Configuration

The `.env` files are already configured for local development. Update if needed:

- `services/auth-service/.env` - Auth service configuration
- `services/bug-service/.env` - Bug service configuration  
- `services/notification-service/.env` - Notification service configuration
- `.env.local` - Frontend configuration

**Important:** Change JWT_SECRET values before deploying to production!

## 🏃 Running the Application

### Option 1: Manual Start (Recommended for Development)

Open 4 separate terminals:

**Terminal 1 - Auth Service:**
```bash
cd services/auth-service
npm run dev
```

**Terminal 2 - Bug Service:**
```bash
cd services/bug-service
npm run dev
```

**Terminal 3 - Notification Service:**
```bash
cd services/notification-service
npm run dev
```

**Terminal 4 - Frontend:**
```bash
npm run dev
```

### Option 2: Docker (Coming Soon)

```bash
docker-compose up
```

## ✅ Verify Setup

1. **Auth Service**: http://localhost:5001/health
2. **Bug Service**: http://localhost:5002/health
3. **Notification Service**: http://localhost:5003/health
4. **Frontend**: http://localhost:3000

## 🎯 First Steps

1. Navigate to http://localhost:3000
2. Click "Sign Up" to create an account
3. Create your first organization
4. Start tracking bugs!

## 🐛 Troubleshooting

### Dashboard Not Loading?

- Ensure all services are running
- Check PostgreSQL is running on port 5433
- Verify `.env.local` has correct API URLs
- Check browser console for errors

### "Cannot connect to database"?

- Verify PostgreSQL is running: `pg_isready -p 5433`
- Check DATABASE_URL in service .env files
- Run migrations: `npx prisma migrate dev`

### Redis connection errors?

- Verify Redis is running: `redis-cli ping`
- Check REDIS_URL in bug-service/.env

### CORS errors?

- Ensure CORS_ORIGIN matches your frontend URL
- Check all services have correct CORS_ORIGIN in .env

## 📝 Default Credentials

For testing, you can create an account through the signup page.

## 🔗 Useful Commands

```bash
# Reset database
cd services/auth-service && npx prisma migrate reset
cd services/bug-service && npx prisma migrate reset

# View database
cd services/auth-service && npx prisma studio

# Check logs
npm run dev # in respective service directories

# Build for production
npm run build
```

## 🆘 Need Help?

- Check the full README.md for detailed documentation
- Review the [API Documentation](#) section
- Open an issue on GitHub
