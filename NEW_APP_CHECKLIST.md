# 📋 New AOFA App Setup Checklist

**Use this checklist for every new app you create.**

---

## App Information

- **App Name**: _____________
- **Domain**: _____________.aofa.ai
- **Repository**: aofai______________
- **Date Started**: _____________

---

## ☑️ Pre-Setup (One-Time Per Machine)

- [ ] Git CLI installed and configured
- [ ] GitHub CLI (`gh`) installed
- [ ] Vercel CLI installed (`npm install -g vercel`)
- [ ] Supabase CLI installed
- [ ] Logged into GitHub (`gh auth login`)
- [ ] Logged into Vercel (`vercel login`)
- [ ] Logged into Supabase (`supabase login`)
- [ ] Git configured with brian@aofa.ai

---

## 📦 Step 1: Create from Template (5 min)

- [ ] Navigate to workspace directory
- [ ] Clone template repository
  ```powershell
  cd C:\Users\Broyles\OneDrive\Documents\GitHub
  git clone https://github.com/broyles-aofa/aofai_template.git aofai_{appname}
  cd aofai_{appname}
  ```
- [ ] Run initialization script
  ```powershell
  .\scripts\init-new-app.ps1
  ```
- [ ] Review generated files (README.md, CREDENTIALS.md, SETUP_GUIDE.md)
- [ ] Install dependencies
  ```powershell
  cd web
  npm install
  ```

**Time**: _____ minutes

---

## 🐙 Step 2: Create GitHub Repository (2 min)

- [ ] Create repository using GitHub CLI
  ```powershell
  gh repo create broyles-aofa/aofai_{appname} --public --source=. --remote=origin --push
  ```
- [ ] Verify repository created
  ```powershell
  gh repo view
  ```
- [ ] Update CREDENTIALS.md with repository URL

**GitHub URL**: https://github.com/broyles-aofa/aofai_{appname}

**Time**: _____ minutes

---

## 🗄️ Step 3: Create Supabase Project (5 min)

- [ ] Go to https://supabase.com/dashboard
- [ ] Click **New Project**
- [ ] Enter details:
  - **Name**: aofai-{appname}
  - **Database Password**: _____________ (save in password manager)
  - **Region**: East US (Ohio)
  - **Pricing Plan**: Free
- [ ] Click **Create Project**
- [ ] Wait ~2 minutes for provisioning
- [ ] Navigate to **Project Settings** → **API**
- [ ] Copy **Project URL**: _________________________________
- [ ] Copy **Project Ref** (from URL): _____________________
- [ ] Copy **anon public** key: _____________________________
- [ ] Update CREDENTIALS.md with project details

**Supabase URL**: https://_____________________________.supabase.co

**Time**: _____ minutes

---

## 🔐 Step 3b: Configure Google OAuth (5 min - REQUIRED)

**See `GOOGLE_OAUTH_SETUP.md` for detailed instructions**

- [ ] Go to: https://console.cloud.google.com/apis/credentials
- [ ] Create OAuth Client ID (or reuse existing if you have one)
- [ ] Add Authorized redirect URI:
  ```
  https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
  ```
  (Replace YOUR_PROJECT_REF with actual value from Step 3)
- [ ] Copy **Client ID**: _________________________________
- [ ] Copy **Client Secret**: _____________________________
- [ ] Go to Supabase Auth Providers:
  https://supabase.com/dashboard/project/YOUR_PROJECT_REF/auth/providers
- [ ] Enable **Google** provider (toggle ON)
- [ ] Paste Client ID and Client Secret
- [ ] Click **Save**

**Time**: _____ minutes

---

## 🚀 Step 4: Deploy to Vercel (5 min)

- [ ] Link to Vercel (creates new project)
  ```powershell
  cd C:\Users\Broyles\OneDrive\Documents\GitHub\aofai_{appname}
  vercel link --yes
  ```
- [ ] Add Supabase URL to Vercel
  ```powershell
  vercel env add NEXT_PUBLIC_SUPABASE_URL production
  ```
  Paste Supabase URL when prompted
- [ ] Add Supabase Anon Key to Vercel
  ```powershell
  vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
  ```
  Paste anon key when prompted
- [ ] Pull environment variables locally
  ```powershell
  vercel env pull web/.env.local --yes
  ```
- [ ] **IMPORTANT: Configure Vercel Root Directory (MANUAL)**
  1. Go to Vercel project dashboard
  2. Click **Settings** → **Build & Development**
  3. Scroll to **Root Directory** section
  4. Enter: `web`
  5. Click **Save**
- [ ] Deploy to production
  ```powershell
  vercel deploy --prod --yes
  ```
- [ ] Note deployment URL: _____________________________
- [ ] Update CREDENTIALS.md with Vercel project ID

**Vercel URL**: https://aofai-{appname}.vercel.app

**Time**: _____ minutes

---

## 🌐 Step 5: Configure DNS (5 min - Manual)

- [ ] Go to https://www.domain.com/controlpanel
- [ ] Login to account
- [ ] Navigate to **DNS & Nameservers** for aofa.ai
- [ ] Click **DNS Records**
- [ ] Click **Add DNS Record**
- [ ] Configure CNAME:
  - **Type**: CNAME
  - **Host**: {appname}
  - **Points To**: cname.vercel-dns.com
  - **TTL**: 3600 (1 hour)
- [ ] Click **Save**
- [ ] Wait a moment, then verify record appears in list

**DNS Configured For**: {appname}.aofa.ai → cname.vercel-dns.com

**Time**: _____ minutes

---

## 🔗 Step 6: Add Domain to Vercel (2 min)

- [ ] Add custom domain to Vercel
  ```powershell
  vercel domains add {appname}.aofa.ai --yes
  ```
- [ ] Check domain status
  ```powershell
  vercel domains ls
  ```
- [ ] Status should show "Pending" or "Valid"
- [ ] If "Invalid Configuration", verify DNS at domain.com

**Custom Domain**: {appname}.aofa.ai

**Expected Wait Time**: 10-30 minutes for DNS propagation

**Time**: _____ minutes

---

## 💾 Step 7: Apply Database Schema (2 min)

- [ ] Navigate to web directory
  ```powershell
  cd web
  ```
- [ ] Link Supabase CLI to project
  ```powershell
  supabase link --project-ref {project-ref}
  ```
  Enter database password when prompted
- [ ] Apply migrations
  ```powershell
  supabase db push
  ```
- [ ] Verify no differences
  ```powershell
  supabase db diff
  ```
  Should return empty (no differences)
- [ ] Verify in Supabase Dashboard → **Table Editor**

**Schema Applied**: ✅

**Time**: _____ minutes

---

## ✅ Step 8: Verify & Test (5 min)

- [ ] Visit Vercel URL: https://aofai-{appname}.vercel.app
  - **Status**: [ ] ✅ Working / [ ] ❌ Error
- [ ] Visit Custom Domain: https://{appname}.aofa.ai
  - **Status**: [ ] ✅ Working / [ ] ❌ Pending DNS / [ ] ❌ Error
- [ ] Test Sign Up flow
  - **Status**: [ ] ✅ Working / [ ] ❌ Error
- [ ] Test Sign In flow
  - **Status**: [ ] ✅ Working / [ ] ❌ Error
- [ ] Test core feature
  - **Status**: [ ] ✅ Working / [ ] ❌ Error
- [ ] Test on mobile viewport (responsive design)
  - **Status**: [ ] ✅ Working / [ ] ❌ Error
- [ ] Check Vercel logs for errors
  ```powershell
  vercel logs aofai-{appname}
  ```
- [ ] Check Supabase logs in Dashboard

**All Tests Passed**: [ ] Yes / [ ] No (see issues below)

**Issues Found**:
- _______________________________________________________
- _______________________________________________________

**Time**: _____ minutes

---

## 📝 Step 9: Update Documentation

- [ ] Update CREDENTIALS.md with all collected information
- [ ] Update README.md if needed
- [ ] Mark SETUP_GUIDE.md steps as complete
- [ ] Add any project-specific notes

**Documentation Updated**: ✅

**Time**: _____ minutes

---

## 🎉 Setup Complete!

**Total Time**: _____ minutes

### Final URLs
- **Production**: https://{appname}.aofa.ai
- **Preview**: https://aofai-{appname}.vercel.app
- **GitHub**: https://github.com/broyles-aofa/aofai_{appname}
- **Supabase**: https://supabase.com/dashboard/project/{project-ref}
- **Vercel**: https://vercel.com/aofa/aofai-{appname}

### Next Steps
- [ ] Start building features in `web/src/`
- [ ] Create database migrations in `web/supabase/migrations/`
- [ ] Follow patterns in `PATTERNS.md`
- [ ] Deploy with `vercel deploy --prod --yes`
- [ ] Commit and push changes regularly

---

## 🔄 Continuous Development Workflow

Once setup is complete, use this workflow:

```powershell
# 1. Make changes in web/src/

# 2. Test locally
cd web
npm run dev

# 3. Commit changes
cd ..
git add -A
git commit -m "Description of changes"
git push origin main

# 4. Deploy (Vercel auto-deploys on push to main)
# Or manually deploy:
vercel deploy --prod --yes
```

---

## 🛟 Troubleshooting

### DNS Not Working
- Wait 10-30 minutes for propagation
- Verify CNAME record at domain.com
- Check `vercel domains ls` status
- Try `nslookup {appname}.aofa.ai`

### Supabase Connection Error
- Verify environment variables in Vercel dashboard
- Re-pull env vars: `vercel env pull web/.env.local --yes`
- Check Supabase project is active (not paused)

### Build Errors
- Check Vercel deployment logs
- Test build locally: `cd web && npm run build`
- Review error messages carefully
- Check all imports are correct

### Auth Not Working
- Verify Supabase RLS policies are set
- Check user creation in Supabase Dashboard → **Authentication**
- Verify environment variables are set correctly

---

**Checklist Version**: 1.0  
**Last Updated**: December 14, 2025  
**Template System**: AOFA App Template v1.0

