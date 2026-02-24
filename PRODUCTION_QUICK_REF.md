# 📋 Production Setup - Quick Reference

## Your URLs

- 🌐 **Frontend**: https://bug-tracker-saas.vercel.app  
- 🔐 **Auth Backend**: https://bug-tracker-saas.onrender.com  
- 🐛 **Bug Backend**: https://bugtracker-bug-service.onrender.com  
- 🔔 **Notification Backend**: https://bugtracker-notification-service.onrender.com

---

## OAuth Callback URLs (IMPORTANT!)

When creating OAuth apps, use these EXACT callback URLs:

### GitHub OAuth
```
Homepage URL: https://bug-tracker-saas.vercel.app
Authorization callback URL: https://bug-tracker-saas.onrender.com/api/auth/github/callback
```

### Google OAuth
```
Authorized JavaScript origins: https://bug-tracker-saas.onrender.com
Authorized redirect URIs: https://bug-tracker-saas.onrender.com/api/auth/google/callback
```

⚠️ **Key Point**: Callbacks go to **BACKEND** (Render), NOT frontend (Vercel)!

---

## Quick Setup Steps

### 1. Create OAuth Apps
- **GitHub**: https://github.com/settings/developers → "New OAuth App"
- **Google**: https://console.cloud.google.com/ → Create credentials

### 2. Add to Render (Auth Service)
Go to `bug-tracker-saas` service → Environment:
```bash
GITHUB_CLIENT_ID=<your-id>
GITHUB_CLIENT_SECRET=<your-secret>
GITHUB_CALLBACK_URL=https://bug-tracker-saas.onrender.com/api/auth/github/callback

GOOGLE_CLIENT_ID=<your-id>
GOOGLE_CLIENT_SECRET=<your-secret>
GOOGLE_CALLBACK_URL=https://bug-tracker-saas.onrender.com/api/auth/google/callback

FRONTEND_URL=https://bug-tracker-saas.vercel.app
CORS_ORIGIN=https://bug-tracker-saas.vercel.app
```

### 3. Redeploy
- Render: Manual deploy after adding variables
- Vercel: Redeploy if you changed environment variables

### 4. Test
Visit: https://bug-tracker-saas.vercel.app/auth/login
Try OAuth buttons!

---

## Common Mistakes to Avoid

❌ Using local/development OAuth apps in production  
✅ Create separate production OAuth apps

❌ Callback URL pointing to frontend (Vercel)  
✅ Callback URL must point to backend (Render)

❌ Using `http://` in production URLs  
✅ Always use `https://` in production

❌ Forgetting to redeploy after adding env variables  
✅ Always redeploy after changes

---

## Verification Checklist

- [ ] Created production GitHub OAuth app with correct callback
- [ ] Created production Google OAuth credentials with correct callback
- [ ] Added all OAuth env vars to Render auth service
- [ ] Added FRONTEND_URL and CORS_ORIGIN to Render
- [ ] Redeployed Render service
- [ ] Checked Render logs show "✓ Configured" for both OAuth providers
- [ ] Tested GitHub login on production site
- [ ] Tested Google login on production site

---

## Detailed Guides

- **[OAUTH_PRODUCTION.md](./OAUTH_PRODUCTION.md)** - Step-by-step OAuth setup
- **[PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)** - Complete deployment guide
- **[OAUTH_SETUP.md](./OAUTH_SETUP.md)** - Detailed OAuth documentation

---

## Need Help?

**Check backend is running**:
```bash
curl https://bug-tracker-saas.onrender.com/health
```

**Check backend logs** (Render):
Should see:
```
🔐 Auth Service running on port 5001
🔑 GitHub OAuth: ✓ Configured
🔑 Google OAuth: ✓ Configured
```

**Common errors**:
- "redirect_uri_mismatch" → Check callback URLs match exactly
- "✗ Not configured" in logs → Add env vars and redeploy
- CORS errors → Add CORS_ORIGIN to Render
- Connection errors → Check backend health endpoint
