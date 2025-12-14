# 🏗️ AOFA App Template System
## From Idea to Production in 30 Minutes

**Version**: 1.0  
**Last Updated**: December 14, 2025  
**Purpose**: Standardized workflow for creating production-ready apps on the AOFA platform

---

## 📋 Technology Stack Overview

| Service | Purpose | Automation Level | CLI Tool |
|---------|---------|------------------|----------|
| **GitHub** | Code storage | 95% | `git`, `gh` |
| **Vercel** | Deployment & hosting | 100% | `vercel` |
| **Supabase** | Database & storage | 90% | `supabase` |
| **Domain.com** | DNS management | 0% (manual) | None |
| **Cursor** | Development IDE | 100% | Built-in |
| **Next.js** | Framework | 100% | `npx create-next-app` |

---

## 🎯 The AOFA Development Process

### Phase 1: One-Time Machine Setup (Do Once)
```powershell
# Install required CLIs
npm install -g vercel
npm install -g supabase
winget install GitHub.cli

# Login to services
gh auth login          # GitHub CLI
vercel login          # Vercel (opens browser)
supabase login        # Supabase (opens browser)

# Configure Git
git config --global user.email "brian@aofa.ai"
git config --global user.name "Brian Broyles"
```

### Phase 2: New App Creation (Repeatable Template)

#### Step 1: Choose Your App Name
- **Format**: `{appname}.aofa.ai`
- **Example**: `tasktracker.aofa.ai`
- **Repository**: `aofai_{appname}`

#### Step 2: Create from Template (5 min)
```powershell
# Navigate to workspace
cd C:\Users\Broyles\OneDrive\Documents\GitHub

# Clone the template
git clone https://github.com/broyles-aofa/aofai_template.git aofai_{appname}
cd aofai_{appname}

# Update project metadata
# (Script will prompt for app name and auto-replace)
.\scripts\init-new-app.ps1
```

#### Step 3: Create GitHub Repository (2 min)
```powershell
# Create repo using GitHub CLI
gh repo create broyles-aofa/aofai_{appname} --public --source=. --remote=origin --push

# Verify
gh repo view
```

#### Step 4: Create Supabase Project (5 min - MANUAL)
**Dashboard Method** (Currently required):
1. Go to https://supabase.com/dashboard
2. Click **New Project**
3. Name: `aofai-{appname}`
4. Database Password: (use password manager)
5. Region: `East US (Ohio)` or nearest
6. Wait 2 minutes for provisioning
7. Copy **Project URL** and **Anon Key**

**Save to Vercel** (we'll set env vars next)

#### Step 4b: Configure Google OAuth (5 min - MANUAL)
**Required for authentication!**

See `GOOGLE_OAUTH_SETUP.md` for full details.

Quick steps:
1. Google Console: Create OAuth Client ID
2. Add redirect: `https://{project-ref}.supabase.co/auth/v1/callback`
3. Supabase: Enable Google provider, paste credentials

#### Step 5: Deploy to Vercel (5 min)
```powershell
cd aofai_{appname}

# Link to Vercel (creates new project)
vercel link --yes

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste the Supabase URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste the anon key when prompted

# Pull env vars locally
vercel env pull web/.env.local --yes
```

**IMPORTANT: Configure Vercel Root Directory (MANUAL)**

1. Go to Vercel project: Settings → **Build & Development**
2. Scroll to **Root Directory** section
3. Set to: `web`
4. Click **Save**

```powershell
# Deploy to production
vercel deploy --prod --yes
```

#### Step 6: Configure DNS on Domain.com (5 min - MANUAL)
1. Go to https://www.domain.com/controlpanel
2. Navigate to **DNS & Nameservers**
3. Click **DNS Records**
4. Add new **CNAME Record**:
   - **Type**: CNAME
   - **Host**: `{appname}` (e.g., `tasktracker`)
   - **Points To**: `cname.vercel-dns.com`
   - **TTL**: 3600 (1 hour)
5. Save

#### Step 7: Add Domain to Vercel (2 min)
```powershell
# Add custom domain
vercel domains add {appname}.aofa.ai --yes

# Check status
vercel domains ls
```

Wait 10-30 minutes for DNS propagation.

#### Step 8: Apply Database Schema (2 min)
```powershell
cd web

# Link Supabase CLI to project
supabase link --project-ref {project-ref}
# Get project-ref from Supabase URL: https://{project-ref}.supabase.co

# Apply migrations
supabase db push

# Verify
supabase db diff
```

---

## 📁 Template Project Structure

```
aofai_template/
├── .cursorrules                    # Cursor AI configuration
├── .gitignore                      # Git ignore patterns
├── README.md                       # Project overview
├── SETUP_GUIDE.md                  # This file, customized per app
├── CREDENTIALS.md                  # Service credentials (NOT committed)
├── DEPLOYMENT_GUIDE.md             # Deployment workflow
│
├── scripts/                        # Automation scripts
│   ├── init-new-app.ps1           # Initialize new app from template
│   ├── deploy.ps1                 # One-command deployment
│   └── setup-env.ps1              # Environment setup helper
│
├── web/                           # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── actions.js         # Server actions
│   │   │   ├── layout.js          # Root layout
│   │   │   ├── page.js            # Homepage
│   │   │   └── globals.css        # Global styles
│   │   ├── components/
│   │   │   └── (reusable components)
│   │   └── lib/
│   │       └── supabase/
│   │           ├── client.js      # Client-side Supabase
│   │           └── server.js      # Server-side Supabase
│   │
│   ├── supabase/
│   │   ├── config.toml            # Supabase configuration
│   │   ├── schema.sql             # Base schema
│   │   ├── seed.sql               # Seed data
│   │   └── migrations/            # Migration files
│   │
│   ├── package.json
│   ├── next.config.mjs
│   └── env.example                # Example environment variables
│
└── docs/                          # Documentation
    ├── ARCHITECTURE.md            # System architecture
    ├── PATTERNS.md                # Code patterns
    └── API.md                     # API documentation
```

---

## 🤖 Cursor Integration

### .cursorrules File
The template includes a `.cursorrules` file that tells Cursor AI:
- Always read `CREDENTIALS.md` first
- Follow patterns in `PATTERNS.md`
- Use the established stack (Next.js, Supabase, Vercel)
- Maintain consistent code style
- Auto-reference architecture decisions

### Starting a New Session
When you open the project in Cursor, say:

> "Read CREDENTIALS.md, SETUP_GUIDE.md, and PATTERNS.md. This is an AOFA template app. We use Next.js 15, Supabase, and Vercel. Help me build [feature description]."

Cursor will immediately understand the context.

---

## 🔄 Deployment Workflow (After Initial Setup)

Once setup is complete, deploying changes is simple:

```powershell
# Make your code changes in web/src/

# Test locally
cd web
npm run dev

# Commit changes
git add -A
git commit -m "Add feature X"
git push origin main

# Deploy to production
vercel deploy --prod --yes
```

**Automatic Deployments**: Vercel auto-deploys from GitHub main branch, so just push!

---

## 📊 What CAN Be Automated

### ✅ Fully Automated
- Repository creation (`gh repo create`)
- Vercel project creation (`vercel`)
- Vercel deployment (`vercel deploy`)
- Environment variables (`vercel env add`)
- Database migrations (`supabase db push`)
- Code generation (Cursor AI)

### ⚠️ Semi-Automated
- Supabase project creation (can use API, needs token)
- Domain configuration (manual via domain.com dashboard)

### 🎯 Goal: 25-Minute New App Setup
- 5 min: Clone template, customize
- 5 min: Create Supabase project (manual)
- 3 min: Deploy to Vercel
- 5 min: DNS configuration (manual)
- 2 min: Database migration
- 5 min: Verify everything works

---

## 🔐 Credentials Management

Each app needs these credentials stored in `CREDENTIALS.md` (NOT committed):

```markdown
## Project Details
- App Name: {appname}
- Domain: {appname}.aofa.ai
- GitHub Repo: broyles-aofa/aofai_{appname}
- Vercel Project: aofai-{appname}
- Supabase Project: {project-ref}

## URLs
- Production: https://{appname}.aofa.ai
- Vercel: https://aofai-{appname}.vercel.app
- GitHub: https://github.com/broyles-aofa/aofai_{appname}
- Supabase: https://supabase.com/dashboard/project/{project-ref}
```

---

## 🎨 Next Steps

1. **Create the template repository** (`aofai_template`)
2. **Document all patterns** in `PATTERNS.md`
3. **Create init script** that auto-replaces placeholders
4. **Test template** by creating app #2
5. **Refine process** based on learnings
6. **By app #3**, should be smooth
7. **By app #55**, takes 25 minutes

---

## 💡 Pro Tips

1. **Keep credentials file up to date** - Cursor can read it
2. **Use consistent naming** - `aofai_{appname}` everywhere
3. **Document patterns immediately** - Don't rely on memory
4. **Test migrations locally** - `supabase start` for local DB
5. **Use Vercel preview deployments** - Every branch gets a URL
6. **Keep template updated** - When you improve one app, update template

---

## 🚀 The Vision

```
Day 1: Idea in your head
Day 1: 25 minutes later → Live at {appname}.aofa.ai
Day 2-7: Build features with Cursor AI
Day 7: Production-ready app with users
```

Repeat 55 times. Build an empire.

---

**Created**: December 14, 2025  
**Author**: Brian Broyles  
**Organization**: AOFA  
**License**: Private/Internal Use

