# 🚀 Production Deployment Guide

## Production URLs

Based on your deployment setup:

- **Frontend (Vercel)**: `https://bug-tracker-saas.vercel.app`
- **Auth Service (Render)**: `https://bug-tracker-saas.onrender.com`
- **Bug Service (Render)**: `https://bugtracker-bug-service.onrender.com`
- **Notification Service (Render)**: `https://bugtracker-notification-service.onrender.com`

---

## 1. GitHub OAuth - Production Setup

### Create Production OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App" (create a SEPARATE app for production)
3. Fill in:
   - **Application name**: `BugTracker Production`
   - **Homepage URL**: `https://bug-tracker-saas.vercel.app`
   - **Authorization callback URL**: `https://bug-tracker-saas.onrender.com/api/auth/github/callback`
4. Click "Register application"
5. Copy **Client ID** and generate **Client Secret**

### Production Settings
```
Homepage URL: https://bug-tracker-saas.vercel.app
Authorization callback URL: https://bug-tracker-saas.onrender.com/api/auth/github/callback
```

**⚠️ Important**: The callback goes to your **BACKEND** URL (Render), not frontend (Vercel)!

---

## 2. Google OAuth - Production Setup

### Create Production OAuth Credentials

1. Go to https://console.cloud.google.com/
2. Select your project or create a new one for production
3. Go to "APIs & Services" → "Credentials"
4. Click "+ Create Credentials" → "OAuth client ID"
5. If needed, configure OAuth consent screen first:
   - App name: `BugTracker`
   - Authorized domains: Add `vercel.app` and `onrender.com`
6. Create "Web application" credentials:
   - **Name**: `BugTracker Production`
   - **Authorized JavaScript origins**:
     - `https://bug-tracker-saas.onrender.com` (your backend)
   - **Authorized redirect URIs**:
     - `https://bug-tracker-saas.onrender.com/api/auth/google/callback`
7. Copy **Client ID** and **Client secret**

### Production Settings
```
Authorized JavaScript origins: https://bug-tracker-saas.onrender.com
Authorized redirect URIs: https://bug-tracker-saas.onrender.com/api/auth/google/callback
```

---

## 3. Environment Variables - Production

### Frontend (Vercel)

In your Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add these variables:

```bash
# API URLs - Point to your Render backend services
NEXT_PUBLIC_AUTH_URL=https://bug-tracker-saas.onrender.com/api
NEXT_PUBLIC_API_URL=https://bugtracker-bug-service.onrender.com/api
NEXT_PUBLIC_NOTIFICATION_URL=https://bugtracker-notification-service.onrender.com

# App URL
NEXT_PUBLIC_APP_URL=https://bug-tracker-saas.vercel.app

# Environment
NODE_ENV=production

# OAuth (not actually needed in frontend for this setup, but good to have)
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-production-github-client-id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-production-google-client-id
```

3. Redeploy after adding variables

### Backend - Auth Service (Render)

In your Render dashboard for `bug-tracker-saas`:
1. Go to Environment tab
2. Add these variables:

```bash
# Server
PORT=5001
NODE_ENV=production

# Database (use your production database URL)
DATABASE_URL=postgresql://user:password@host:5432/bugtracker?schema=public

# JWT Secrets (use strong secrets, different from development!)
JWT_SECRET=your-production-jwt-secret-min-32-chars-long
JWT_REFRESH_SECRET=your-production-refresh-secret-min-32-chars-long
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# GitHub OAuth - PRODUCTION credentials
GITHUB_CLIENT_ID=your-production-github-client-id
GITHUB_CLIENT_SECRET=your-production-github-client-secret
GITHUB_CALLBACK_URL=https://bug-tracker-saas.onrender.com/api/auth/github/callback

# Google OAuth - PRODUCTION credentials
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
GOOGLE_CALLBACK_URL=https://bug-tracker-saas.onrender.com/api/auth/google/callback

# Frontend URL (where to redirect after OAuth success)
FRONTEND_URL=https://bug-tracker-saas.vercel.app

# CORS (your frontend URL)
CORS_ORIGIN=https://bug-tracker-saas.vercel.app

# Email (if you want password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Backend - Bug Service (Render)

In your Render dashboard for `bugtracker-bug-service`:

```bash
PORT=5002
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/bugtracker?schema=public
CORS_ORIGIN=https://bug-tracker-saas.vercel.app
JWT_SECRET=same-as-auth-service
REDIS_URL=redis://your-redis-host:6379
```

### Backend - Notification Service (Render)

In your Render dashboard for `bugtracker-notification-service`:

```bash
PORT=5003
NODE_ENV=production
CORS_ORIGIN=https://bug-tracker-saas.vercel.app
REDIS_URL=redis://your-redis-host:6379
```

---

## 4. CORS Configuration Check

Make sure your backend services allow the Vercel frontend origin. The code already supports this, but verify in logs:

```typescript
// In backend, this should show your Vercel URL
console.log(`🌐 Allowed Origins: https://bug-tracker-saas.vercel.app`)
```

---

## 5. Database Setup

### Production Database Options:

**Option 1: Render PostgreSQL (Recommended)**
- Create a PostgreSQL database in Render
- Copy the "Internal Database URL" 
- Use it for DATABASE_URL in all backend services

**Option 2: Neon (Serverless Postgres)**
- Go to https://neon.tech
- Create free database
- Copy connection string
- Use it for DATABASE_URL

**Option 3: Supabase**
- Go to https://supabase.com
- Create new project
- Get connection string from settings
- Use it for DATABASE_URL

### Run Migrations

After setting DATABASE_URL, run migrations:

```bash
# In auth service
cd services/auth-service
npx prisma migrate deploy

# In bug service  
cd services/bug-service
npx prisma migrate deploy
```

---

## 6. Redis Setup (Optional but Recommended)

For notifications and caching:

**Option 1: Upstash Redis (Serverless, Free tier)**
1. Go to https://upstash.com
2. Create Redis database
3. Copy connection URL
4. Add as REDIS_URL to bug-service and notification-service

**Option 2: Redis Labs**
1. Go to https://redis.com/try-free
2. Create database
3. Copy connection string

---

## 7. Deployment Checklist

### Pre-Deployment
- [x] Created separate OAuth apps for production
- [ ] Added all environment variables to Render
- [ ] Added all environment variables to Vercel
- [ ] Set up production database
- [ ] Set up Redis (optional)
- [ ] Updated OAuth callback URLs in GitHub/Google

### Post-Deployment
- [ ] Verify backend health endpoints:
  - `https://bug-tracker-saas.onrender.com/health`
  - `https://bugtracker-bug-service.onrender.com/health`
  - `https://bugtracker-notification-service.onrender.com/health`
- [ ] Test OAuth login on production frontend
- [ ] Check backend logs in Render dashboard
- [ ] Test regular login/signup
- [ ] Test creating bugs/issues
- [ ] Test real-time notifications

---

## 8. Security Best Practices

### Environment Variables
✅ **DO:**
- Use strong, unique JWT secrets (min 32 characters)
- Use different secrets for dev and production
- Store secrets in platform environment variables
- Use HTTPS in production (Vercel/Render do this automatically)

❌ **DON'T:**
- Commit `.env` files with real credentials
- Use same OAuth apps for dev and production
- Share secrets in code or documentation

### OAuth
✅ **DO:**
- Create separate OAuth apps for production
- Use exact callback URLs (no wildcards)
- Regularly rotate client secrets

❌ **DON'T:**
- Use development OAuth apps in production
- Allow wildcard callback URLs

---

## 9. Monitoring & Debugging

### Check Backend Logs (Render)
1. Go to Render dashboard
2. Select service
3. Click "Logs" tab
4. Look for:
   ```
   🔐 Auth Service running on port 5001
   📊 Environment: production
   🔑 GitHub OAuth: ✓ Configured
   🔑 Google OAuth: ✓ Configured
   ```

### Check Frontend Logs (Vercel)
1. Go to Vercel dashboard
2. Click on deployment
3. Check Function Logs for errors

### Test Endpoints
```bash
# Health checks
curl https://bug-tracker-saas.onrender.com/health
curl https://bugtracker-bug-service.onrender.com/health

# Test OAuth redirect (should redirect to GitHub/Google)
curl -I https://bug-tracker-saas.onrender.com/api/auth/github
curl -I https://bug-tracker-saas.onrender.com/api/auth/google
```

---

## 10. Common Production Issues

### "redirect_uri_mismatch"
**Cause**: OAuth callback URL doesn't match
**Fix**: Update OAuth app callback to: `https://bug-tracker-saas.onrender.com/api/auth/{provider}/callback`

### CORS errors in production
**Cause**: Backend not allowing frontend origin
**Fix**: Set `CORS_ORIGIN=https://bug-tracker-saas.vercel.app` in all backend services

### OAuth works locally but not in production
**Cause**: Using development OAuth credentials
**Fix**: Create separate production OAuth apps and use those credentials

### Database connection fails
**Cause**: Wrong DATABASE_URL or database not accessible
**Fix**: 
- Check DATABASE_URL format
- Ensure database allows connections from Render IPs
- Check database is running

### Render service keeps sleeping (free tier)
**Cause**: Free tier services sleep after 15 minutes of inactivity
**Fix**: 
- Upgrade to paid tier, or
- Use a service like UptimeRobot to ping your backend every 10 minutes

---

## 11. Environment Variable Template

Save this as `.env.production` (don't commit it!):

```bash
# ===== FRONTEND (Vercel) =====
NEXT_PUBLIC_AUTH_URL=https://bug-tracker-saas.onrender.com/api
NEXT_PUBLIC_API_URL=https://bugtracker-bug-service.onrender.com/api
NEXT_PUBLIC_NOTIFICATION_URL=https://bugtracker-notification-service.onrender.com
NEXT_PUBLIC_APP_URL=https://bug-tracker-saas.vercel.app
NODE_ENV=production

# ===== BACKEND - Auth Service (Render) =====
PORT=5001
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/bugtracker
JWT_SECRET=generate-secure-random-string-min-32-chars
JWT_REFRESH_SECRET=generate-another-secure-random-string-min-32-chars
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Production GitHub OAuth
GITHUB_CLIENT_ID=your-prod-github-client-id
GITHUB_CLIENT_SECRET=your-prod-github-client-secret
GITHUB_CALLBACK_URL=https://bug-tracker-saas.onrender.com/api/auth/github/callback

# Production Google OAuth  
GOOGLE_CLIENT_ID=your-prod-google-client-id
GOOGLE_CLIENT_SECRET=your-prod-google-client-secret
GOOGLE_CALLBACK_URL=https://bug-tracker-saas.onrender.com/api/auth/google/callback

FRONTEND_URL=https://bug-tracker-saas.vercel.app
CORS_ORIGIN=https://bug-tracker-saas.vercel.app

# ===== BACKEND - Bug Service (Render) =====
PORT=5002
DATABASE_URL=postgresql://user:password@host:5432/bugtracker
CORS_ORIGIN=https://bug-tracker-saas.vercel.app
JWT_SECRET=same-as-auth-service
REDIS_URL=redis://redis-host:6379

# ===== BACKEND - Notification Service (Render) =====
PORT=5003
CORS_ORIGIN=https://bug-tracker-saas.vercel.app
REDIS_URL=redis://redis-host:6379
```

---

## 12. Quick Deploy Commands

```bash
# Generate secure JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test production backend
curl https://bug-tracker-saas.onrender.com/health

# Redeploy Vercel
vercel --prod

# View Render logs
# (use Render dashboard)
```

---

## Need Help?

1. **OAuth not working**: Check callback URLs match exactly
2. **CORS errors**: Verify CORS_ORIGIN includes your Vercel URL
3. **Database errors**: Check DATABASE_URL and run migrations
4. **Service sleeping**: Consider upgrading Render tier or use UptimeRobot

Your production setup is ready! Just add your OAuth credentials and deploy! 🚀
