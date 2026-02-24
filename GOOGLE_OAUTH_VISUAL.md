# 🎯 Google OAuth - Visual Quick Guide

Follow these exact steps after creating your project in Google Cloud Console.

---

## 📍 Navigation Path

```
Google Cloud Console (console.cloud.google.com)
    └─ Select Project: "BugTracker"
        └─ ☰ Menu
            └─ APIs & Services
                ├─ OAuth consent screen   ← Start here (Step 1)
                └─ Credentials            ← Then here (Step 2)
```

---

## Step 1: OAuth Consent Screen

### Where to find it:
```
Left Menu → APIs & Services → OAuth consent screen
```
Or search: "oauth consent" in top search bar

### What to do:

1. **Choose User Type**
   ```
   ○ Internal
   ● External  ← Select this
   
   [CREATE]
   ```

2. **App Information** (Page 1/4)
   ```
   App name:              BugTracker
   User support email:    your-email@gmail.com ▼
   
   Application home page: https://bug-tracker-saas.vercel.app
   
   Authorized domains:    
   [+ ADD DOMAIN]
   → vercel.app          [Enter]
   [+ ADD DOMAIN]  
   → onrender.com        [Enter]
   
   Developer contact:     your-email@gmail.com
   
   [SAVE AND CONTINUE]
   ```

3. **Scopes** (Page 2/4)
   ```
   Default scopes (already included):
   ✓ .../auth/userinfo.email
   ✓ .../auth/userinfo.profile  
   ✓ openid
   
   No need to add anything!
   
   [SAVE AND CONTINUE]
   ```

4. **Test Users** (Page 3/4) - Optional
   ```
   [+ ADD USERS]
   → your-email@gmail.com
   → friend@gmail.com
   [ADD]
   
   [SAVE AND CONTINUE]
   ```

5. **Summary** (Page 4/4)
   ```
   Review settings
   
   [BACK TO DASHBOARD]
   ```

✅ Done with consent screen!

---

## Step 2: Create Credentials

### Where to find it:
```
Left Menu → APIs & Services → Credentials
```

### What to do:

1. **Create OAuth Client ID**
   ```
   At top: [+ CREATE CREDENTIALS ▼]
           └─ OAuth client ID    ← Click this
   ```

2. **Configure Client**
   ```
   Application type: [Web application ▼]
   
   Name: BugTracker Web Client
   
   ┌─ Authorized JavaScript origins ─────────────┐
   │ [+ ADD URI]                                  │
   │ → https://bug-tracker-saas.onrender.com     │
   │   (your BACKEND URL)                         │
   └──────────────────────────────────────────────┘
   
   ┌─ Authorized redirect URIs ──────────────────┐
   │ [+ ADD URI]                                  │
   │ → https://bug-tracker-saas.onrender.com     │
   │   /api/auth/google/callback                  │
   │   (BACKEND URL + /api/auth/google/callback) │
   └──────────────────────────────────────────────┘
   
   [CREATE]
   ```

3. **Copy Credentials**
   ```
   ┌─────────────────────────────────────────┐
   │  OAuth client created                    │
   │                                          │
   │  Client ID:                              │
   │  123456-abc.apps.googleusercontent.com   │
   │  [copy icon]  ← Click to copy            │
   │                                          │
   │  Client Secret:                          │
   │  GOCSPX-abc123def456                     │
   │  [copy icon]  ← Click to copy            │
   │                                          │
   │            [OK]                          │
   └─────────────────────────────────────────┘
   ```

   **Save these somewhere!** You'll need them for Render.

✅ Done with credentials!

---

## Step 3: Add to Render

### Where to go:
```
Render Dashboard (dashboard.render.com)
    └─ bug-tracker-saas (your auth service)
        └─ Environment tab (left sidebar)
```

### What to add:

Click **[Add Environment Variable]** three times and add:

```
┌──────────────────────────────────────────┐
│ Key:   GOOGLE_CLIENT_ID                  │
│ Value: 123456-abc.apps.googleusercontent │
│        .com                               │
│                                [Add]      │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Key:   GOOGLE_CLIENT_SECRET              │
│ Value: GOCSPX-abc123def456               │
│                                [Add]      │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Key:   GOOGLE_CALLBACK_URL               │
│ Value: https://bug-tracker-saas.onrender │
│        .com/api/auth/google/callback     │
│                                [Add]      │
└──────────────────────────────────────────┘
```

Then click: **[Save Changes]**

### Deploy:
```
Top right: [Manual Deploy ▼]
            └─ Deploy latest commit
```

Wait 1-3 minutes for deployment.

---

## Step 4: Verify

### Check Render Logs:
```
Render → bug-tracker-saas → Logs tab

Look for:
🔑 Google OAuth: ✓ Configured  ← Should see this!
```

**If you see "✗ Not configured":**
- Variables didn't load
- Check spelling of variable names
- Redeploy

### Test Login:
```
1. Go to: https://bug-tracker-saas.vercel.app/auth/login
2. Click: [Sign in with Google]
3. Should redirect to Google
4. Choose account → Allow
5. Should redirect back → Logged in! ✓
```

---

## Common Screen Names in Google Console

You might see these terms:

| You search for | Official name | What it does |
|---------------|---------------|--------------|
| "oauth" | OAuth consent screen | Configure what users see |
| "credentials" | Credentials | Create OAuth client ID |
| "apis" | API Library | Enable APIs (usually not needed) |
| "client id" | OAuth 2.0 Client IDs | Your created credentials |

---

## Visual Checklist

Copy your credentials here for reference:

```
□ Project created: BugTracker

□ OAuth Consent Screen:
  □ Type: External
  □ App name: BugTracker
  □ Domains: vercel.app, onrender.com

□ OAuth Client Created:
  □ Type: Web application
  □ Client ID: _________________________________
  □ Client Secret: _____________________________

□ JavaScript origins:
  □ https://bug-tracker-saas.onrender.com

□ Redirect URIs:
  □ https://bug-tracker-saas.onrender.com/api/auth/google/callback

□ Added to Render:
  □ GOOGLE_CLIENT_ID
  □ GOOGLE_CLIENT_SECRET  
  □ GOOGLE_CALLBACK_URL

□ Tested login: Works! ✓
```

---

## Quick Troubleshooting

**Error: "redirect_uri_mismatch"**
```
Problem: Google can't find your callback URL
Fix: Check redirect URI is EXACTLY:
     https://bug-tracker-saas.onrender.com/api/auth/google/callback
     (no extra spaces, no trailing slash)
```

**Error: "Access blocked"**
```
Problem: Consent screen not configured properly
Fix: Go back to OAuth consent screen
     Make sure authorized domains include onrender.com
```

**Error: Backend shows "✗ Not configured"**
```
Problem: Credentials not in Render
Fix: Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
     Click Save Changes
     Redeploy service
```

---

Need the full detailed guide? See [GOOGLE_OAUTH_DETAILED.md](./GOOGLE_OAUTH_DETAILED.md)

**You got this!** 🚀
