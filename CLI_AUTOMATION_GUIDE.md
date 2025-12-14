# 🤖 CLI Automation Guide for AOFA Apps

**What can Cursor AI automate vs. what needs manual steps?**

---

## 📊 Summary Table

| Task | CLI Available | Cursor Can Do It | Method | Notes |
|------|---------------|------------------|---------|-------|
| **Git Operations** | ✅ Yes | ✅ Yes | `git`, `gh` | Fully automated |
| **GitHub Repo Creation** | ✅ Yes | ✅ Yes | `gh repo create` | Need GitHub token |
| **Vercel Deployment** | ✅ Yes | ✅ Yes | `vercel` CLI | Fully automated |
| **Vercel Env Vars** | ✅ Yes | ⚠️ Interactive | `vercel env add` | Needs interactive input |
| **Vercel Domain Add** | ✅ Yes | ✅ Yes | `vercel domains add` | Fully automated |
| **Supabase Migration** | ✅ Yes | ⚠️ With creds | `supabase db push` | Need project ref + password |
| **Supabase Project Create** | ⚠️ API | ⚠️ Possible | REST API | Need management token |
| **Domain.com DNS** | ❌ No | ❌ No | Manual only | No official API |
| **npm/Node Operations** | ✅ Yes | ✅ Yes | `npm` | Fully automated |

**Legend:**
- ✅ = Fully automated
- ⚠️ = Possible with credentials/setup
- ❌ = Must be done manually

---

## 1️⃣ Git & GitHub (100% Automated)

### ✅ What Cursor CAN Do

```powershell
# Initialize git
git init
git add -A
git commit -m "Initial commit"

# Create GitHub repository
gh repo create broyles-aofa/aofai_tasktracker --public --source=. --remote=origin --push

# Push changes
git push origin main

# Create branches
git checkout -b feature-branch
git push -u origin feature-branch

# View repository
gh repo view
```

### ⚠️ Prerequisites
- GitHub CLI installed: `winget install GitHub.cli`
- Logged in once: `gh auth login` (opens browser)
- After login, fully automated

### 📝 For Template System
**Status**: ✅ **Fully Automatable**
- Cursor can run all git/GitHub commands
- Only one-time login required per machine
- Can be included in template scripts

---

## 2️⃣ Vercel (95% Automated)

### ✅ What Cursor CAN Do

```powershell
# Link to project (creates new if doesn't exist)
vercel link --yes

# Deploy to production
vercel deploy --prod --yes

# Add domain
vercel domains add tasktracker.aofa.ai --yes

# List deployments
vercel ls

# Check logs
vercel logs aofai-tasktracker

# List domains
vercel domains ls
```

### ⚠️ Interactive Commands (Need User Input)

```powershell
# Set environment variables (requires value input)
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# ^ Prompts for value - can't fully automate

# Pull environment variables (automated)
vercel env pull web/.env.local --yes
```

### 💡 Workaround for Env Vars

**Option 1: Use environment variable file**
```powershell
# Create .env.production file
echo "NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co" > .env.production
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx" >> .env.production

# Import to Vercel
vercel env import .env.production production
```

**Option 2: Vercel API**
```powershell
# Use Vercel API with token
curl -X POST "https://api.vercel.com/v10/projects/$PROJECT_ID/env" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"NEXT_PUBLIC_SUPABASE_URL","value":"https://xxx.supabase.co","type":"plain","target":["production"]}'
```

### ⚠️ Prerequisites
- Vercel CLI installed: `npm install -g vercel`
- Logged in once: `vercel login` (opens browser)
- After login, most operations automated

### 📝 For Template System
**Status**: ✅ **95% Automatable**
- Deployment: Fully automated
- Domain addition: Fully automated
- Env vars: Need manual input or API token
- **Recommendation**: User provides env vars during setup, script handles rest

---

## 3️⃣ Supabase (90% Automated)

### ✅ What Cursor CAN Do

```powershell
# Link to project
supabase link --project-ref wrdibgzxarfwoflslrjr
# ^ Prompts for database password

# Apply migrations
supabase db push

# Check differences
supabase db diff

# Generate TypeScript types
supabase gen types typescript --local > web/src/lib/database.types.ts

# Run local Supabase (for development)
supabase start
supabase stop
```

### ⚠️ Cannot Automate (Manual Dashboard Steps)

- **Creating new Supabase project** (Dashboard only - takes 2 minutes)
- **Getting initial credentials** (Dashboard → Settings → API)

### 💡 Workaround: Supabase Management API

```bash
# Create project via API (requires Supabase access token)
curl -X POST 'https://api.supabase.com/v1/projects' \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "aofai-tasktracker",
    "organization_id": "xxx",
    "region": "us-east-1",
    "plan": "free"
  }'
```

### 📋 Credential Management Options

**Option 1: User provides credentials**
```powershell
# Script prompts for credentials
$projectRef = Read-Host "Enter Supabase project ref"
$dbPassword = Read-Host "Enter database password" -AsSecureString

# Then script does the rest
supabase link --project-ref $projectRef --password $dbPassword
supabase db push
```

**Option 2: MCP Connection**
- Cursor could potentially connect to Supabase via MCP server
- Would require Supabase MCP server implementation
- Not currently available (as of Dec 2024)

### 📝 For Template System
**Status**: ⚠️ **90% Automatable**
- Migrations: Fully automated
- Project link: Automated with credentials
- Project creation: Manual (2 min) OR API with token
- **Recommendation**: Manual project creation, automated everything else

---

## 4️⃣ Domain.com DNS (0% Automated)

### ❌ What Cursor CANNOT Do

- Add/modify DNS records
- No official CLI or documented API
- Must be done via web dashboard

### ⏱️ Manual Process (5 minutes)

1. Login to domain.com
2. Navigate to DNS settings
3. Add CNAME record: `{appname}` → `cname.vercel-dns.com`
4. Save

### 💡 Alternative: Vercel DNS

If you transfer DNS management to Vercel:
```powershell
# Fully automated with Vercel DNS
vercel dns add aofa.ai tasktracker CNAME cname.vercel-dns.com
```

**Pros**: Fully automatable
**Cons**: Need to transfer nameservers to Vercel

### 📝 For Template System
**Status**: ❌ **Manual Only** (5 min per app)
- Accept this as the one manual step
- Document it clearly in checklist
- Consider moving to Vercel DNS for full automation

---

## 5️⃣ Node/NPM Operations (100% Automated)

### ✅ What Cursor CAN Do

```powershell
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Update packages
npm update

# Add new package
npm install package-name
```

### 📝 For Template System
**Status**: ✅ **Fully Automatable**
- All npm commands work perfectly
- Can be included in template scripts

---

## 🎯 Recommended Automation Strategy

### What to Automate with Scripts

```powershell
# scripts/deploy.ps1
# Fully automated deployment
cd web
npm run build
cd ..
vercel deploy --prod --yes
```

### What to Prompt User For

```powershell
# scripts/init-new-app.ps1
$appName = Read-Host "Enter app name"
$supabaseUrl = Read-Host "Enter Supabase URL"
$supabaseKey = Read-Host "Enter Supabase anon key"

# Then automate the rest...
```

### What to Document for Manual Steps

- **Supabase project creation** → 2-minute dashboard task
- **Domain.com DNS** → 5-minute dashboard task
- **First-time CLI logins** → One-time per machine

---

## 🤖 MCP (Model Context Protocol) Options

### Currently Available
- **File system** (built-in)
- **Terminal** (built-in)
- **Browser** (built-in to Cursor)

### Potentially Useful for AOFA
- **GitHub MCP Server** (if available)
  - Could read repos, create issues, etc.
  - Not essential - `gh` CLI works great
  
- **Supabase MCP Server** (if available)
  - Could manage projects, apply migrations
  - Not currently available
  - CLI + credentials works fine
  
- **Vercel MCP Server** (if available)
  - Could manage deployments, env vars
  - Not currently available
  - CLI works perfectly

### 📝 Recommendation
**Don't wait for MCP - CLI is sufficient for now**
- Current CLI tools (gh, vercel, supabase) are excellent
- MCP would be nice-to-have, not required
- Focus on solid scripts with current tools

---

## 🎨 Ideal Setup for App #55

By the time you create app #55, here's the workflow:

```powershell
# 1. Clone template (30 seconds)
git clone https://github.com/broyles-aofa/aofai_template.git aofai_myapp
cd aofai_myapp

# 2. Run init script (1 minute)
.\scripts\init-new-app.ps1
# Prompts for: app name, Supabase URL, Supabase key
# Auto-creates GitHub repo, deploys to Vercel

# 3. Create Supabase project (2 minutes - MANUAL)
# Dashboard: Click, click, copy URL/key

# 4. Configure DNS (5 minutes - MANUAL)
# domain.com: Add CNAME record

# 5. Done! (8 minutes total)
```

**Manual Steps**: 2 (Supabase + DNS)
**Time**: 8 minutes
**Acceptable**: ✅ Yes!

---

## 💡 Advanced: Full Automation Option

If you want 100% automation:

### Option A: Use Vercel DNS
- Transfer aofa.ai nameservers to Vercel
- Enables `vercel dns add` command
- Fully automated DNS management

### Option B: Use Supabase Management API
- Get Supabase personal access token
- Store in environment variable
- Script creates projects via API

### Option C: Both A + B
```powershell
# Theoretical fully automated script
.\scripts\create-complete-app.ps1 -AppName "tasktracker"

# This script would:
# 1. Create GitHub repo ✅
# 2. Create Supabase project ✅ (via API)
# 3. Deploy to Vercel ✅
# 4. Add DNS record ✅ (via Vercel DNS)
# 5. Apply migrations ✅
# Total time: 3 minutes, zero manual steps
```

**Tradeoffs**:
- More complex setup
- Dependency on APIs (can change/break)
- May not be worth it for 5 minutes saved

---

## 📊 Final Recommendation

### For Your Template System

**Automate**:
- ✅ Git/GitHub operations
- ✅ Vercel deployment
- ✅ Vercel domain addition
- ✅ Supabase migrations
- ✅ NPM operations

**Manual (Accept these)**:
- ⏱️ Supabase project creation (2 min)
- ⏱️ Domain.com DNS (5 min)
- ⏱️ Supabase credential input (30 sec)

**Total Manual Time**: ~8 minutes per app
**Total Setup Time**: ~25 minutes per app

### Scripts to Create

1. **init-new-app.ps1** ✅ Created
   - Prompts for app name
   - Updates all template files
   - Creates GitHub repo
   
2. **deploy.ps1** 
   - Build check
   - Deploy to Vercel
   
3. **setup-env.ps1**
   - Prompts for Supabase credentials
   - Sets Vercel env vars
   - Pulls locally

---

**Created**: December 14, 2025  
**Purpose**: Document CLI automation capabilities for AOFA template system  
**Verdict**: 90% automatable, 8 minutes of acceptable manual steps

