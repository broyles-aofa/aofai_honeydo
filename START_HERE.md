# 🚀 START HERE - New AOFA App

**Welcome to the AOFA App Template!**

This template contains a **working Hello World app** that proves all your plumbing works:
- ✅ Next.js running
- ✅ Supabase connected
- ✅ Authentication working
- ✅ Database CRUD operations
- ✅ Deployable to Vercel

---

## 📋 **Setup Checklist**

### 1. Copy This Template (30 seconds)

```powershell
# Copy this entire template folder to your GitHub directory
cd C:\Users\Broyles\OneDrive\Documents\GitHub
Copy-Item -Path "path\to\template" -Destination "aofai_YOURAPP" -Recurse

cd aofai_YOURAPP
```

### 2. Run Initialization Script (1 minute)

```powershell
.\scripts\init-new-app.ps1
# This prompts for app name and updates all files
```

### 3. Install Dependencies (1 minute)

```powershell
cd web
npm install
cd ..
```

### 4. Create GitHub Repository (1 minute)

```powershell
gh repo create broyles-aofa/aofai_YOURAPP --public --source=. --remote=origin --push
```

### 5. Create Supabase Project (2 minutes - MANUAL)

1. Go to https://supabase.com/dashboard
2. Click **New Project**
3. Settings:
   - Name: `aofai-YOURAPP`
   - Database Password: [Use password manager - SAVE THIS!]
   - Region: `East US (Ohio)`
4. Wait ~2 minutes
5. Go to **Project Settings** → **API**
6. Copy:
   - **Project URL**: `https://xxx.supabase.co`
   - **Project Ref**: `xxx` (the subdomain)
   - **anon public key**: `eyJ...`

### 5b. Configure Google OAuth (5 minutes - MANUAL)

**Required for authentication to work!**

See `GOOGLE_OAUTH_SETUP.md` for detailed instructions, or quick steps:

1. **Google Cloud Console** (https://console.cloud.google.com/apis/credentials):
   - Create OAuth Client ID (Web application)
   - Add redirect URI: `https://xxx.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret

2. **Supabase Dashboard** (https://supabase.com/dashboard/project/xxx/auth/providers):
   - Enable Google provider
   - Paste Client ID and Client Secret
   - Save

### 6. Deploy to Vercel (5 minutes)

```powershell
# Link to Vercel (creates new project)
vercel link --yes

# Set Supabase URL
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste: https://xxx.supabase.co

# Set Supabase Anon Key
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste: eyJ...

# Pull env vars locally
vercel env pull web/.env.local --yes
```

**IMPORTANT: Configure Vercel Root Directory (MANUAL - 1 minute)**

Before deploying, you must configure Vercel to use the `web` folder:

1. Go to your Vercel project dashboard
2. Click **Settings** in the top navigation
3. Click **Build & Development** in the left sidebar (NOT General)
4. Scroll down to the **Root Directory** section
5. Click **Edit** (or the field will already be editable)
6. Enter: `web`
7. Click **Save**

**Then deploy to production:**

```powershell
# Deploy to production
vercel deploy --prod --yes
```

### 7. Configure DNS at Domain.com (5 minutes - MANUAL)

1. Go to https://www.domain.com/controlpanel
2. Select `aofa.ai` domain
3. Navigate to **DNS & Nameservers** → **DNS Records**
4. Click **Add DNS Record**
5. Settings:
   - **Type**: CNAME
   - **Host**: `YOURAPP`
   - **Points To**: `cname.vercel-dns.com`
   - **TTL**: 3600
6. Click **Save**

### 8. Add Domain to Vercel (1 minute)

```powershell
vercel domains add YOURAPP.aofa.ai --yes
```

Wait 10-30 minutes for DNS propagation.

### 9. Apply Database Schema (2 minutes)

```powershell
cd web

# Link to your Supabase project
supabase login
supabase link --project-ref YOUR_PROJECT_REF
# Enter database password when prompted

# Apply the schema (creates notes table)
supabase db push

# Verify
supabase db diff
# Should show no differences
```

### 10. Test the Hello World App (3 minutes)

```powershell
# Test locally first
cd web
npm run dev
```

Visit http://localhost:3001

**Test checklist:**
- [ ] Page loads
- [ ] See "Continue with Google" button
- [ ] Click Google sign-in
- [ ] Authenticate with Google account
- [ ] Redirected back to app, signed in
- [ ] Create a note
- [ ] See the note in the list
- [ ] Delete the note
- [ ] Sign out works

**Then test production:**
- [ ] Visit https://YOURAPP.aofa.ai (or Vercel URL if DNS pending)
- [ ] Repeat all tests above

---

## 🎯 **Starting a New Cursor Session**

### When you open this project in Cursor, use this EXACT prompt:

```
Read START_HERE.md, CREDENTIALS.md, AOFA_TEMPLATE_SYSTEM.md, and PATTERNS.md.

This is an AOFA template app using:
- Next.js 15 (React Server Components)
- Supabase (PostgreSQL + Auth)
- Vercel deployment
- Domain: YOURAPP.aofa.ai

The Hello World app (notes CRUD) is working and deployed.

I want to build: [DESCRIBE YOUR APP IDEA HERE]

First, confirm you understand the stack and current working state, then help me plan the features I need to add.
```

### What Cursor Will Do:
1. ✅ Read all documentation
2. ✅ Understand your stack
3. ✅ See the working Hello World app
4. ✅ Know the deployment process
5. ✅ Follow established patterns
6. ✅ Help you build on the working foundation

---

## 🏗️ **What's Included in This Template**

### Working Hello World App
- **Feature**: Simple notes app
- **Database**: `notes` table with RLS
- **Auth**: Email/password with Supabase
- **CRUD**: Create, read, delete notes
- **UI**: Clean Tailwind design
- **Responsive**: Works on mobile

### Complete Documentation
- `AOFA_TEMPLATE_SYSTEM.md` - Complete system guide
- `PATTERNS.md` - Code patterns to follow
- `CLI_AUTOMATION_GUIDE.md` - What's automatable
- `NEW_APP_CHECKLIST.md` - Detailed setup checklist
- `QUICK_REFERENCE.md` - One-page cheat sheet
- `.cursorrules` - Cursor AI configuration
- `CREDENTIALS.md` - Generated by init script

### Scripts
- `scripts/init-new-app.ps1` - Initialize new app
- `scripts/deploy.ps1` - Deploy to production (coming soon)

### Pre-configured
- Supabase client (browser & server)
- Authentication system
- Server actions pattern
- Database migrations
- Tailwind CSS
- Vercel configuration

---

## 🔄 **Daily Development Workflow**

Once setup is complete:

```powershell
# 1. Make changes in web/src/

# 2. Test locally
cd web
npm run dev

# 3. Commit and deploy
cd ..
git add -A
git commit -m "Add feature X"
git push origin main

# Vercel auto-deploys from main branch!
# Or manually: vercel deploy --prod --yes
```

---

## 🗄️ **Database Changes**

To add new tables or modify schema:

```powershell
# 1. Create migration file
# web/supabase/migrations/YYYYMMDD_description.sql

# 2. Apply migration
cd web
supabase db push

# 3. Commit migration
git add supabase/migrations/
git commit -m "Add new table"
git push
```

---

## 📚 **Documentation Guide**

| File | When to Read |
|------|--------------|
| **START_HERE.md** | First time setup |
| **AOFA_TEMPLATE_SYSTEM.md** | Understanding the system |
| **NEW_APP_CHECKLIST.md** | During initial setup |
| **PATTERNS.md** | When writing code |
| **QUICK_REFERENCE.md** | Daily reference |
| **CLI_AUTOMATION_GUIDE.md** | Understanding automation |
| **CREDENTIALS.md** | Generated - your app credentials |

---

## ✅ **Success Criteria**

Your setup is complete when:
- ✅ Hello World app works locally
- ✅ Hello World app works in production
- ✅ Can sign up/sign in
- ✅ Can create/delete notes
- ✅ Custom domain works (YOURAPP.aofa.ai)

**Then start building your actual features!**

---

## 🛟 **Troubleshooting**

### "Supabase connection error"
- Verify env vars: `cat web/.env.local`
- Check Supabase project is active (not paused)
- Re-run: `vercel env pull web/.env.local --yes`

### "DNS not working"
- Wait 30 minutes for propagation
- Check: `vercel domains ls`
- Verify CNAME at domain.com

### "Build fails"
- Run locally: `cd web && npm run build`
- Check error messages
- Verify all imports are correct

### "Auth not working"
- Check RLS policies in Supabase dashboard
- Verify users table exists
- Check Supabase logs

---

## 🎉 **You're Ready!**

**Total Setup Time**: ~20 minutes
**Manual Steps**: 2 (Supabase + DNS)
**Result**: Working production app

Now open in Cursor and start building! 🚀

---

**Template Version**: 1.0  
**Last Updated**: December 14, 2025  
**Created By**: Brian Broyles / AOFA

---

## 📋 **Quick Copy-Paste Commands**

### Complete Setup (Copy all at once)

```powershell
# Navigate and initialize
cd C:\Users\Broyles\OneDrive\Documents\GitHub\aofai_YOURAPP
.\scripts\init-new-app.ps1

# Install and create repo
cd web
npm install
cd ..
gh repo create broyles-aofa/aofai_YOURAPP --public --source=. --remote=origin --push

# Deploy to Vercel
vercel link --yes
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env pull web/.env.local --yes
vercel deploy --prod --yes

# Add domain
vercel domains add YOURAPP.aofa.ai --yes

# Apply database schema
cd web
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

**Remember to:**
1. Create Supabase project (dashboard)
2. Configure DNS (domain.com)
3. Replace `YOUR_PROJECT_REF` with actual value

---

**Now go build something amazing!** ✨

