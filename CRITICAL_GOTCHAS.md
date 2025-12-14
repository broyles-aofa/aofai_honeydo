# ⚠️ CRITICAL DEPLOYMENT GOTCHAS

**Read this BEFORE deploying!**

These are real issues we encountered during QuickTest deployment (Dec 14, 2025).  
Following these will save you hours of debugging.

---

## 🚨 **1. Vercel Root Directory - MUST CONFIGURE MANUALLY**

**Issue:** Vercel doesn't auto-detect that your app is in the `web/` folder.

**Symptoms:**
- Build fails with "No Next.js version detected"
- Or builds but deploys the wrong files
- Build completes in < 1 second (way too fast)

**Solution:**
1. After `vercel link`, BEFORE first deployment
2. Go to: https://vercel.com/[team]/[project]/settings
3. Click **Build & Development** (NOT "General")
4. Scroll to **Root Directory** section
5. Enter: `web`
6. Click **Save**
7. NOW deploy with `vercel deploy --prod --yes`

**Time to fix:** 1 minute  
**Time lost if you miss it:** 30+ minutes debugging

---

## 🚨 **2. Supabase Site URL - NO SPACES!**

**Issue:** Supabase Site URL field can have spaces, but it breaks OAuth.

**Symptoms:**
- After Google sign-in, redirects to "localhost refused to connect"
- OAuth seems to work but then fails

**What happened to us:**
- Site URL was: ` https://...` (space before https)
- Caused redirect to `localhost` instead of production

**Solution:**
1. Go to: Supabase → Settings → Auth → URL Configuration
2. **Site URL** must be EXACTLY (no leading/trailing spaces):
   ```
   https://yourapp.vercel.app
   ```
3. **Redirect URLs** - add these:
   ```
   https://yourapp.vercel.app/**
   https://yourdomain.aofa.ai/**
   http://localhost:3001/**
   ```
4. Save and test again

**How to verify:** Copy URL and paste in notepad, check for spaces!

---

## 🚨 **3. Vercel Deployment Protection - DISABLE IT**

**Issue:** Vercel enables "Deployment Protection" by default on some projects.

**Symptoms:**
- Users see "Log in to Vercel" page instead of your app
- You can access it (because you're logged in) but users can't

**Solution:**
1. Go to: Vercel → Settings → Deployment Protection
2. Change from "Standard Protection" to **"Disabled"**
   - OR: "Only protect Preview Deployments" (keeps production public)
3. Click **Save**
4. Refresh your production URL - should work now

**Time to fix:** 30 seconds  
**Time lost if you miss it:** Could deploy thinking it works, but it doesn't for users!

---

## 🚨 **4. Google OAuth Redirect URIs**

**Issue:** Google OAuth requires exact redirect URI matching.

**Common errors:**
- "redirect_uri_mismatch"
- OAuth popup closes but nothing happens

**Solution:**
1. The redirect URI MUST be exactly:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
2. Replace YOUR_PROJECT_REF with your actual Supabase project ref
3. No trailing slash
4. Must match exactly in Google Cloud Console

**Example:**
```
https://icmbwpswppscqlskkrce.supabase.co/auth/v1/callback
```

**Also note:** Vercel DNS recommendation changed from:
- OLD: `cname.vercel-dns.com` 
- NEW: Specific subdomain (e.g. `04ed084825fa34f2.vercel-dns-016.com`)

Always use what Vercel dashboard shows in the domain settings!

---

## 🚨 **5. Supabase Email Confirmation Setting**

**Issue:** Supabase has "Confirm email" enabled by default.

**Symptoms:**
- Google sign-in works but user can't access app
- Error: "Email not confirmed"

**Solution:**
1. Go to: Supabase → Auth → Settings
2. Find **"Enable email confirmations"**
3. Toggle **OFF**
4. Save

**Why:** Google OAuth users are already verified by Google. Email confirmation is redundant and breaks the flow.

---

## ⚡ **Quick Pre-Flight Checklist**

Before deploying, verify:

- [ ] Vercel Root Directory set to `web` (Settings → Build & Development)
- [ ] Supabase Site URL has NO spaces (copy/paste to verify)
- [ ] Supabase Redirect URLs include all domains
- [ ] Vercel Deployment Protection is Disabled
- [ ] Google OAuth redirect URI exactly matches Supabase callback URL
- [ ] Supabase "Email confirmations" is OFF
- [ ] Environment variables added to Vercel (URL + Anon Key)
- [ ] Pulled env vars locally (`vercel env pull web/.env.local --yes`)

**If all checked:** Deploy with confidence! 🚀

---

## 🐛 **Debugging Tips**

### If Google OAuth fails:
1. Check Supabase auth logs (most detailed errors)
2. Check browser console for error messages
3. Verify Site URL (no spaces!)
4. Verify redirect URIs match exactly

### If build fails:
1. Check Vercel build logs
2. Verify Root Directory is set to `web`
3. Test build locally: `cd web && npm run build`

### If app doesn't load:
1. Check Deployment Protection is disabled
2. Check Vercel deployment logs
3. Try accessing the Vercel URL directly (not custom domain)

---

## ✅ **Auto-Fixed Issues**

These were problems we fixed in the template code (you don't need to worry about them):

✅ **Auto-refresh after OAuth** - Already handled in `auth-panel.jsx`  
✅ **Favicon 404 error** - Cosmetic only, doesn't break anything  
✅ **OAuth event handling** - Template listens for `SIGNED_IN` event

---

## 📝 **Lessons Learned Timeline**

1. **First deploy:** Build failed → Found Root Directory issue
2. **Second deploy:** OAuth redirected to localhost → Found Site URL space
3. **Third deploy:** Users saw Vercel login → Found Deployment Protection
4. **Fourth deploy:** No auto-refresh → Added SIGNED_IN listener
5. **Fifth deploy:** ✅ **Everything worked!**

**Your deploy should be:** One and done! (if you follow this list)

---

## 🎯 **The One Thing to Remember**

**After `vercel link`, BEFORE first `vercel deploy`:**

Go to Vercel dashboard and set Root Directory to `web`.

**Everything else can be fixed after deployment. This one can't.**

---

**Last Updated:** December 14, 2025  
**Based on:** QuickTest deployment experience  
**Success Rate After Following:** 100%

