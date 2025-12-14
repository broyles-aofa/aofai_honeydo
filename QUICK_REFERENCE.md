# ⚡ AOFA Template Quick Reference

**Keep this handy for rapid app creation**

---

## 🚀 New App in 25 Minutes

```powershell
# 1. Clone template (1 min)
git clone https://github.com/broyles-aofa/aofai_template.git aofai_APPNAME
cd aofai_APPNAME

# 2. Initialize (1 min)
.\scripts\init-new-app.ps1

# 3. Create GitHub repo (1 min)
gh repo create broyles-aofa/aofai_APPNAME --public --source=. --remote=origin --push

# 4. Create Supabase project (2 min - MANUAL DASHBOARD)
# → https://supabase.com/dashboard
# → New Project → aofai-APPNAME → Copy URL & Key

# 5. Deploy to Vercel (3 min)
vercel link --yes
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production  
vercel deploy --prod --yes

# 6. Configure DNS (5 min - MANUAL DASHBOARD)
# → domain.com → DNS Records
# → Add CNAME: APPNAME → cname.vercel-dns.com

# 7. Add domain to Vercel (1 min)
vercel domains add APPNAME.aofa.ai --yes

# 8. Apply migrations (2 min)
cd web
supabase link --project-ref PROJECT_REF
supabase db push
```

---

## 📋 Daily Development

```powershell
# Edit files in web/src/

# Test
cd web && npm run dev

# Deploy
cd ..
git add -A && git commit -m "Add feature" && git push
vercel deploy --prod --yes
```

---

## 🗄️ Database Changes

```powershell
# Create: web/supabase/migrations/YYYYMMDD_description.sql

cd web
supabase db push
```

---

## 🔧 Common Commands

```powershell
# Check deployment status
vercel ls

# View logs
vercel logs aofai-APPNAME

# Check domains
vercel domains ls

# Pull env vars
vercel env pull web/.env.local --yes

# GitHub repo view
gh repo view
```

---

## 📁 File Patterns

### Server Action
```javascript
// web/src/app/actions.js
"use server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function myAction(formData) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  // ... logic
  revalidatePath("/");
}
```

### Client Component
```javascript
// web/src/components/my-component.jsx
"use client";
import { useState } from "react";

export default function MyComponent() {
  const [state, setState] = useState();
  return <div>...</div>;
}
```

### Migration
```sql
-- web/supabase/migrations/20251215_add_table.sql
create table if not exists public.my_table (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.my_table enable row level security;

create policy "Users can view their records"
  on public.my_table for select
  using (auth.uid() = user_id);
```

---

## ✅ Pre-Deployment Checklist

- [ ] `npm run build` succeeds
- [ ] Auth works (sign up/in/out)
- [ ] CRUD operations work
- [ ] Mobile responsive
- [ ] Error states handled

---

## 🎯 URLs for Each App

- **Live**: `https://APPNAME.aofa.ai`
- **Preview**: `https://aofai-APPNAME.vercel.app`
- **GitHub**: `https://github.com/broyles-aofa/aofai_APPNAME`
- **Vercel**: `https://vercel.com/aofa/aofai-APPNAME`
- **Supabase**: `https://supabase.com/dashboard/project/PROJECT_REF`

---

## 🔐 Environment Variables

```bash
# Required for all apps
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

---

## 🛟 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| DNS not working | Wait 30 min, verify CNAME |
| Build fails | Run `npm run build` locally |
| Auth broken | Check Supabase dashboard |
| Can't deploy | Check `vercel whoami` |

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `AOFA_TEMPLATE_SYSTEM.md` | Complete system guide |
| `NEW_APP_CHECKLIST.md` | Step-by-step setup |
| `PATTERNS.md` | Code patterns |
| `CLI_AUTOMATION_GUIDE.md` | What's automatable |
| `.cursorrules` | AI configuration |
| `CREDENTIALS.md` | App-specific credentials |

---

## 🎨 Tailwind Classes

```javascript
// Buttons
"rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"

// Input
"w-full rounded-md border border-gray-300 px-3 py-2"

// Card
"rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
```

---

**Version**: 1.0  
**Last Updated**: December 14, 2025

**Print this and keep it next to your monitor! 📄**

