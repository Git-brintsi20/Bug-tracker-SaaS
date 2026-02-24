# OAuth Setup Guide

This guide will help you set up Google and GitHub OAuth for the BugTracker application.

## 🏗️ Architecture Overview

The auth flow works as follows:
1. User clicks "Sign in with Google" or "Sign in with GitHub" (Frontend: `http://localhost:3000`)
2. Frontend redirects to backend OAuth endpoint (Backend: `http://localhost:5001/api/auth/google` or `/auth/github`)
3. Backend redirects to OAuth provider (Google/GitHub)
4. User authorizes the app
5. Provider redirects back to backend callback (Backend: `http://localhost:5001/api/auth/google/callback` or `/auth/github/callback`)
6. Backend generates JWT tokens and redirects to frontend callback (Frontend: `http://localhost:3000/auth/callback`)
7. Frontend stores tokens and redirects to dashboard

## 🔑 Getting GitHub OAuth Credentials

### Step 1: Create GitHub OAuth App
1. Go to GitHub Settings: https://github.com/settings/developers
2. Click **"OAuth Apps"** in the left sidebar
3. Click **"New OAuth App"**
4. Fill in the details:
   - **Application name**: BugTracker (or any name you like)
   - **Homepage URL**: 
     - Development: `http://localhost:3000`
     - Production: `https://your-frontend-domain.com`
   - **Application description**: Bug tracking application
   - **Authorization callback URL**: 
     - Development: `http://localhost:5001/api/auth/github/callback`
     - Production: `https://your-backend-domain.com/api/auth/github/callback`
5. Click **"Register application"**
6. You'll see:
   - **Client ID** - Copy this
   - Click **"Generate a new client secret"**
   - **Client Secret** - Copy this (you won't be able to see it again!)

### GitHub OAuth App Settings Summary
```
Application name: BugTracker
Homepage URL (Dev): http://localhost:3000
Homepage URL (Prod): https://your-frontend-domain.com

Authorization callback URL (Dev): http://localhost:5001/api/auth/github/callback
Authorization callback URL (Prod): https://your-backend-domain.com/api/auth/github/callback
```

**⚠️ Important**: The callback URL points to your **BACKEND** service, not the frontend!

---

## 🔑 Getting Google OAuth Credentials

### Step 1: Create Google Cloud Project
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Click **"Select a project"** dropdown at the top → **"New Project"**
3. Project name: **BugTracker** (or any name you prefer)
4. Click **"Create"**
5. Wait for the project to be created, then select it

### Step 2: Configure OAuth Consent Screen
1. In your project, go to **"APIs & Services"** → **"OAuth consent screen"** (left sidebar)
2. Select **"External"** (unless you have a Google Workspace)
3. Click **"Create"**
4. Fill in required fields on the "OAuth consent screen" page:
   - **App name**: BugTracker
   - **User support email**: Your email address
   - **App logo**: (Optional) Upload a logo
   - **Application home page**: `http://localhost:3000` (for dev) or your production URL
   - **Authorized domains**: Leave empty for localhost development
   - **Developer contact information**: Your email address
5. Click **"Save and Continue"**
6. On the **"Scopes"** page:
   - Click **"Add or Remove Scopes"**
   - You should already have these default scopes (no need to add anything):
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
     - `openid`
   - Click **"Update"** → **"Save and Continue"**
7. On the **"Test users"** page:
   - If your app is in "Testing" mode, add test user emails
   - Or skip this if you want to publish the app
   - Click **"Save and Continue"**
8. Review the summary and click **"Back to Dashboard"**

### Step 3: Create OAuth Credentials
1. Go to **"APIs & Services"** → **"Credentials"** (left sidebar)
2. Click **"+ Create Credentials"** at the top
3. Select **"OAuth client ID"**
4. If prompted to configure the consent screen, complete Step 2 above first
5. Choose application type: **"Web application"**
6. Name: **BugTracker Web Client**
7. Under **"Authorized JavaScript origins"**:
   - Click **"+ Add URI"**
   - Development: `http://localhost:5001`
   - (Optional) Production: `https://your-backend-domain.com`
8. Under **"Authorized redirect URIs"**:
   - Click **"+ Add URI"**
   - Development: `http://localhost:5001/api/auth/google/callback`
   - (Optional) Production: `https://your-backend-domain.com/api/auth/google/callback`
9. Click **"Create"**
10. A dialog will show your credentials:
    - **Client ID** - Copy this
    - **Client secret** - Copy this (you can always retrieve it later from the credentials page)
11. Click **"OK"**

### Google OAuth Settings Summary
```
App name: BugTracker
Application type: Web application

Authorized JavaScript origins (Dev): http://localhost:5001
Authorized JavaScript origins (Prod): https://your-backend-domain.com

Authorized redirect URIs (Dev): http://localhost:5001/api/auth/google/callback
Authorized redirect URIs (Prod): https://your-backend-domain.com/api/auth/google/callback
```

**⚠️ Important**: 
- The redirect URIs point to your **BACKEND** service (port 5001), not the frontend!
- Make sure the JavaScript origins also point to the backend
- For production, replace with your actual backend domain

---

## 📝 Environment Variables Setup

### Backend Service (.env)
Update `services/auth-service/.env` with your OAuth credentials:

```bash
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/bugtracker?schema=public"

# JWT Configuration (already generated for you)
JWT_SECRET=a996b7d61bb28b071af33b25d9d28f028056be371c8565082eba286c4f1b8f3f560c98b680e8f23ca3929427967f6410
JWT_REFRESH_SECRET=8f11508e3e76a8b6b94270780e18247c6932e7e72c52ea674884b47e2b85c5f1
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# GitHub OAuth - REPLACE THESE WITH YOUR VALUES
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here
GITHUB_CALLBACK_URL=http://localhost:5001/api/auth/github/callback

# Google OAuth - REPLACE THESE WITH YOUR VALUES
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# Frontend URL (where to redirect after successful OAuth)
FRONTEND_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Frontend (.env.local - Optional)
Create `.env.local` in the project root if you need to configure the auth service URL:

```bash
# Only needed if your auth service is on a different URL
NEXT_PUBLIC_AUTH_URL=http://localhost:5001/api
```

**Note**: The frontend doesn't need OAuth credentials - it only redirects to the backend OAuth endpoints.

---

## 🚀 Quick Start Summary

After completing the setup:

1. **Update backend .env**: Add your GitHub and Google OAuth credentials to `services/auth-service/.env`
2. **Restart auth service**: If it's running, restart it to load new environment variables
3. **Test OAuth**: Try logging in with GitHub or Google

### Testing Checklist
- [ ] GitHub OAuth credentials added to `.env`
- [ ] Google OAuth credentials added to `.env`
- [ ] Backend service restarted
- [ ] Frontend can access backend at `http://localhost:5001`
- [ ] Callback URLs match exactly in OAuth provider settings

---

## ⚠️ Important Notes

1. **Client IDs are public** - They can be in frontend code
2. **Client Secrets are private** - Only in backend environment variables
3. **Different credentials for Dev/Prod** - Create separate OAuth apps for each
4. **Callback URLs must match exactly** - Include the full path

---

## 🧪 Testing OAuth

### Before Testing
1. Make sure both frontend and backend services are running:
   - Frontend: `npm run dev` (port 3000)
   - Backend auth service: `cd services/auth-service && npm run dev` (port 5001)
2. Check backend logs to confirm OAuth providers are configured

### Test GitHub Login
1. Go to `http://localhost:3000/auth/login`
2. Click "Sign in with GitHub" button
3. You'll be redirected to GitHub
4. Authorize the app
5. You should be redirected back to the dashboard
6. Check browser console for any errors

### Test Google Login
1. Go to `http://localhost:3000/auth/login`
2. Click "Sign in with Google" button
3. You'll be redirected to Google
4. Select your Google account
5. Grant permissions (if first time)
6. You should be redirected back to the dashboard
7. Check browser console for any errors

---

## 🔧 Troubleshooting

### "redirect_uri_mismatch" Error
**Problem**: The callback URL in your OAuth app doesn't match the one being used

**Solutions**:
- For GitHub: Check that the callback URL is exactly `http://localhost:5001/api/auth/github/callback`
- For Google: Check that the redirect URI is exactly `http://localhost:5001/api/auth/google/callback`
- Make sure there's no trailing slash
- Protocol must match (http:// not https:// for local development)
- Check the backend logs to see what URL it's trying to use

### "invalid_client" Error
**Problem**: Client ID or Client Secret is incorrect

**Solutions**:
- Double-check you copied the credentials correctly (no extra spaces)
- Make sure you're using the correct credentials (not mixing dev and prod)
- For Google: Make sure you created "Web application" type, not "Desktop app"
- Try regenerating the client secret

### "access_denied" Error
**Problem**: User canceled authentication or app doesn't have permission

**Solutions**:
- Try the OAuth flow again
- For Google: Make sure OAuth consent screen is properly configured
- Check if the OAuth app is suspended or restricted

### CORS Errors
**Problem**: Browser blocks requests due to CORS policy

**Solutions**:
- Check that backend CORS is configured to allow `http://localhost:3000`
- Make sure you're not trying to access the backend from a different origin
- Check the backend logs for CORS warnings
- The backend should show "✓ Configured" for OAuth providers in startup logs

### User Not Created / Empty Profile
**Problem**: OAuth succeeds but no user is created or profile is incomplete

**Solutions**:
- Check backend database connection
- Check backend logs for any Prisma errors
- Make sure the User model in Prisma schema has `githubId` and `googleId` fields
- Run `npm run prisma:migrate` if needed

### Frontend Shows "Connection Error"
**Problem**: Frontend can't connect to backend

**Solutions**:
- Make sure auth service is running on port 5001
- Check `NEXT_PUBLIC_AUTH_URL` in frontend (should be `http://localhost:5001/api`)
- Try accessing `http://localhost:5001/health` in your browser to verify backend is running
- Check for firewall or antivirus blocking connections

### OAuth Buttons Don't Work
**Problem**: Clicking GitHub/Google buttons does nothing or shows errors

**Solutions**:
- Check browser console for JavaScript errors
- Make sure the AUTH_API_URL is correct in login form
- Verify backend auth routes are properly set up
- Test the backend OAuth endpoint directly: `http://localhost:5001/api/auth/google`

### "Failed to load resource" Errors
**Problem**: Browser can't load resources from backend

**Solutions**:
- Check if backend is running: `http://localhost:5001/health`
- Verify the URL in frontend code matches the backend port
- Check for typos in API URLs
- Make sure backend is listening on `0.0.0.0` not just `localhost`

---

## 📚 Additional Resources

- GitHub OAuth Documentation: https://docs.github.com/en/developers/apps/building-oauth-apps
- Google OAuth Documentation: https://developers.google.com/identity/protocols/oauth2
