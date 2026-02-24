# 🔐 Google OAuth Setup - Detailed Step-by-Step Guide

This guide provides detailed instructions for setting up Google OAuth for your BugTracker application.

---

## Prerequisites

- Google account
- Your production backend URL: `https://bug-tracker-saas.onrender.com`
- Your production frontend URL: `https://bug-tracker-saas.vercel.app`

---

## Part 1: Create Google Cloud Project

### Step 1: Access Google Cloud Console

1. Go to: **https://console.cloud.google.com/**
2. Sign in with your Google account

### Step 2: Create New Project

1. At the top of the page, click the **project dropdown** (next to "Google Cloud")
   - It might say "Select a project" if you haven't created one yet
2. In the dialog that opens, click **"NEW PROJECT"** (top right)
3. Fill in the project details:
   - **Project name**: `BugTracker` (or any name you prefer)
   - **Organization**: Leave as "No organization" (unless you have one)
   - **Location**: Leave as default
4. Click **"CREATE"**
5. Wait a few seconds for the project to be created
6. You'll see a notification when it's ready
7. Click **"SELECT PROJECT"** in the notification, or manually select it from the dropdown

✅ **Checkpoint**: You should now see "BugTracker" in the project dropdown at the top

---

## Part 2: Configure OAuth Consent Screen

**Why this matters**: Google requires you to configure what users see when they authorize your app.

### Step 1: Navigate to OAuth Consent Screen

1. In the left sidebar, click the **☰ hamburger menu** if it's collapsed
2. Navigate to: **APIs & Services** (hover over it)
3. Click on: **OAuth consent screen**

   **Can't find it?** 
   - Use the search bar at the top: Type "oauth consent"
   - Or go directly to: https://console.cloud.google.com/apis/credentials/consent

### Step 2: Choose User Type

You'll see two options:

1. **Internal** - Only for Google Workspace users (requires workspace)
2. **External** - For anyone with a Google account ✅ **Choose this**

- Select **"External"**
- Click **"CREATE"**

### Step 3: Fill OAuth Consent Screen (Page 1 - App Information)

Now you'll see a multi-step form:

#### Section: App information

- **App name**: `BugTracker` (or your preferred name)
  - This is what users see when authorizing
  
- **User support email**: Select your email from dropdown
  - This is shown to users if they have questions

- **App logo**: (Optional) You can upload a logo later
  - Skip for now

#### Section: App domain (Optional but recommended)

- **Application home page**: `https://bug-tracker-saas.vercel.app`
- **Application privacy policy link**: (Optional) Leave blank for now
- **Application terms of service link**: (Optional) Leave blank for now

#### Section: Authorized domains

- Click **"+ ADD DOMAIN"**
- Add: `vercel.app` (press Enter)
- Click **"+ ADD DOMAIN"** again
- Add: `onrender.com` (press Enter)

**Why add these?**
- Allows OAuth to work with your deployed frontend and backend

#### Section: Developer contact information

- **Email addresses**: Enter your email address
- Click **"+ ADD ANOTHER EMAIL"** if you want multiple contacts

Click **"SAVE AND CONTINUE"** at the bottom

### Step 4: Scopes (Page 2)

This page configures what data your app can access.

**Default scopes** (automatically included):
- `.../auth/userinfo.email` - User's email
- `.../auth/userinfo.profile` - User's basic profile info
- `openid` - For authentication

**Do you need to add scopes?** 
- ❌ **NO** - The default scopes are sufficient for authentication

Actions:
1. Review the default scopes (they should already be there)
2. Click **"SAVE AND CONTINUE"** at the bottom

### Step 5: Test Users (Page 3)

**When to add test users:**
- If your app is in "Testing" mode (default)
- Only these users can log in during testing

**Options:**

**Option A: Add Test Users** (Recommended for initial testing)
1. Click **"+ ADD USERS"**
2. Enter email addresses of people who should test (including your own)
3. Click **"ADD"**
4. Click **"SAVE AND CONTINUE"**

**Option B: Skip for Now**
1. Just click **"SAVE AND CONTINUE"**
2. You can add test users later if needed

### Step 6: Summary (Page 4)

Review your settings:
- App name: BugTracker
- User type: External
- Authorized domains: vercel.app, onrender.com

Click **"BACK TO DASHBOARD"**

✅ **Checkpoint**: You should see "OAuth consent screen configured" with your app name

---

## Part 3: Create OAuth Credentials

### Step 1: Navigate to Credentials Page

1. In the left sidebar, click **APIs & Services**
2. Click **Credentials**
   
   Or go directly to: https://console.cloud.google.com/apis/credentials

### Step 2: Create OAuth Client ID

1. At the top, click **"+ CREATE CREDENTIALS"**
2. From the dropdown, select **"OAuth client ID"**

**If you see a warning**: "To create an OAuth client ID, you must first configure your consent screen"
- Go back to Part 2 and complete the OAuth consent screen setup

### Step 3: Configure OAuth Client

You'll see a form with these fields:

#### Application type
- Select dropdown: **"Web application"** ✅

#### Name
- Enter: `BugTracker Web Client` (or any descriptive name)
- This is just for your reference in Google Cloud Console

#### Authorized JavaScript origins

**What is this?** URLs where your backend OAuth requests originate from

1. Click **"+ ADD URI"** under "Authorized JavaScript origins"
2. Enter: `https://bug-tracker-saas.onrender.com` (your BACKEND URL)
3. Press Enter or click outside the field

**For development** (optional):
- Click **"+ ADD URI"** again
- Enter: `http://localhost:5001`

#### Authorized redirect URIs

**What is this?** Where Google sends users after they authorize your app

1. Click **"+ ADD URI"** under "Authorized redirect URIs"
2. Enter: `https://bug-tracker-saas.onrender.com/api/auth/google/callback`
   - ⚠️ **CRITICAL**: Must include `/api/auth/google/callback` at the end
   - ⚠️ **CRITICAL**: This is your BACKEND URL, not frontend!
3. Press Enter or click outside the field

**For development** (optional):
- Click **"+ ADD URI"** again
- Enter: `http://localhost:5001/api/auth/google/callback`

#### Summary of what you should have:

```
Application type: Web application
Name: BugTracker Web Client

Authorized JavaScript origins:
✓ https://bug-tracker-saas.onrender.com
✓ http://localhost:5001 (optional, for local dev)

Authorized redirect URIs:
✓ https://bug-tracker-saas.onrender.com/api/auth/google/callback
✓ http://localhost:5001/api/auth/google/callback (optional, for local dev)
```

### Step 4: Create and Get Credentials

1. Click **"CREATE"** at the bottom
2. A dialog will pop up showing your credentials:

```
OAuth client created
Your Client ID: 123456789-abcdefghijklmnop.apps.googleusercontent.com
Your Client Secret: GOCSPX-abc123def456ghi789jkl
```

3. **Copy these immediately!**
   - Click the **copy icon** next to "Your Client ID"
   - Save it somewhere (text file, password manager)
   - Click the **copy icon** next to "Your Client Secret"
   - Save it somewhere secure

4. Click **"OK"** to close the dialog

**Lost your credentials?**
- Don't worry! You can always retrieve them:
  1. Go to Credentials page
  2. Find your "BugTracker Web Client" in the "OAuth 2.0 Client IDs" section
  3. Click on the name to see Client ID
  4. Click "DOWNLOAD JSON" or view/reset client secret

✅ **Checkpoint**: You now have:
- ✅ Client ID (looks like: `123456789-abc...apps.googleusercontent.com`)
- ✅ Client Secret (looks like: `GOCSPX-abc123...`)

---

## Part 4: Enable Required APIs

Google OAuth might need certain APIs enabled.

### Option 1: Check if APIs are enabled

1. Go to: **APIs & Services** → **Library**
2. Search for: "Google+ API" or "People API"
3. If you see "ENABLE" button, click it
4. If you see "MANAGE" button, it's already enabled ✅

### Option 2: Enable APIs via direct links

- **People API**: https://console.cloud.google.com/apis/library/people.googleapis.com
  - Click **"ENABLE"** if not enabled
  
- **Google+ API** (legacy, might not be needed):
  - If you see errors about Google+ API, enable it
  - Otherwise, skip this

✅ **Note**: Modern Google OAuth might work without explicitly enabling these APIs

---

## Part 5: Add Credentials to Your Backend

Now that you have your credentials, add them to your Render service.

### Step 1: Go to Render Dashboard

1. Go to: https://dashboard.render.com/
2. Find your **bug-tracker-saas** service (auth service)
3. Click on it

### Step 2: Add Environment Variables

1. Click the **"Environment"** tab on the left
2. Click **"Add Environment Variable"** button

Add these THREE variables:

#### Variable 1: GOOGLE_CLIENT_ID
```
Key: GOOGLE_CLIENT_ID
Value: [paste your Client ID from Google]
Example: 123456789-abcdefg.apps.googleusercontent.com
```

#### Variable 2: GOOGLE_CLIENT_SECRET
```
Key: GOOGLE_CLIENT_SECRET
Value: [paste your Client Secret from Google]
Example: GOCSPX-abc123def456
```

#### Variable 3: GOOGLE_CALLBACK_URL
```
Key: GOOGLE_CALLBACK_URL
Value: https://bug-tracker-saas.onrender.com/api/auth/google/callback
```

### Step 3: Verify Other Required Variables

Make sure these are also set:

```
FRONTEND_URL=https://bug-tracker-saas.vercel.app
CORS_ORIGIN=https://bug-tracker-saas.vercel.app
```

### Step 4: Save and Deploy

1. Click **"Save Changes"** (if there's a save button)
2. Go to the **"Manual Deploy"** dropdown at the top
3. Click **"Deploy latest commit"**
4. Wait for deployment to complete (1-3 minutes)

---

## Part 6: Test Your Setup

### Step 1: Check Backend Logs

1. In Render, go to your **bug-tracker-saas** service
2. Click the **"Logs"** tab
3. Look for these lines after deployment:

```
🔐 Auth Service running on port 5001
📊 Environment: production
🌐 Allowed Origins: https://bug-tracker-saas.vercel.app
🔑 GitHub OAuth: ✓ Configured (or ✗ Not configured)
🔑 Google OAuth: ✓ Configured  ← Should show this!
```

**If you see "✗ Not configured":**
- Credentials weren't loaded properly
- Double-check variable names (must be exact)
- Make sure you saved and redeployed
- Check for typos in the values

### Step 2: Test OAuth Flow

1. Go to: `https://bug-tracker-saas.vercel.app/auth/login`
2. Click the **"Sign in with Google"** button
3. You should be redirected to Google's login page
4. Select your Google account
5. You'll see a consent screen showing:
   - App name: "BugTracker"
   - What it will access: email, profile info
6. Click **"Continue"** or **"Allow"**
7. You should be redirected back to your app
8. Check if you're logged in and redirected to dashboard

### Step 3: Verify Success

✅ **Success looks like:**
- Redirected to Google
- Consent screen appears
- After allowing, redirected back to your app
- Logged in successfully
- Toast notification: "Login successful! Welcome..."

❌ **Common errors and fixes:**

**Error: "redirect_uri_mismatch"**
```
Fix: Check that redirect URI in Google Console EXACTLY matches:
https://bug-tracker-saas.onrender.com/api/auth/google/callback
```

**Error: "Access blocked: This app's request is invalid"**
```
Fix: Make sure OAuth consent screen is configured
Check authorized domains include vercel.app and onrender.com
```

**Error: "Backend not configured"**
```
Fix: Environment variables not loaded
Check Render environment variables
Redeploy after adding variables
```

**Error: CORS issues**
```
Fix: Add CORS_ORIGIN to Render environment variables
Value: https://bug-tracker-saas.vercel.app
```

---

## Part 7: Publishing Your App (Optional)

By default, your app is in "Testing" mode with a user limit.

### To publish your app:

1. Go to: **APIs & Services** → **OAuth consent screen**
2. You'll see a banner: "Publishing status: Testing"
3. Click **"PUBLISH APP"** button
4. Review the warning and click **"CONFIRM"**

**What changes:**
- Any Google user can now authenticate
- No need to add test users
- App will go through Google's verification if requesting sensitive scopes (not needed for basic profile/email)

**Do you need to publish?**
- ✅ Yes, for production with many users
- ❌ Not immediately - you can test with up to 100 test users

---

## Quick Reference

### Your Google OAuth Settings:

```yaml
Project Name: BugTracker
Consent Screen: External
Status: Testing (or Published)

Authorized Domains:
  - vercel.app
  - onrender.com

OAuth Client Type: Web application
Authorized JavaScript Origins:
  - https://bug-tracker-saas.onrender.com

Authorized Redirect URIs:
  - https://bug-tracker-saas.onrender.com/api/auth/google/callback
```

### Your Render Environment Variables:

```bash
GOOGLE_CLIENT_ID=123456789-abc...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123...
GOOGLE_CALLBACK_URL=https://bug-tracker-saas.onrender.com/api/auth/google/callback
FRONTEND_URL=https://bug-tracker-saas.vercel.app
CORS_ORIGIN=https://bug-tracker-saas.vercel.app
```

---

## Troubleshooting Checklist

Go through this checklist if things aren't working:

- [ ] Created Google Cloud project
- [ ] Configured OAuth consent screen (External)
- [ ] Added authorized domains (vercel.app, onrender.com)
- [ ] Created OAuth client ID (Web application type)
- [ ] Added JavaScript origin: `https://bug-tracker-saas.onrender.com`
- [ ] Added redirect URI: `https://bug-tracker-saas.onrender.com/api/auth/google/callback`
- [ ] Copied Client ID and Client Secret
- [ ] Added GOOGLE_CLIENT_ID to Render
- [ ] Added GOOGLE_CLIENT_SECRET to Render
- [ ] Added GOOGLE_CALLBACK_URL to Render
- [ ] Redeployed Render service
- [ ] Checked Render logs show "✓ Configured"
- [ ] Tested login flow

---

## Need More Help?

**Google Cloud Console**: https://console.cloud.google.com/
**OAuth Consent Screen**: https://console.cloud.google.com/apis/credentials/consent
**Credentials Page**: https://console.cloud.google.com/apis/credentials

**Common Issues Doc**: See [OAUTH_PRODUCTION.md](./OAUTH_PRODUCTION.md) for more troubleshooting

---

**You're all set!** Your Google OAuth should now be working in production! 🎉
