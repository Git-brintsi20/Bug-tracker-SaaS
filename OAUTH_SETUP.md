# OAuth Setup Guide

## 🔑 Getting GitHub OAuth Credentials

### Step 1: Create GitHub OAuth App
1. Go to GitHub Settings: https://github.com/settings/developers
2. Click **"OAuth Apps"** in the left sidebar
3. Click **"New OAuth App"**
4. Fill in the details:
   - **Application name**: BugTracker SaaS
   - **Homepage URL**: `http://localhost:3000` (development) or `https://yourdomain.com` (production)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
   - For production: `https://yourdomain.com/api/auth/callback/github`
5. Click **"Register application"**
6. You'll see:
   - **Client ID** - Copy this to `NEXT_PUBLIC_GITHUB_CLIENT_ID`
   - Click **"Generate a new client secret"**
   - **Client Secret** - Copy this to `GITHUB_CLIENT_SECRET` (backend .env)

### GitHub OAuth App Settings
```
Homepage URL (Dev): http://localhost:3000
Homepage URL (Prod): https://yourdomain.com

Callback URL (Dev): http://localhost:3000/api/auth/callback/github
Callback URL (Prod): https://yourdomain.com/api/auth/callback/github
```

---

## 🔑 Getting Google OAuth Credentials

### Step 1: Create Google Cloud Project
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Click **"Select a project"** → **"New Project"**
3. Name: **BugTracker SaaS**
4. Click **"Create"**

### Step 2: Enable Google+ API
1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click **"Enable"**

### Step 3: Configure OAuth Consent Screen
1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** → Click **"Create"**
3. Fill in required fields:
   - **App name**: BugTracker SaaS
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click **"Save and Continue"**
5. Skip **"Scopes"** → Click **"Save and Continue"**
6. Skip **"Test users"** (unless in testing mode)
7. Click **"Back to Dashboard"**

### Step 4: Create OAuth Credentials
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Select **"Web application"**
4. Name: **BugTracker Web Client**
5. Add **Authorized JavaScript origins**:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
6. Add **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Click **"Create"**
8. You'll see:
   - **Client ID** - Copy this to `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - **Client secret** - Copy this to `GOOGLE_CLIENT_SECRET` (backend .env)

### Google OAuth Settings
```
Authorized JavaScript origins (Dev): http://localhost:3000
Authorized JavaScript origins (Prod): https://yourdomain.com

Authorized redirect URIs (Dev): http://localhost:3000/api/auth/callback/google
Authorized redirect URIs (Prod): https://yourdomain.com/api/auth/callback/google
```

---

## 📝 Environment Variables Checklist

### Frontend (.env.local)
```bash
NEXT_PUBLIC_GITHUB_CLIENT_ID=<your-github-client-id>
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>
```

### Backend Services (.env)
```bash
# GitHub OAuth
GITHUB_CLIENT_ID=<same-as-frontend>
GITHUB_CLIENT_SECRET=<your-github-client-secret>

# Google OAuth
GOOGLE_CLIENT_ID=<same-as-frontend>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# JWT Secret (already generated)
JWT_SECRET=<your-generated-jwt-secret>
```

---

## ⚠️ Important Notes

1. **Client IDs are public** - They can be in frontend code
2. **Client Secrets are private** - Only in backend environment variables
3. **Different credentials for Dev/Prod** - Create separate OAuth apps for each
4. **Callback URLs must match exactly** - Include the full path

---

## 🧪 Testing OAuth

### Test GitHub Login
1. Start your app
2. Click "Sign in with GitHub"
3. Authorize the app
4. You should be redirected back with a token

### Test Google Login
1. Click "Sign in with Google"
2. Select your Google account
3. Grant permissions
4. You should be redirected back with a token

---

## 🔧 Troubleshooting

### "redirect_uri_mismatch" Error
- Check that callback URL in OAuth app matches exactly
- Include protocol (http:// or https://)
- Check for trailing slashes

### "invalid_client" Error
- Verify Client ID and Client Secret are correct
- Check that you're using the right credentials (dev vs prod)

### "access_denied" Error
- User canceled authentication
- Check OAuth consent screen configuration
- Verify app is not suspended

---

## 📚 Additional Resources

- GitHub OAuth Documentation: https://docs.github.com/en/developers/apps/building-oauth-apps
- Google OAuth Documentation: https://developers.google.com/identity/protocols/oauth2
