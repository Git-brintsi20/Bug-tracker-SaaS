# 🚀 Complete Startup & Testing Guide

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- ✅ Node.js 18+ installed
- ✅ Docker Desktop installed and running
- ✅ PNPM or NPM installed
- ✅ PostgreSQL and Redis running (via Docker)

---

## 🏁 Part 1: Starting the Full Application

### Step 1: Start Docker Services (PostgreSQL & Redis)

Open PowerShell in project root:

```powershell
# Start Docker services
docker-compose up -d

# Verify services are running
docker ps
```

You should see:
- PostgreSQL running on port **5432**
- Redis running on port **6379**

### Step 2: Set Up Database

```powershell
# Navigate to Prisma folder
cd prisma

# Install dependencies if not already installed
npm install

# Run migrations to create database tables
npx prisma migrate dev --name init

# Seed the database with test data
npx prisma db seed

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### Step 3: Install Dependencies for All Services

```powershell
# Go to project root
cd ..

# Install Auth Service dependencies
cd services/auth-service
npm install

# Install Bug Service dependencies
cd ../bug-service
npm install

# Install Notification Service dependencies
cd ../notification-service
npm install

# Install Frontend dependencies
cd ../../
pnpm install
```

### Step 4: Configure Environment Variables

#### Auth Service (.env)
Create `services/auth-service/.env`:
```env
PORT=5001
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bugtracker"
JWT_SECRET="dcae56f31adcb075c3c3d9e828ec34098fd0ae3f64287381bf569f04879c9ba8"
JWT_REFRESH_SECRET="your-refresh-secret-here-change-in-production"
CORS_ORIGIN="http://localhost:3000"

# OAuth (Optional - for OAuth testing)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5001/api/auth/github/callback

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

FRONTEND_URL=http://localhost:3000
```

#### Bug Service (.env)
Create `services/bug-service/.env`:
```env
PORT=5002
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bugtracker"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="dcae56f31adcb075c3c3d9e828ec34098fd0ae3f64287381bf569f04879c9ba8"
CORS_ORIGIN="http://localhost:3000"
```

#### Notification Service (.env)
Create `services/notification-service/.env`:
```env
PORT=5003
NODE_ENV=development
REDIS_URL="redis://localhost:6379"
CORS_ORIGIN="http://localhost:3000"
```

#### Frontend (.env.local)
Create `.env.local` in root:
```env
NEXT_PUBLIC_AUTH_API_URL=http://localhost:5001/api
NEXT_PUBLIC_BUG_API_URL=http://localhost:5002/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5003
```

### Step 5: Start All Services

Open **4 separate PowerShell terminals**:

#### Terminal 1 - Auth Service
```powershell
cd services/auth-service
npm run dev
```
✅ Should see: `🔐 Auth Service running on port 5001`

#### Terminal 2 - Bug Service
```powershell
cd services/bug-service
npm run dev
```
✅ Should see: `🐛 Bug Service running on port 5002`

#### Terminal 3 - Notification Service
```powershell
cd services/notification-service
npm run dev
```
✅ Should see: `🔔 Notification Service running on port 5003`

#### Terminal 4 - Frontend (Next.js)
```powershell
# From project root
pnpm dev
```
✅ Should see: `✓ Ready on http://localhost:3000`

### Step 6: Verify All Services

Open your browser and check:
- ✅ Frontend: http://localhost:3000
- ✅ Auth API Health: http://localhost:5001/health
- ✅ Bug API Health: http://localhost:5002/health

---

## 🧪 Part 2: Complete Feature Testing Checklist

### 🔐 Authentication & Authorization Tests

#### Test 1: User Registration
**Endpoint:** `POST http://localhost:5001/api/auth/register`

**Test with Postman/Thunder Client:**
```json
POST http://localhost:5001/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "username": "testuser",
  "password": "Test123!@#",
  "firstName": "Test",
  "lastName": "User"
}
```

**Expected Result:**
- ✅ Status 201
- ✅ Returns user object with `accessToken` and `refreshToken`
- ✅ Password is hashed (not returned)

#### Test 2: User Login
```json
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!@#"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Returns `accessToken` and `refreshToken`
- ✅ User object with profile data

**Save the `accessToken` for subsequent tests!**

#### Test 3: Get Current User (Protected Route)
```json
GET http://localhost:5001/api/auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Status 200
- ✅ Returns current user profile

#### Test 4: Token Refresh
```json
POST http://localhost:5001/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Returns new `accessToken`

---

### 🏢 Organization Management Tests

#### Test 5: Create Organization
```json
POST http://localhost:5001/api/organizations
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "Test Company",
  "description": "Our test organization"
}
```

**Expected Result:**
- ✅ Status 201
- ✅ Returns organization object
- ✅ Creator is automatically added as ADMIN

**Save the organization ID for subsequent tests!**

#### Test 6: Get User's Organizations
```json
GET http://localhost:5001/api/organizations
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Status 200
- ✅ Returns array of organizations user belongs to

#### Test 7: Invite Member to Organization
```json
POST http://localhost:5001/api/organizations/{ORG_ID}/invite
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "email": "newmember@example.com",
  "role": "DEVELOPER"
}
```

**Expected Result:**
- ✅ Status 201
- ✅ New member added to organization

---

### 🐛 Bug Management Tests

#### Test 8: Create Bug
```json
POST http://localhost:5002/api/bugs
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "Login button not working",
  "description": "When users click login, nothing happens",
  "priority": "HIGH",
  "status": "OPEN",
  "organizationId": "YOUR_ORG_ID"
}
```

**Expected Result:**
- ✅ Status 201
- ✅ Returns created bug object
- ✅ Reporter is automatically set to current user

**Save the bug ID for subsequent tests!**

#### Test 9: Get All Bugs (With Caching)
```json
GET http://localhost:5002/api/bugs?organizationId=YOUR_ORG_ID
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Status 200
- ✅ Returns array of bugs
- ✅ Second request should be faster (cache hit)

**Check Redis cache:**
```powershell
docker exec -it bugtracker-redis redis-cli
KEYS bugs:org:*
GET bugs:org:YOUR_ORG_ID:all
```

#### Test 10: Get Single Bug
```json
GET http://localhost:5002/api/bugs/{BUG_ID}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Status 200
- ✅ Returns bug with reporter and assignee details

#### Test 11: Update Bug
```json
PATCH http://localhost:5002/api/bugs/{BUG_ID}
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "priority": "CRITICAL"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Bug updated successfully
- ✅ Cache invalidated

#### Test 12: Delete Bug
```json
DELETE http://localhost:5002/api/bugs/{BUG_ID}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Status 200
- ✅ Bug deleted successfully

---

### 💬 Comment System Tests

#### Test 13: Create Comment
```json
POST http://localhost:5002/api/bugs/{BUG_ID}/comments
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "content": "I'm investigating this issue now."
}
```

**Expected Result:**
- ✅ Status 201
- ✅ Returns comment object with author details

#### Test 14: Get All Comments
```json
GET http://localhost:5002/api/bugs/{BUG_ID}/comments
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Status 200
- ✅ Returns array of comments ordered by creation date

#### Test 15: Update Comment
```json
PATCH http://localhost:5002/api/bugs/{BUG_ID}/comments/{COMMENT_ID}
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "content": "Updated: Issue is related to authentication service."
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Comment updated

#### Test 16: Delete Comment
```json
DELETE http://localhost:5002/api/bugs/{BUG_ID}/comments/{COMMENT_ID}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Status 200
- ✅ Comment deleted

---

### 🏷️ **NEW** Labels & Tags Tests

#### Test 17: Create Label
```json
POST http://localhost:5002/api/organizations/{ORG_ID}/labels
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "bug",
  "color": "#ef4444",
  "description": "Bug issues"
}
```

**Expected Result:**
- ✅ Status 201
- ✅ Returns label object

**Save label ID for subsequent tests!**

#### Test 18: Get All Labels
```json
GET http://localhost:5002/api/organizations/{ORG_ID}/labels
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Status 200
- ✅ Returns array of labels sorted by name

#### Test 19: Update Label
```json
PUT http://localhost:5002/api/labels/{LABEL_ID}
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "critical-bug",
  "color": "#dc2626"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Label updated

#### Test 20: Add Label to Bug
```json
POST http://localhost:5002/api/bugs/{BUG_ID}/labels/{LABEL_ID}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Status 200
- ✅ Label associated with bug
- ✅ Cache invalidated

#### Test 21: Remove Label from Bug
```json
DELETE http://localhost:5002/api/bugs/{BUG_ID}/labels/{LABEL_ID}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Status 200
- ✅ Label removed from bug

#### Test 22: Delete Label
```json
DELETE http://localhost:5002/api/labels/{LABEL_ID}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Status 200
- ✅ Label deleted
- ✅ Automatically removed from all bugs

---

### 📎 **NEW** File Attachments Tests

#### Test 23: Upload Attachment
```json
POST http://localhost:5002/api/bugs/{BUG_ID}/attachments
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: multipart/form-data

Form Data:
- file: [Select a file - image, PDF, or document]
```

**Expected Result:**
- ✅ Status 201
- ✅ Returns attachment object with file details
- ✅ File saved in `services/bug-service/uploads/` folder

#### Test 24: Get All Attachments
```json
GET http://localhost:5002/api/bugs/{BUG_ID}/attachments
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Status 200
- ✅ Returns array of attachments with uploader info

#### Test 25: Download Attachment
```json
GET http://localhost:5002/api/bugs/{BUG_ID}/attachments/{ATTACHMENT_ID}/download
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ File downloads successfully
- ✅ Original filename preserved

#### Test 26: Delete Attachment
```json
DELETE http://localhost:5002/api/bugs/{BUG_ID}/attachments/{ATTACHMENT_ID}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Status 200
- ✅ Attachment deleted from database
- ✅ File removed from filesystem

#### Test 27: File Type Validation
Try uploading an invalid file type (e.g., .exe):

**Expected Result:**
- ✅ Status 400
- ✅ Error: "File type not allowed"

#### Test 28: File Size Validation
Try uploading a file > 10MB:

**Expected Result:**
- ✅ Status 400
- ✅ Error: File size limit exceeded

---

### 📊 **NEW** Export Reports Tests

#### Test 29: Export Bugs as CSV
```json
GET http://localhost:5002/api/organizations/{ORG_ID}/export/csv
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Optional Query Parameters:**
- `?status=OPEN`
- `?priority=HIGH`
- `?assigneeId=USER_ID`

**Expected Result:**
- ✅ CSV file downloads
- ✅ Contains all bug fields
- ✅ Properly formatted with headers

#### Test 30: Export Bugs as PDF
```json
GET http://localhost:5002/api/organizations/{ORG_ID}/export/pdf
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ PDF file downloads
- ✅ Contains organization name
- ✅ Summary statistics section
- ✅ Detailed bug list
- ✅ Professional formatting

#### Test 31: Export with Filters
```json
GET http://localhost:5002/api/organizations/{ORG_ID}/export/csv?status=OPEN,IN_PROGRESS&priority=HIGH,CRITICAL
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Only bugs matching filters are exported

---

### 🔍 **NEW** Advanced Search Tests

#### Test 32: Full-Text Search
```json
GET http://localhost:5002/api/organizations/{ORG_ID}/search?query=login
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Status 200
- ✅ Returns bugs with "login" in title or description
- ✅ Case-insensitive search

#### Test 33: Filter by Status (Multiple)
```json
GET http://localhost:5002/api/organizations/{ORG_ID}/search?status=OPEN&status=IN_PROGRESS
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Returns only bugs with OPEN or IN_PROGRESS status

#### Test 34: Filter by Priority
```json
GET http://localhost:5002/api/organizations/{ORG_ID}/search?priority=HIGH&priority=CRITICAL
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Returns only high and critical priority bugs

#### Test 35: Date Range Filter
```json
GET http://localhost:5002/api/organizations/{ORG_ID}/search?dateFrom=2025-01-01&dateTo=2025-12-31
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Returns bugs created within date range

#### Test 36: Combined Filters
```json
GET http://localhost:5002/api/organizations/{ORG_ID}/search?query=bug&status=OPEN&priority=HIGH&page=1&limit=10
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Returns bugs matching all criteria
- ✅ Paginated results
- ✅ Includes total count and pagination info

#### Test 37: Search Suggestions (Autocomplete)
```json
GET http://localhost:5002/api/organizations/{ORG_ID}/search/suggestions?query=log
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Returns up to 10 matching bug titles
- ✅ Ordered by most recent

---

### 🔄 **NEW** Bulk Operations Tests

#### Test 38: Bulk Update Status
```json
POST http://localhost:5002/api/bugs/bulk/status
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "bugIds": ["bug_id_1", "bug_id_2", "bug_id_3"],
  "status": "IN_PROGRESS"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Returns count of updated bugs
- ✅ All bugs updated to IN_PROGRESS

#### Test 39: Bulk Update Priority
```json
POST http://localhost:5002/api/bugs/bulk/priority
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "bugIds": ["bug_id_1", "bug_id_2"],
  "priority": "CRITICAL"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ All specified bugs updated to CRITICAL priority

#### Test 40: Bulk Assign
```json
POST http://localhost:5002/api/bugs/bulk/assign
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "bugIds": ["bug_id_1", "bug_id_2"],
  "assigneeId": "USER_ID"
}
```

**Expected Result:**
- ✅ Status 200
- ✅ All bugs assigned to specified user

#### Test 41: Bulk Delete
```json
POST http://localhost:5002/api/bugs/bulk/delete
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "bugIds": ["bug_id_1", "bug_id_2"]
}
```

**Expected Result:**
- ✅ Status 200
- ✅ All specified bugs deleted
- ✅ Associated comments and attachments also deleted

#### Test 42: Bulk Add Labels
```json
POST http://localhost:5002/api/bugs/bulk/labels
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "bugIds": ["bug_id_1", "bug_id_2", "bug_id_3"],
  "labelIds": ["label_id_1", "label_id_2"]
}
```

**Expected Result:**
- ✅ Status 200
- ✅ Labels added to all specified bugs

---

### 🔐 **NEW** OAuth Authentication Tests

#### Test 43: GitHub OAuth Flow

**Manual Testing in Browser:**
1. Navigate to: `http://localhost:5001/api/auth/github`
2. Authorize with GitHub
3. Should redirect to: `http://localhost:3000/auth/callback?token=...&refreshToken=...`

**Expected Result:**
- ✅ New user created if first login
- ✅ GitHub ID linked to user account
- ✅ Tokens returned in URL

**Note:** Requires GitHub OAuth App setup with credentials in `.env`

#### Test 44: Google OAuth Flow

**Manual Testing in Browser:**
1. Navigate to: `http://localhost:5001/api/auth/google`
2. Sign in with Google
3. Should redirect with tokens

**Expected Result:**
- ✅ New user created if first login
- ✅ Google ID linked to user account
- ✅ Email verified automatically

**Note:** Requires Google OAuth App setup with credentials in `.env`

---

### ⚡ Real-Time Notifications Tests

#### Test 45: Socket.io Connection

**Use Socket.io Client or Browser Console:**
```javascript
// In browser console at http://localhost:3000
import io from 'socket.io-client';

const socket = io('http://localhost:5003', {
  auth: {
    token: 'YOUR_ACCESS_TOKEN'
  }
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

// Join organization room
socket.emit('join-organization', 'YOUR_ORG_ID');

// Listen for bug events
socket.on('bug-created', (data) => {
  console.log('New bug created:', data);
});

socket.on('bug-updated', (data) => {
  console.log('Bug updated:', data);
});

socket.on('bug-deleted', (data) => {
  console.log('Bug deleted:', data);
});

socket.on('comment-added', (data) => {
  console.log('New comment:', data);
});
```

**Expected Result:**
- ✅ Socket connects successfully
- ✅ Joins organization room
- ✅ Receives real-time events when bugs are created/updated/deleted

#### Test 46: Real-Time Bug Update
1. Open two browser tabs
2. Create a bug in Tab 1
3. Check Tab 2

**Expected Result:**
- ✅ Tab 2 immediately shows new bug without refresh

---

### 📊 Statistics & Analytics Tests

#### Test 47: Get Bug Statistics
```json
GET http://localhost:5002/api/statistics?organizationId=YOUR_ORG_ID
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Result:**
- ✅ Status 200
- ✅ Returns status breakdown (open, in_progress, etc.)
- ✅ Returns priority breakdown
- ✅ Returns assignment statistics

---

### 🎨 Frontend Integration Tests

#### Test 48: Login via UI
1. Navigate to `http://localhost:3000/auth/login`
2. Enter credentials and submit

**Expected Result:**
- ✅ Redirects to dashboard on success
- ✅ Shows error message on invalid credentials
- ✅ Token stored in localStorage

#### Test 49: Create Bug via UI
1. Navigate to issues page
2. Click "Create Bug" button
3. Fill form and submit

**Expected Result:**
- ✅ Bug appears in list immediately
- ✅ Shows success toast notification
- ✅ Real-time update to other connected clients

#### Test 50: View Bug Details
1. Click on a bug in the list
2. Modal/page opens with details

**Expected Result:**
- ✅ Shows all bug information
- ✅ Shows comments section
- ✅ Shows attachments section
- ✅ Shows labels

---

## 🐛 Common Issues & Troubleshooting

### Issue 1: Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5001`

**Solution:**
```powershell
# Find process using the port
netstat -ano | findstr :5001

# Kill the process
taskkill /PID <PID> /F
```

### Issue 2: Docker Services Not Starting
```powershell
# Check Docker status
docker ps

# Restart Docker Desktop
# Then run:
docker-compose down
docker-compose up -d
```

### Issue 3: Database Connection Error
```powershell
# Check PostgreSQL is running
docker ps | findstr postgres

# Test connection
docker exec -it bugtracker-postgres psql -U postgres -d bugtracker
```

### Issue 4: Redis Connection Error
```powershell
# Check Redis is running
docker ps | findstr redis

# Test Redis connection
docker exec -it bugtracker-redis redis-cli ping
# Should return: PONG
```

### Issue 5: JWT Token Invalid
- Ensure `JWT_SECRET` is the same in both auth-service and bug-service
- Token expires after 1 hour (refresh or re-login)

### Issue 6: CORS Errors
- Verify `CORS_ORIGIN` is set to `http://localhost:3000` in all services
- Check browser console for specific CORS errors

---

## ✅ Testing Summary Checklist

Use this checklist to track your testing progress:

### Authentication (6 tests)
- [ ] User Registration
- [ ] User Login
- [ ] Get Current User
- [ ] Token Refresh
- [ ] Logout
- [ ] Protected Route Access

### Organization Management (3 tests)
- [ ] Create Organization
- [ ] List Organizations
- [ ] Invite Members

### Bug Management (5 tests)
- [ ] Create Bug
- [ ] List Bugs (with caching)
- [ ] Get Single Bug
- [ ] Update Bug
- [ ] Delete Bug

### Comments (4 tests)
- [ ] Create Comment
- [ ] List Comments
- [ ] Update Comment
- [ ] Delete Comment

### Labels & Tags (6 tests)
- [ ] Create Label
- [ ] List Labels
- [ ] Update Label
- [ ] Add Label to Bug
- [ ] Remove Label from Bug
- [ ] Delete Label

### File Attachments (6 tests)
- [ ] Upload File
- [ ] List Attachments
- [ ] Download File
- [ ] Delete Attachment
- [ ] File Type Validation
- [ ] File Size Validation

### Export Reports (3 tests)
- [ ] Export as CSV
- [ ] Export as PDF
- [ ] Export with Filters

### Advanced Search (6 tests)
- [ ] Full-text Search
- [ ] Filter by Status
- [ ] Filter by Priority
- [ ] Date Range Filter
- [ ] Combined Filters
- [ ] Search Suggestions

### Bulk Operations (5 tests)
- [ ] Bulk Update Status
- [ ] Bulk Update Priority
- [ ] Bulk Assign
- [ ] Bulk Delete
- [ ] Bulk Add Labels

### OAuth (2 tests)
- [ ] GitHub OAuth
- [ ] Google OAuth

### Real-Time (2 tests)
- [ ] Socket Connection
- [ ] Real-Time Updates

### Statistics (1 test)
- [ ] Get Bug Statistics

### Frontend Integration (3 tests)
- [ ] Login via UI
- [ ] Create Bug via UI
- [ ] View Bug Details

**Total: 52 Tests** ✨

---

## 🎉 Success Criteria

Your application is working correctly if:
- ✅ All 4 services start without errors
- ✅ Can register and login users
- ✅ Can create and manage bugs
- ✅ Real-time updates work
- ✅ File uploads work
- ✅ Exports generate correctly
- ✅ Search returns accurate results
- ✅ Bulk operations execute successfully
- ✅ No console errors in browser
- ✅ Redis caching reduces database load

---

## 📞 Need Help?

If you encounter issues:
1. Check the terminal logs for error messages
2. Verify all environment variables are set correctly
3. Ensure Docker services are running
4. Check browser console for frontend errors
5. Test API endpoints individually with Postman

Happy Testing! 🚀
