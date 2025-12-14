# Initialize New AOFA App from Template
# This script customizes the template for a new app

param(
    [Parameter(Mandatory=$false)]
    [string]$AppName
)

Write-Host "🏗️  AOFA App Initialization Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Get app name if not provided
if (-not $AppName) {
    $AppName = Read-Host "Enter app name (lowercase, no spaces, e.g. 'tasktracker')"
}

# Validate app name
if ($AppName -notmatch '^[a-z0-9]+$') {
    Write-Host "❌ Error: App name must be lowercase letters and numbers only" -ForegroundColor Red
    exit 1
}

Write-Host "📝 App Name: $AppName" -ForegroundColor Green
Write-Host "📝 Domain: $AppName.aofa.ai" -ForegroundColor Green
Write-Host "📝 Repository: aofai_$AppName" -ForegroundColor Green
Write-Host ""

# Confirm
$confirm = Read-Host "Continue with this configuration? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🔧 Updating files..." -ForegroundColor Cyan

# Get current directory (should be project root)
$projectRoot = Get-Location

# Update package.json
$packageJsonPath = Join-Path $projectRoot "web\package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
    $packageJson.name = "aofai-$AppName"
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath
    Write-Host "✅ Updated web/package.json" -ForegroundColor Green
}

# Update README.md
$readmePath = Join-Path $projectRoot "README.md"
$readmeContent = @"
# AOFA $AppName

Production-ready app built with the AOFA stack.

## Stack
- **Frontend**: Next.js 15 (React Server Components)
- **Database**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel
- **DNS**: Domain.com (aofa.ai)

## URLs
- **Production**: https://$AppName.aofa.ai
- **GitHub**: https://github.com/broyles-aofa/aofai_$AppName

## Quick Start

``````powershell
# Install dependencies
cd web
npm install

# Set up environment variables
vercel env pull .env.local --yes

# Run locally
npm run dev
``````

Visit http://localhost:3001

## Deployment

``````powershell
# Deploy to production
vercel deploy --prod --yes
``````

## Documentation
- [Setup Guide](./SETUP_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Code Patterns](./PATTERNS.md)
- [Credentials](./CREDENTIALS.md) - **NOT COMMITTED**

## Created
- Date: $(Get-Date -Format "MMMM dd, yyyy")
- Template Version: 1.0
- Organization: AOFA

"@
Set-Content $readmePath $readmeContent
Write-Host "✅ Updated README.md" -ForegroundColor Green

# Create CREDENTIALS.md from template
$credentialsPath = Join-Path $projectRoot "CREDENTIALS.md"
$credentialsContent = @"
# 🔐 Project Credentials & Service Configuration

## ⚠️ IMPORTANT: DO NOT COMMIT THIS FILE TO GIT

---

## 📧 User Accounts & Identities

### Git Configuration
- **User Name**: Brian Broyles
- **User Email**: ``brian@aofa.ai``
- **GitHub Username**: broyles-aofa

### GitHub Repository
- **Repository**: https://github.com/broyles-aofa/aofai_$AppName
- **Owner**: broyles-aofa
- **Main Branch**: main

---

## 🚀 Vercel Project Configuration

### Project Details
- **Project Name**: aofai-$AppName
- **Project ID**: [TO BE FILLED AFTER VERCEL DEPLOYMENT]
- **Organization**: aofa
- **Root Directory**: web
- **Framework**: Next.js

### Production URLs
- **Primary**: https://aofai-$AppName.vercel.app
- **Custom Domain**: https://$AppName.aofa.ai

---

## 🗄️ Supabase Configuration

### Project Details
- **Project Name**: aofai-$AppName
- **Project Ref**: [TO BE FILLED AFTER SUPABASE CREATION]
- **Project URL**: [TO BE FILLED]
- **Region**: East US (Ohio)

### Environment Variables
These are stored in Vercel, not in this file:
- ``NEXT_PUBLIC_SUPABASE_URL`` - Your Supabase project URL
- ``NEXT_PUBLIC_SUPABASE_ANON_KEY`` - Public anon key

---

## 🌐 Domain Configuration

### DNS Settings
- **Domain**: aofa.ai
- **Subdomain**: $AppName.aofa.ai
- **CNAME Record**: Points to cname.vercel-dns.com

---

## 📍 File Locations

### Local Project Path
``````
C:\Users\Broyles\OneDrive\Documents\GitHub\aofai_$AppName
``````

---

## 🔗 Service URLs & Dashboards

### Production Services
- **Live App**: https://$AppName.aofa.ai
- **Preview**: https://aofai-$AppName.vercel.app

### Admin Dashboards
- **Vercel Dashboard**: https://vercel.com/aofa/aofai-$AppName
- **GitHub Repository**: https://github.com/broyles-aofa/aofai_$AppName
- **Supabase Dashboard**: https://supabase.com/dashboard (select project)

---

**Created**: $(Get-Date -Format "MMMM dd, yyyy")
**App Name**: $AppName
**Status**: ⏳ Setup in progress

"@
Set-Content $credentialsPath $credentialsContent
Write-Host "✅ Created CREDENTIALS.md" -ForegroundColor Green

# Create SETUP_GUIDE.md
$setupGuidePath = Join-Path $projectRoot "SETUP_GUIDE.md"
$setupGuideContent = @"
# Setup Guide: $AppName

Follow these steps to set up this app from scratch.

## ✅ Completed Steps

- [x] Clone template
- [x] Initialize app with ``init-new-app.ps1``

## 📋 Next Steps

### 1. Create GitHub Repository
``````powershell
# From project root
gh repo create broyles-aofa/aofai_$AppName --public --source=. --remote=origin --push
``````

### 2. Create Supabase Project
1. Go to https://supabase.com/dashboard
2. Click **New Project**
3. Settings:
   - Name: ``aofai-$AppName``
   - Database Password: [Use password manager]
   - Region: East US (Ohio)
4. Wait ~2 minutes for provisioning
5. Copy **Project URL** and **Anon Key**
6. Update ``CREDENTIALS.md`` with Project Ref

### 3. Deploy to Vercel
``````powershell
# Link to new Vercel project
vercel link --yes

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste Supabase URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste anon key when prompted

# Pull env vars locally
vercel env pull web/.env.local --yes

# Deploy to production
vercel deploy --prod --yes
``````

### 4. Configure DNS (Domain.com)
1. Go to https://www.domain.com/controlpanel
2. Navigate to **DNS & Nameservers**
3. Add CNAME Record:
   - Host: ``$AppName``
   - Points To: ``cname.vercel-dns.com``
   - TTL: 3600

### 5. Add Domain to Vercel
``````powershell
vercel domains add $AppName.aofa.ai --yes
``````

Wait 10-30 minutes for DNS propagation.

### 6. Apply Database Schema
``````powershell
cd web

# Link Supabase CLI
supabase link --project-ref [YOUR-PROJECT-REF]

# Apply migrations
supabase db push

# Verify
supabase db diff
``````

### 7. Test Application
1. Visit https://$AppName.aofa.ai
2. Test sign up / sign in
3. Test core features
4. Check mobile responsive design

---

## 🎉 Setup Complete!

Your app is now live at **https://$AppName.aofa.ai**

## Next Steps
- Build features in ``web/src/``
- Add database tables in ``web/supabase/migrations/``
- Deploy with ``vercel deploy --prod --yes``
- Refer to ``PATTERNS.md`` for code patterns

---

Created: $(Get-Date -Format "MMMM dd, yyyy")
"@
Set-Content $setupGuidePath $setupGuideContent
Write-Host "✅ Created SETUP_GUIDE.md" -ForegroundColor Green

# Update .gitignore
$gitignorePath = Join-Path $projectRoot ".gitignore"
$gitignoreContent = @"
# Environment variables
.env*
!env.example
*.local

# Credentials (NEVER commit)
CREDENTIALS.md

# Dependencies
node_modules/
web/node_modules/

# Next.js
web/.next/
web/out/
web/build/
web/dist/

# Vercel
.vercel/

# Local Supabase
web/supabase/.branches/
web/supabase/.temp/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/

"@
Set-Content $gitignorePath $gitignoreContent
Write-Host "✅ Updated .gitignore" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Initialization Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Read SETUP_GUIDE.md for detailed instructions" -ForegroundColor White
Write-Host "2. Create GitHub repository with:" -ForegroundColor White
Write-Host "   gh repo create broyles-aofa/aofai_$AppName --public --source=. --remote=origin --push" -ForegroundColor Yellow
Write-Host "3. Create Supabase project at https://supabase.com/dashboard" -ForegroundColor White
Write-Host "4. Deploy to Vercel with: vercel deploy --prod --yes" -ForegroundColor White
Write-Host "5. Configure DNS at domain.com" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "- SETUP_GUIDE.md - Step-by-step setup" -ForegroundColor White
Write-Host "- PATTERNS.md - Code patterns to follow" -ForegroundColor White
Write-Host "- AOFA_TEMPLATE_SYSTEM.md - Overall system documentation" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Happy coding!" -ForegroundColor Cyan

