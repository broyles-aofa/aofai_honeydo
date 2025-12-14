# 🧪 Test This Template (10 Minutes)

**Quick test to verify the template works before using it for a real app**

---

## ✅ Prerequisites

- Node.js installed (`node --version`)
- In your GitHub directory

---

## 🚀 Testing Steps (Run One at a Time)

### **Step 1: Navigate to GitHub folder**
```powershell
cd C:\Users\Broyles\OneDrive\Documents\GitHub
```
Press Enter. You should be in your GitHub directory.

---

### **Step 2: Copy the template**
```powershell
Copy-Item -Path "aofai_tasktracker\template" -Destination "aofai_quicktest" -Recurse
```
Press Enter. Wait a few seconds for the copy to complete.

---

### **Step 3: Navigate to web folder**
```powershell
cd aofai_quicktest\web
```
Press Enter. You should now be in `aofai_quicktest\web`.

---

### **Step 4: Install dependencies**
```powershell
npm install
```
Press Enter. This will take 1-2 minutes. You'll see packages being downloaded.

**Expected:** Should complete without errors.

---

### **Step 5: Create fake environment file (for testing)**
```powershell
"NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co" | Out-File -FilePath .env.local -Encoding utf8
```
Press Enter.

```powershell
"NEXT_PUBLIC_SUPABASE_ANON_KEY=test_key_for_build_testing" | Add-Content -Path .env.local
```
Press Enter.

**Expected:** `.env.local` file created (won't work with real Supabase, just for build testing).

---

### **Step 6: Test the build**
```powershell
npm run build
```
Press Enter. Should take ~30 seconds.

**Expected:** Should end with "Compiled successfully" ✅

---

### **Step 7: Start development server**
```powershell
npm run dev
```
Press Enter. Should take a few seconds.

**Expected:** Should say "Ready started server on 0.0.0.0:3001" ✅

---

### **Step 8: Open in browser**

Open in your browser: **http://localhost:3001**

**Expected:**
- ✅ Page loads
- ✅ See "AOFA Template" heading
- ✅ See auth form (sign in/up)
- ✅ UI looks good (Tailwind CSS working)

**Note:** Auth won't actually work (fake Supabase credentials), but the page should load and look correct!

---

### **Step 9: Stop the server**

Press `Ctrl+C` in the PowerShell terminal to stop the dev server.

---

### **Step 10: Clean up test folder**
```powershell
cd ..\..
```
Press Enter. (Goes back to GitHub folder)

```powershell
Remove-Item -Recurse -Force aofai_quicktest
```
Press Enter. Test folder is deleted.

---

## ✅ Success Criteria

If you completed all steps and:
- ✅ `npm install` completed without errors
- ✅ `npm run build` compiled successfully
- ✅ `npm run dev` started the server
- ✅ Page loaded at http://localhost:3001
- ✅ UI looked correct

**Then your template is perfect and ready to use!** 🎉

---

## 🚀 Next Steps

### **Template Works? Great!**

Now you can use it to build real apps:

1. **Read** `START_HERE.md` for complete setup guide
2. **Copy** template with real app name (not "quicktest")
3. **Run** `.\scripts\init-new-app.ps1`
4. **Follow** the setup checklist
5. **Deploy** to production in ~25 minutes!

---

## ❌ Troubleshooting

### **"Cannot find path" error**
- Make sure you ran Step 1 first
- Check you're in the correct directory: `pwd`
- Verify template folder exists: `ls aofai_tasktracker`

### **"npm install" fails**
- Check Node.js is installed: `node --version`
- Should be v18 or higher
- Try clearing npm cache: `npm cache clean --force`

### **Build fails**
- Check error message carefully
- Usually a missing dependency - re-run `npm install`
- Check `.env.local` was created

### **Page doesn't load**
- Make sure dev server is running (should say "Ready")
- Try http://127.0.0.1:3001 instead
- Check for port conflicts (close other apps on port 3001)

---

## 📝 What This Test Proves

This quick test verifies:
- ✅ Template structure is correct
- ✅ All files are present
- ✅ Dependencies install correctly
- ✅ Next.js builds successfully
- ✅ Dev server starts
- ✅ Basic UI renders
- ✅ Tailwind CSS works

**What it doesn't test:**
- ❌ Real Supabase connection (need real project)
- ❌ Real authentication (need real credentials)
- ❌ Database operations (need real Supabase)
- ❌ Deployment (need Vercel)

For full end-to-end test, follow `START_HERE.md` and build a real app!

---

**Time**: 10 minutes  
**Risk**: Zero (just a test, deleted after)  
**Confidence**: High (proves template works)

**Ready to test? Start with Step 1!** 🚀

