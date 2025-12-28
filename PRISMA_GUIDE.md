# 🎓 Prisma First-Time Setup Guide

## What is Prisma?

**Prisma** is a modern database toolkit that makes it super easy to work with databases. Think of it as a friendly translator between your Node.js code and your PostgreSQL database.

### Why Prisma is Awesome:
- ✅ **Type-safe** - Catches database errors before runtime
- ✅ **Auto-completion** - Your IDE knows all your database tables
- ✅ **Easy queries** - No complex SQL needed
- ✅ **Migrations** - Tracks database changes like Git

---

## 🔍 Your Current Setup

✅ PostgreSQL 17 is running on your laptop
✅ Redis is installed
✅ Prisma schema is ready (8 models: User, Organization, Bug, etc.)
✅ Prisma Client is generated

---

## 📚 Prisma Concepts (Simple Explanation)

### 1. **Schema File** (`schema.prisma`)
This is like a blueprint of your database. It describes:
- What tables you have (User, Bug, Comment, etc.)
- What columns each table has
- How tables relate to each other

**We've already created this!** ✅

### 2. **Prisma Client**
This is the code that lets you talk to your database. Instead of writing SQL like:
```sql
SELECT * FROM users WHERE email = 'user@example.com'
```

You write JavaScript/TypeScript like:
```typescript
await prisma.user.findUnique({ where: { email: 'user@example.com' } })
```

**We've already generated this!** ✅ (That's what `npx prisma generate` did)

### 3. **Migrations**
Migrations are like "save points" for your database structure. When you change your schema, Prisma creates a migration file that:
- Records what changed
- Can apply those changes to your database
- Can undo them if needed

**This is what we'll do next!** ⏳

### 4. **Seeding**
Seeding means putting some initial test data into your empty database (like test users, sample bugs, etc.)

**We have a seed file ready!** ✅

---

## 🚀 Step-by-Step: What We'll Do Now

### Step 1: Create the Database
First, we need to create a new database called `bugtracker` in PostgreSQL.

### Step 2: Run Migrations
This will create all the tables (users, bugs, comments, etc.) in your database based on the schema.

### Step 3: Seed Test Data
This will add some test users and sample bugs so you can test the app immediately.

### Step 4: View Your Data
We'll use Prisma Studio (a visual database browser) to see everything.

---

## 🎯 Let's Start!

### Step 1: Create the Database

**Option A: Using pgAdmin (if installed)**
1. Open pgAdmin
2. Right-click on "Databases"
3. Create → Database
4. Name it: `bugtracker`
5. Click Save

**Option B: Using SQL Shell**
1. Open "SQL Shell (psql)" from Start menu
2. Press Enter for defaults (server, database, port, username)
3. Enter your PostgreSQL password
4. Run: `CREATE DATABASE bugtracker;`
5. Verify: `\l` (shows all databases)

**Option C: I'll create it via Prisma (easiest!)**
We can let Prisma create it automatically when we run migrations.

---

## 📝 What Each Prisma Command Does

### `npx prisma generate`
- **What it does:** Creates the Prisma Client code
- **When to use:** After changing schema.prisma
- **Output:** Code in node_modules/@prisma/client
- **Status:** ✅ Already done!

### `npx prisma migrate dev`
- **What it does:** 
  - Creates migration files
  - Creates database if it doesn't exist
  - Creates/updates all tables
  - Generates Prisma Client
- **When to use:** When setting up OR after schema changes
- **Output:** Migration files in prisma/migrations/
- **Status:** ⏳ We'll run this next!

### `npx prisma db push`
- **What it does:** Syncs schema to database WITHOUT creating migration files
- **When to use:** Quick prototyping, not for production
- **Status:** We'll use migrate instead

### `npx prisma studio`
- **What it does:** Opens a web-based database browser
- **When to use:** To view/edit data visually
- **Output:** Opens at http://localhost:5555
- **Status:** We'll use this after seeding!

### `npm run db:seed`
- **What it does:** Runs seed.js to add test data
- **When to use:** After migrations, to populate database
- **Status:** ⏳ We'll run this after migrations

---

## 🎯 Ready? Let's Run the Commands!

I'll help you execute these in the right order. Just say "ready" and I'll proceed! 🚀

---

## 🔧 Common Issues & Solutions

### Issue: "Can't connect to database"
**Solution:** Make sure PostgreSQL service is running
```powershell
Get-Service postgresql-x64-17
# Should show "Running"
```

### Issue: "Database already exists"
**Solution:** That's okay! Prisma will just use it

### Issue: "Migration failed"
**Solution:** 
```powershell
# Reset everything (WARNING: Deletes all data!)
cd prisma
npx prisma migrate reset

# Or drop and recreate database in pgAdmin
```

### Issue: "Prisma Client not found"
**Solution:**
```powershell
cd prisma
npx prisma generate
```

---

## 📚 Useful Prisma Commands Reference

```powershell
# Navigate to prisma folder
cd prisma

# View database in browser
npx prisma studio

# Create new migration after schema changes
npx prisma migrate dev --name describe_your_changes

# See all migrations
ls migrations

# Reset database (WARNING: Deletes everything!)
npx prisma migrate reset

# Generate Prisma Client (after schema changes)
npx prisma generate

# Validate schema syntax
npx prisma validate

# Format schema file
npx prisma format
```

---

## 🎓 After Setup: How to Use Prisma in Your Code

Once we're done, you'll use Prisma like this in your services:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create a user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    username: 'john',
    password: 'hashed_password'
  }
})

// Find users
const users = await prisma.user.findMany()

// Find one user
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
})

// Update user
await prisma.user.update({
  where: { id: userId },
  data: { firstName: 'John' }
})

// Delete user
await prisma.user.delete({
  where: { id: userId }
})

// Complex query with relations
const bugs = await prisma.bug.findMany({
  where: { status: 'OPEN' },
  include: {
    creator: true,      // Include user who created it
    assignee: true,     // Include assigned user
    comments: true      // Include all comments
  }
})
```

---

## ✅ What You'll Have After This

- ✅ PostgreSQL database named `bugtracker`
- ✅ 8 tables created (User, Organization, Bug, Comment, etc.)
- ✅ Test data: 3 users, 1 organization, 4 bugs, comments
- ✅ Prisma Client ready to use in your code
- ✅ Visual database browser (Prisma Studio)

---

**Ready to proceed? Just say "go" or "ready" and I'll run the setup commands!** 🚀
