# 🔐 Environment Variables - Production Templates

Copy these to your deployment platforms (Render/Vercel).

---

## Render: Auth Service (bug-tracker-saas)

```bash
# Server Configuration
PORT=5001
NODE_ENV=production

# Database URL - Get from your database provider
# Render PostgreSQL: https://dashboard.render.com/
# Neon: https://neon.tech
# Supabase: https://supabase.com
DATABASE_URL=postgresql://user:password@host:5432/bugtracker?schema=public

# JWT Secrets - GENERATE NEW ONES FOR PRODUCTION!
# Run this to generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=REPLACE_WITH_32_CHAR_RANDOM_STRING
JWT_REFRESH_SECRET=REPLACE_WITH_ANOTHER_32_CHAR_RANDOM_STRING
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# GitHub OAuth - PRODUCTION credentials
# Create at: https://github.com/settings/developers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=https://bug-tracker-saas.onrender.com/api/auth/github/callback

# Google OAuth - PRODUCTION credentials
# Create at: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://bug-tracker-saas.onrender.com/api/auth/google/callback

# URLs
FRONTEND_URL=https://bug-tracker-saas.vercel.app
CORS_ORIGIN=https://bug-tracker-saas.vercel.app

# Email (Optional - for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## Render: Bug Service (bugtracker-bug-service)

```bash
# Server Configuration
PORT=5002
NODE_ENV=production

# Database URL - Same as auth service
DATABASE_URL=postgresql://user:password@host:5432/bugtracker?schema=public

# JWT Secret - MUST match auth service
JWT_SECRET=SAME_AS_AUTH_SERVICE

# CORS
CORS_ORIGIN=https://bug-tracker-saas.vercel.app

# Redis (Optional but recommended for notifications)
# Get from: https://upstash.com or https://redis.com
REDIS_URL=redis://default:password@host:6379
```

---

## Render: Notification Service (bugtracker-notification-service)

```bash
# Server Configuration
PORT=5003
NODE_ENV=production

# CORS
CORS_ORIGIN=https://bug-tracker-saas.vercel.app

# Redis (Required for real-time notifications)
# Get from: https://upstash.com or https://redis.com
REDIS_URL=redis://default:password@host:6379
```

---

## Vercel: Frontend (bug-tracker-saas)

Go to: Project Settings → Environment Variables

```bash
# Backend URLs - Point to your Render services
NEXT_PUBLIC_AUTH_URL=https://bug-tracker-saas.onrender.com/api
NEXT_PUBLIC_API_URL=https://bugtracker-bug-service.onrender.com/api
NEXT_PUBLIC_NOTIFICATION_URL=https://bugtracker-notification-service.onrender.com

# Frontend URL - Your Vercel deployment
NEXT_PUBLIC_APP_URL=https://bug-tracker-saas.vercel.app

# Environment
NODE_ENV=production

# OAuth Client IDs (Optional - not required but nice to have)
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## How to Add Variables

### Render:
1. Go to service dashboard
2. Click "Environment" tab
3. Click "Add Environment Variable"
4. Paste key and value
5. Click "Save Changes"
6. **Important**: Trigger manual deploy to apply changes

### Vercel:
1. Go to project settings
2. Click "Environment Variables"
3. Add variable name and value
4. Select environment: Production (or All)
5. Click "Save"
6. **Important**: Redeploy to apply changes

---

## Generate Secure JWT Secrets

Run this command locally to generate secure random strings:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run it twice to get two different secrets for:
- JWT_SECRET
- JWT_REFRESH_SECRET

Example output:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

---

## Verification Commands

### Check services are running:
```bash
# Auth service
curl https://bug-tracker-saas.onrender.com/health

# Bug service
curl https://bugtracker-bug-service.onrender.com/health

# Notification service
curl https://bugtracker-notification-service.onrender.com/health
```

### Expected response:
```json
{"status":"ok","service":"auth-service"}
```

### Check OAuth is configured (in Render logs):
```
🔐 Auth Service running on port 5001
📊 Environment: production
🌐 Allowed Origins: https://bug-tracker-saas.vercel.app
🔑 GitHub OAuth: ✓ Configured
🔑 Google OAuth: ✓ Configured
```

If you see `✗ Not configured`, the credentials weren't loaded.

---

## Important Notes

⚠️ **Never commit .env files with real credentials to git!**

⚠️ **Use different secrets for development and production**

⚠️ **JWT_SECRET must be the same across auth-service and bug-service**

⚠️ **Always redeploy after adding/changing environment variables**

⚠️ **For Render free tier**: Services sleep after 15 min inactivity. Consider:
- Upgrading to paid tier
- Using UptimeRobot to ping services every 10 minutes
- Accepting cold starts (slower first request)

---

## Database Setup

### Option 1: Render PostgreSQL (Recommended)
1. Go to Render dashboard
2. Click "New +" → "PostgreSQL"
3. Choose plan (Free tier available)
4. Copy "Internal Database URL"
5. Use for DATABASE_URL in all backend services

### Option 2: Neon (Serverless Postgres)
1. Go to https://neon.tech
2. Create free account
3. Create database
4. Copy connection string
5. Add `?schema=public` to the end

### Option 3: Supabase
1. Go to https://supabase.com
2. Create project
3. Go to Settings → Database
4. Copy connection string (use "Connection pooling" for better performance)

### After setting DATABASE_URL:
```bash
# SSH into Render service or run locally
cd services/auth-service
npx prisma migrate deploy

cd services/bug-service
npx prisma migrate deploy
```

---

## Redis Setup (Optional)

### Upstash Redis (Recommended - Free tier available)
1. Go to https://upstash.com
2. Create database
3. Copy "REDIS_URL" from connection details
4. Add to bug-service and notification-service

---

## Troubleshooting

### Service won't start
- Check logs for error messages
- Verify all required env vars are set
- Check DATABASE_URL is correct

### OAuth not working
- Verify callback URLs match exactly
- Check OAuth credentials in logs (should show ✓)
- Create separate OAuth apps for production

### CORS errors
- Add CORS_ORIGIN to all backend services
- Make sure it matches your Vercel URL exactly
- Redeploy after changes

### Database connection errors
- Check DATABASE_URL format is correct
- Verify database is accessible
- Run migrations

---

**Pro tip**: Save this file for reference when deploying! 📌
