# 🏗️ AOFA App Template

**Production-ready Next.js + Supabase starter with working Hello World app**

This template includes a **complete, working notes app** that proves your entire stack works out of the box. Clone it, configure credentials, and you're building features in 25 minutes.

---

## ⚡ Quick Start

```powershell
# 1. Copy this template to your GitHub directory
Copy-Item -Path "template" -Destination "C:\Users\Broyles\OneDrive\Documents\GitHub\aofai_YOURAPP" -Recurse
cd C:\Users\Broyles\OneDrive\Documents\GitHub\aofai_YOURAPP

# 2. Initialize (prompts for app name)
.\scripts\init-new-app.ps1

# 3. Install dependencies
cd web
npm install
cd ..

# 4. Follow the setup checklist
# Read: START_HERE.md
```

---

## ✅ What's Included

### Working Hello World App (Notes CRUD)
- ✅ Sign up / Sign in / Sign out
- ✅ Create notes
- ✅ List notes (newest first)
- ✅ Delete notes
- ✅ Row Level Security (RLS)
- ✅ Responsive design
- ✅ Dark mode support

This proves:
- Database connection works
- Authentication works
- Server Actions work
- RLS policies work
- Full stack is functional

### Complete Documentation
- **START_HERE.md** - Setup guide with exact commands
- **AOFA_TEMPLATE_SYSTEM.md** - Complete system overview
- **PATTERNS.md** - Code patterns to follow
- **CLI_AUTOMATION_GUIDE.md** - What's automatable
- **NEW_APP_CHECKLIST.md** - Step-by-step checklist
- **QUICK_REFERENCE.md** - One-page cheat sheet
- **.cursorrules** - Cursor AI configuration

### Production Stack
- **Next.js 15** - React Server Components
- **Supabase** - PostgreSQL + Auth
- **Tailwind CSS** - Utility-first styling
- **Vercel** - Zero-config deployment

---

## 📋 Setup Process (~25 minutes)

1. **Copy template** (30 sec)
2. **Run init script** (1 min)
3. **Create GitHub repo** (1 min)
4. **Create Supabase project** (2 min - manual)
5. **Deploy to Vercel** (3 min)
6. **Configure DNS** (5 min - manual)
7. **Add domain** (1 min)
8. **Apply schema** (2 min)
9. **Test app** (3 min)

**Result**: Working production app at `https://yourapp.aofa.ai`

---

## 🚀 Starting with Cursor

When you open your new app in Cursor, use this prompt:

```
Read START_HERE.md, CREDENTIALS.md, AOFA_TEMPLATE_SYSTEM.md, and PATTERNS.md.

This is an AOFA template app using:
- Next.js 15 (React Server Components)
- Supabase (PostgreSQL + Auth)
- Vercel deployment
- Domain: YOURAPP.aofa.ai

The Hello World app (notes CRUD) is working and deployed.

I want to build: [DESCRIBE YOUR APP IDEA]

First, confirm you understand the stack and current working state, then help me plan the features I need to add.
```

Cursor will:
- Understand your stack
- See the working foundation
- Follow established patterns
- Help you build on top

---

## 📁 Template Structure

```
template/
├── START_HERE.md              ⭐ Read this first
├── .cursorrules               🧠 AI configuration
├── .gitignore                 Ignore patterns
├── README.md                  This file
│
├── Documentation/
│   ├── AOFA_TEMPLATE_SYSTEM.md
│   ├── PATTERNS.md
│   ├── CLI_AUTOMATION_GUIDE.md
│   ├── NEW_APP_CHECKLIST.md
│   └── QUICK_REFERENCE.md
│
├── scripts/
│   └── init-new-app.ps1       App initialization
│
└── web/                       Next.js app
    ├── src/
    │   ├── app/
    │   │   ├── actions.js     Server actions
    │   │   ├── layout.js      Root layout
    │   │   ├── page.js        Homepage
    │   │   └── globals.css    Styles
    │   ├── components/
    │   │   ├── auth-panel.jsx
    │   │   ├── note-form.jsx
    │   │   └── notes-list.jsx
    │   └── lib/
    │       └── supabase/
    │           ├── client.js
    │           └── server.js
    │
    ├── supabase/
    │   └── schema.sql         Database schema
    │
    ├── package.json
    └── env.example
```

---

## 🎯 Use Cases

### Replace the Hello World App

Once you verify everything works, replace the notes app with your features:

1. Keep the auth system (`auth-panel.jsx`)
2. Keep Supabase clients (`lib/supabase/`)
3. Replace `notes` table with your tables
4. Replace components with your UI
5. Replace actions with your logic

### Build on Top

Or keep the notes as a "profile" feature and add more:

```sql
-- Add your new tables
create table public.your_table (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- your columns...
);
```

---

## ✅ Prerequisites

**Required CLIs:**
```powershell
node --version    # v18+
git --version
gh --version      # GitHub CLI
vercel --version  # Vercel CLI
supabase --version
```

**Logged In:**
```powershell
gh auth login
vercel login
supabase login
git config --global user.email "brian@aofa.ai"
```

---

## 🎉 Success Criteria

Your app is ready when:
- ✅ Builds without errors (`npm run build`)
- ✅ Deploys to Vercel
- ✅ Custom domain works
- ✅ Auth works (sign up/in/out)
- ✅ Notes CRUD works
- ✅ Mobile responsive

Then start building your features!

---

## 📚 Next Steps

1. **Read START_HERE.md** - Complete setup guide
2. **Run initialization** - `.\scripts\init-new-app.ps1`
3. **Follow checklist** - NEW_APP_CHECKLIST.md
4. **Test Hello World** - Verify stack works
5. **Open in Cursor** - Start building!

---

**Template Version**: 1.0  
**Created**: December 14, 2025  
**Author**: Brian Broyles / AOFA  
**License**: Private/Internal Use

**Ready to build 55 production apps!** 🚀

