# Bug Tracker SaaS - Setup & Troubleshooting Guide

## ✅ Critical Fixes Applied

### 1. Dashboard Loading Issue - FIXED ✅
**Problem:** Dashboard showed "GET /undefined/users/me/organizations 404"  
**Root Cause:** Missing `.env.local` file with API URLs  
**Solution:**  
```bash
# Create .env.local from template
cp .env.example .env.local

# OR copy this content to .env.local:
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_BUG_SERVICE_URL=http://localhost:5002/api
NEXT_PUBLIC_NOTIFICATION_SERVICE_URL=http://localhost:5003
NEXT_PUBLIC_SOCKET_URL=http://localhost:5003
```

### 2. Bulk Operations Syntax Error - FIXED ✅
**Problem:** Stray `const` statement in issues-page-content.tsx  
**Solution:** Removed duplicate const declaration on line 236

### 3. Missing Startup Scripts - FIXED ✅  
**Problem:** No easy way to start all services  
**Solution:** Created `start-dev.ps1` and `start-all.ps1`

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites Check

Before starting, verify you have:

```powershell
# Check Node.js (need v18+)
node --version  # Should show v18.x or higher

# Check npm
npm --version

# Check if ports are free
Test-NetConnection localhost -Port 3000  # Should fail (port free)
Test-NetConnection localhost -Port 5001  # Should fail (port free)
Test-NetConnection localhost -Port 5002  # Should fail (port free)
Test-NetConnection localhost -Port 5003  # Should fail (port free)
```

### Step 1: Clone & Install

```powershell
# Install frontend dependencies
npm install

# Install microservice dependencies (do this once)
cd services/auth-service
npm install
cd ../..

cd services/bug-service
npm install
cd ../..

cd services/notification-service
npm install
cd ../..
```

### Step 2: Environment Configuration

```powershell
# Create .env.local for frontend
cp .env.example .env.local

# Verify the file exists
cat .env.local
```

The `.env.local` file MUST contain:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_BUG_SERVICE_URL=http://localhost:5002/api
NEXT_PUBLIC_NOTIFICATION_SERVICE_URL=http://localhost:5003
NEXT_PUBLIC_SOCKET_URL=http://localhost:5003
```

### Step 3: Start Services

```powershell
# Option 1: Use the startup script (recommended)
.\start-dev.ps1

# Option 2: Manual start (4 terminals)
# Terminal 1
cd services/auth-service
npm run dev

# Terminal 2
cd services/bug-service
npm run dev

# Terminal 3
cd services/notification-service
npm run dev

# Terminal 4
npm run dev
```

### Step 4: Verify

Open http://localhost:3000 in your browser. You should see the login page.

---

## 🐛 Troubleshooting Common Issues

### Issue: "Dashboard not loading" or "Spinner forever"

**Symptoms:**
- Dashboard shows loading spinner indefinitely
- Browser console shows "GET /undefined/users/me/organizations 404"
- Organization dropdown is empty

**Solutions:**

1. **Check .env.local exists:**
```powershell
Test-Path .env.local  # Should return True
```

2. **Verify API URLs are correct:**
```powershell
cat .env.local | Select-String "NEXT_PUBLIC_API_URL"
# Should show: NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

3. **Restart the dev server:**
```powershell
# Kill all node processes
Stop-Process -Name "node" -Force

# Restart using start-dev.ps1
.\start-dev.ps1
```

4. **Clear browser cache and localStorage:**
```javascript
// In browser console (F12)
localStorage.clear()
location.reload()
```

### Issue: "Cannot connect to auth service"

**Symptoms:**
- Login fails with connection error
- Network tab shows "Failed to fetch"

**Solutions:**

1. **Check auth service is running:**
```powershell
Test-NetConnection localhost -Port 5001
# TcpTestSucceeded should be True
```

2. **Check auth service logs:**
Look at the Auth Service terminal window for errors

3. **Verify database connection:**
```powershell
cd services/auth-service
npx prisma studio  # Opens Prisma Studio
```

### Issue: "PostgreSQL connection failed"

**Symptoms:**
- Services fail to start
- Error: "Can't reach database server"

**Solutions:**

1. **Check PostgreSQL is running:**
```powershell
Test-NetConnection localhost -Port 5433
```

2. **Start PostgreSQL:**
```powershell
# If using Docker
docker start postgres-container

# If using Windows service
Start-Service postgresql-x64-14
```

3. **Verify DATABASE_URL:**
```powershell
cd services/auth-service
cat .env | Select-String "DATABASE_URL"
```

4. **Run migrations:**
```powershell
cd services/auth-service
npx prisma migrate dev

cd ../bug-service
npx prisma migrate dev
```

### Issue: "Redis connection failed"

**Symptoms:**
- Bug service logs show Redis connection errors
- Caching doesn't work

**Solutions:**

1. **Redis is optional for development.** The app will work without it (just slower).

2. **To enable Redis caching:**
```powershell
# Start Redis using Docker
docker run -d -p 6379:6379 redis:alpine

# Or install Redis on Windows
# https://github.com/microsoftarchive/redis/releases
```

3. **Verify Redis:**
```powershell
Test-NetConnection localhost -Port 6379
```

### Issue: "Port already in use"

**Symptoms:**
- Error: "EADDRINUSE: address already in use :::3000"
- Service won't start

**Solutions:**

1. **Find and kill process using the port:**
```powershell
# Find process on port 3000
Get-NetTCPConnection -LocalPort 3000 -State Listen | Select-Object OwningProcess
# Note the PID

# Kill it
Stop-Process -Id <PID> -Force
```

2. **Or kill all node processes:**
```powershell
Stop-Process -Name "node" -Force
```

### Issue: "Bulk operations not working"

**Symptoms:**
- Can't select multiple issues
- Bulk toolbar doesn't appear

**Solution:**

This was fixed in the latest update. Pull latest changes:
```powershell
git pull origin main
npm install
```

### Issue: "Export button doesn't work"

**Symptoms:**
- Clicking Export does nothing
- No file downloads

**Solutions:**

1. **Ensure bug service is running:**
```powershell
Test-NetConnection localhost -Port 5002
```

2. **Check browser console for errors**

3. **This feature requires backend implementation** - ensure you're running the latest services:
```powershell
cd services/bug-service
git pull
npm install
npm run dev
```

---

## 📝 Environment Variables Reference

### Frontend (.env.local)
```env
# REQUIRED - Backend API endpoints
NEXT_PUBLIC_API_URL=http://localhost:5001/api        # Auth service
NEXT_PUBLIC_BUG_SERVICE_URL=http://localhost:5002/api  # Bug service
NEXT_PUBLIC_NOTIFICATION_SERVICE_URL=http://localhost:5003
NEXT_PUBLIC_SOCKET_URL=http://localhost:5003

# OPTIONAL - OAuth (for GitHub/Google login)
NEXT_PUBLIC_GITHUB_CLIENT_ID=...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...

# App config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Auth Service (.env)
```env
PORT=5001
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/bugtracker?schema=public"
JWT_SECRET=dev-jwt-secret-change-in-production-12345
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production-67890
CORS_ORIGIN=http://localhost:3000
```

### Bug Service (.env)
```env
PORT=5002
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/bugtracker?schema=public"
REDIS_URL=redis://localhost:6379  # Optional
JWT_SECRET=dev-jwt-secret-change-in-production-12345
CORS_ORIGIN=http://localhost:3000
```

### Notification Service (.env)
```env
PORT=5003
JWT_SECRET=dev-jwt-secret-change-in-production-12345
CORS_ORIGIN=http://localhost:3000
```

---

## 🧪 Verification Checklist

After setup, verify everything works:

- [ ] Frontend loads at http://localhost:3000
- [ ] Can create account (signup page works)
- [ ] Can login with created account
- [ ] Dashboard shows organization dropdown
- [ ] Can create a new organization
- [ ] Can create a bug/issue
- [ ] Can view bug details
- [ ] Can add comments to bugs
- [ ] Can upload attachments
- [ ] Bulk operations work (select multiple issues)
- [ ] Export to CSV/PDF works
- [ ] Labels page accessible
- [ ] Team page shows members
- [ ] Settings page loads
- [ ] Profile page shows user info

---

## 🆘 Still Having Issues?

1. **Clear everything and restart:**
```powershell
# Kill all node processes
Stop-Process -Name "node" -Force

# Clear browser
# F12 -> Application -> Clear storage -> Clear site data

# Restart services
.\start-dev.ps1
```

2. **Check service health endpoints:**
```powershell
# These should return 200 OK
curl http://localhost:5001/health
curl http://localhost:5002/health  
curl http://localhost:5003/health
```

3. **Enable verbose logging:**
```powershell
$env:DEBUG="*"
npm run dev
```

4. **Check the README.md** for detailed feature documentation

5. **Review the QUICKSTART.md** for setup instructions

---

## 📊 Service Port Reference

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| Frontend | 3000 | http://localhost:3000 | Next.js web app |
| Auth Service | 5001 | http://localhost:5001 | Authentication, JWT |
| Bug Service | 5002 | http://localhost:5002 | Bug CRUD, caching |
| Notification | 5003 | http://localhost:5003 | WebSocket, real-time |
| PostgreSQL | 5433 | localhost:5433 | Database |
| Redis | 6379 | localhost:6379 | Cache (optional) |

---

## 🎯 Next Steps After Setup

1. Read the API documentation in README.md
2. Explore the database schema with `npx prisma studio`
3. Check out the architecture diagrams
4. Review the contributing guidelines
5. Start building features!

---

**Last Updated:** January 2026  
**Version:** 1.0.0  
**Status:** All critical issues resolved ✅
