# 🚀 OAuth Setup - Production Quick Guide

Based on your deployment:
- **Frontend**: https://bug-tracker-saas.vercel.app
- **Backend**: https://bug-tracker-saas.onrender.com

## Step 1: GitHub OAuth (Production)

### Create Production OAuth App
1. **Go to**: https://github.com/settings/developers
2. **Click**: "New OAuth App"
3. **Fill in**:
   ```
   Application name: BugTracker Production
   Homepage URL: https://bug-tracker-saas.vercel.app
   Authorization callback URL: https://bug-tracker-saas.onrender.com/api/auth/github/callback
   ```
   ⚠️ **IMPORTANT**: Callback URL points to BACKEND (Render), not frontend!

4. **Register application**
5. **Copy**:
   - Client ID
   - Generate and copy Client Secret

### Add to Render (Auth Service)
In your Render dashboard for `bug-tracker-saas`:
```bash
GITHUB_CLIENT_ID=<your-production-client-id>
GITHUB_CLIENT_SECRET=<your-production-client-secret>
GITHUB_CALLBACK_URL=https://bug-tracker-saas.onrender.com/api/auth/github/callback
```

---

## Step 2: Google OAuth (Production)

**📚 Detailed Guides Available:**
- **[GOOGLE_OAUTH_DETAILED.md](./GOOGLE_OAUTH_DETAILED.md)** - Complete step-by-step walkthrough
- **[GOOGLE_OAUTH_VISUAL.md](./GOOGLE_OAUTH_VISUAL.md)** - Quick visual reference

### Quick Summary:

1. **Go to**: https://console.cloud.google.com/
2. **Select your project** (or create new: "BugTracker")

3. **OAuth Consent Screen** (APIs & Services → OAuth consent screen):
   - Type: External
   - App name: `BugTracker`
   - User support email: Your email
   - Authorized domains: `vercel.app` and `onrender.com`
   - Save and continue through all steps
   
4. **Create Credentials** (APIs & Services → Credentials):
   - Click: "+ Create Credentials" → "OAuth client ID"
   - Type: **Web application**
   - Name: `BugTracker Production`
   
5. **Configure**:
   ```
   Authorized JavaScript origins:
   → https://bug-tracker-saas.onrender.com
   
   Authorized redirect URIs:
   → https://bug-tracker-saas.onrender.com/api/auth/google/callback
   ```
   ⚠️ **IMPORTANT**: Use BACKEND URL (Render), not frontend!

6. **Copy**:
   - Client ID (looks like: `123456-abc.apps.googleusercontent.com`)
   - Client secret (looks like: `GOCSPX-abc123...`)

**Need help?** See [GOOGLE_OAUTH_DETAILED.md](./GOOGLE_OAUTH_DETAILED.md) for screenshots and detailed instructions!

### Add to Render (Auth Service)
In your Render dashboard for `bug-tracker-saas`:
```bash
GOOGLE_CLIENT_ID=<your-production-client-id>
GOOGLE_CLIENT_SECRET=<your-production-client-secret>
GOOGLE_CALLBACK_URL=https://bug-tracker-saas.onrender.com/api/auth/google/callback
```

---

## Step 3: Configure Environment Variables

### Render (Auth Service) - Complete List
Go to your Render service `bug-tracker-saas` → Environment:

```bash
# Server
PORT=5001
NODE_ENV=production

# Database (use your production PostgreSQL URL)
DATABASE_URL=postgresql://user:password@host:5432/bugtracker

# JWT Secrets - Generate new ones!
# Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=<generate-secure-random-32-chars>
JWT_REFRESH_SECRET=<generate-another-secure-random-32-chars>
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# GitHub OAuth - From Step 1
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
GITHUB_CALLBACK_URL=https://bug-tracker-saas.onrender.com/api/auth/github/callback

# Google OAuth - From Step 2
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=https://bug-tracker-saas.onrender.com/api/auth/google/callback

# URLs
FRONTEND_URL=https://bug-tracker-saas.vercel.app
CORS_ORIGIN=https://bug-tracker-saas.vercel.app
```

### Vercel (Frontend) - Environment Variables
Go to your Vercel project → Settings → Environment Variables:

```bash
# Backend URLs
NEXT_PUBLIC_AUTH_URL=https://bug-tracker-saas.onrender.com/api
NEXT_PUBLIC_API_URL=https://bugtracker-bug-service.onrender.com/api
NEXT_PUBLIC_NOTIFICATION_URL=https://bugtracker-notification-service.onrender.com

# Frontend URL
NEXT_PUBLIC_APP_URL=https://bug-tracker-saas.vercel.app

# Environment
NODE_ENV=production
```

**Note**: Frontend doesn't need OAuth secrets - only the backend does!

---

## Step 4: Deploy & Test

### Redeploy Services
1. **Render**: After adding env variables, trigger manual deploy
2. **Vercel**: Redeploy to pick up new environment variables

### Verify Backend is Running
Check health endpoint:
```
https://bug-tracker-saas.onrender.com/health
```

Should return: `{"status":"ok","service":"auth-service"}`

### Check Backend Logs (Render)
Look for:
```
🔐 Auth Service running on port 5001
📊 Environment: production
🔑 GitHub OAuth: ✓ Configured
🔑 Google OAuth: ✓ Configured
```

If you see `✗ Not configured`, the credentials weren't loaded correctly.

### Test OAuth Flow
1. Go to: `https://bug-tracker-saas.vercel.app/auth/login`
2. Click "Sign in with GitHub"
3. Authorize the app
4. You should be redirected back to dashboard

---

## Common Issues & Solutions

### ❌ "redirect_uri_mismatch" Error

**Problem**: OAuth callback URL doesn't match

**Solution**: 
- Verify GitHub callback is EXACTLY: `https://bug-tracker-saas.onrender.com/api/auth/github/callback`
- Verify Google redirect URI is EXACTLY: `https://bug-tracker-saas.onrender.com/api/auth/google/callback`
- No trailing slashes!
- Must use `https://` (not `http://`)

### ❌ Backend shows "✗ Not configured"

**Problem**: OAuth credentials not loaded

**Solution**:
- Check you added variables to Render (not local .env)
- Redeploy the service after adding variables
- Check for typos in variable names
- Make sure you didn't leave placeholder values

### ❌ CORS errors

**Problem**: Backend not allowing requests from frontend

**Solution**:
- Add to Render: `CORS_ORIGIN=https://bug-tracker-saas.vercel.app`
- Make sure URL matches your Vercel deployment exactly
- Redeploy backend

### ❌ "Cannot connect to authentication server"

**Problem**: Frontend can't reach backend

**Solution**:
- Verify backend is running: `https://bug-tracker-saas.onrender.com/health`
- Check Vercel environment variables use correct backend URLs
- Make sure Render service isn't sleeping (free tier sleeps after 15min)

---

## OAuth Flow Diagram (Production)

```
User clicks "Sign in with Google"
    ↓
Frontend redirects to:
    https://bug-tracker-saas.onrender.com/api/auth/google
    ↓
Backend redirects to:
    Google OAuth page
    ↓
User authorizes
    ↓
Google redirects to:
    https://bug-tracker-saas.onrender.com/api/auth/google/callback
    ↓
Backend generates JWT tokens
    ↓
Backend redirects to:
    https://bug-tracker-saas.vercel.app/auth/callback?token=...
    ↓
Frontend stores tokens and redirects to dashboard
    ✅ Success!
```

---

## Security Checklist

- [ ] Created SEPARATE OAuth apps for production (not reusing dev apps)
- [ ] Generated NEW JWT secrets for production (not using dev secrets)
- [ ] All callback URLs use `https://` (not `http://`)
- [ ] CORS_ORIGIN matches your Vercel URL exactly
- [ ] OAuth secrets stored in Render (not committed to git)
- [ ] DATABASE_URL points to production database
- [ ] Tested OAuth login flow end-to-end

---

## Need Help?

1. **Check Render logs**: Service → Logs tab
2. **Check Vercel logs**: Deployment → Function Logs
3. **Test backend**: `curl https://bug-tracker-saas.onrender.com/health`
4. **Review**: [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) for detailed guide

---

**Your production OAuth is ready!** Just follow the steps above to configure it. 🚀
