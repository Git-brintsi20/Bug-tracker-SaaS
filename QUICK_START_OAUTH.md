# 🚀 Quick Start Guide - OAuth Setup

This guide will help you get OAuth authentication working in just a few minutes.

## Prerequisites

- Node.js installed
- PostgreSQL database running (via Docker or locally)
- GitHub and Google accounts

## Step 1: Set Up OAuth Providers

### GitHub OAuth (5 minutes)

1. Go to https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in:
   - **Application name**: BugTracker
   - **Homepage URL**: `http://localhost:3000`
   - **Callback URL**: `http://localhost:5001/api/auth/github/callback`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

### Google OAuth (10 minutes)

1. Go to https://console.cloud.google.com/
2. Create new project: "BugTracker"
3. Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External"
   - Fill in app name: "BugTracker"
   - Add your email as user support and developer contact
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Type: "Web application"
   - Name: "BugTracker Web Client"
   - Add Authorized JavaScript origins: `http://localhost:5001`
   - Add Authorized redirect URIs: `http://localhost:5001/api/auth/google/callback`
5. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Backend

1. Open `services/auth-service/.env`
2. Replace the placeholder OAuth values:

```bash
# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here
GITHUB_CALLBACK_URL=http://localhost:5001/api/auth/github/callback

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

3. Save the file

## Step 3: Start Services

### Option A: Using Docker (Recommended)

```powershell
# Start all services including database
docker-compose up -d

# Check logs
docker-compose logs -f auth-service
```

### Option B: Manual Start

```powershell
# Terminal 1: Start PostgreSQL (if not using Docker)
# Make sure PostgreSQL is running on port 5432

# Terminal 2: Start Auth Service
cd services/auth-service
npm install
npm run dev

# Terminal 3: Start Frontend
cd ../..
npm install
npm run dev
```

## Step 4: Test OAuth

1. Open browser: http://localhost:3000/auth/login
2. Click "Sign in with GitHub" or "Sign in with Google"
3. Authorize the app
4. You should be redirected to the dashboard!

## Verification Checklist

When the auth service starts, you should see:

```
🔐 Auth Service running on port 5001
📊 Environment: development
🌐 Allowed Origins: [ 'http://localhost:3000', ... ]
🔑 GitHub OAuth: ✓ Configured
🔑 Google OAuth: ✓ Configured
```

## Troubleshooting

### Backend shows "✗ Not configured" for OAuth

❌ **Problem**: OAuth credentials not loaded

✅ **Solution**: 
- Check that you updated the `.env` file in `services/auth-service/`
- Make sure you didn't leave the placeholder values
- Restart the auth service

### "redirect_uri_mismatch" error

❌ **Problem**: Callback URL doesn't match

✅ **Solution**:
- GitHub: Make sure callback is `http://localhost:5001/api/auth/github/callback`
- Google: Make sure redirect URI is `http://localhost:5001/api/auth/google/callback`
- No trailing slashes!
- Use `http://` not `https://` for local development

### Frontend shows connection error

❌ **Problem**: Can't connect to backend

✅ **Solution**:
- Make sure auth service is running on port 5001
- Test: http://localhost:5001/health (should show "ok")
- Check firewall settings

### OAuth succeeds but shows error on callback

❌ **Problem**: Frontend callback page issue

✅ **Solution**:
- Make sure `FRONTEND_URL` in backend .env is `http://localhost:3000`
- Check browser console for errors
- Clear browser cache and try again

## Next Steps

- ✅ OAuth is working!
- Read [OAUTH_SETUP.md](./OAUTH_SETUP.md) for detailed configuration
- For production setup, see deployment documentation

## Need Help?

Common commands:

```powershell
# Check if services are running
docker-compose ps

# View auth service logs
docker-compose logs -f auth-service

# Restart auth service (picks up .env changes)
docker-compose restart auth-service

# Stop all services
docker-compose down
```

---

**Note**: For production deployment:
1. Update callback URLs to your production domains
2. Create separate OAuth apps for production
3. Use proper HTTPS URLs
4. Never commit `.env` files with real credentials!
