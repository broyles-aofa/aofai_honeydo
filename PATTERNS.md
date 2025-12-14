# AOFA Code Patterns & Best Practices

**Version**: 1.0  
**Last Updated**: December 14, 2025  
**Purpose**: Standardized code patterns for all AOFA applications

---

## 🎯 Core Principles

1. **Server-First**: Use Server Components by default
2. **Simple**: Prefer simple solutions over clever ones
3. **Consistent**: Follow these patterns in every app
4. **Secure**: Authentication and RLS on everything
5. **Fast**: Optimize for perceived performance

---

## 📁 File Structure Pattern

```
web/
├── src/
│   ├── app/
│   │   ├── actions.js          # ALL server actions here
│   │   ├── layout.js           # Root layout with auth
│   │   ├── page.js             # Homepage (Server Component)
│   │   └── globals.css         # Global Tailwind styles
│   │
│   ├── components/
│   │   ├── auth-panel.jsx      # Reusable auth UI
│   │   ├── {feature}-{component}.jsx
│   │   └── ...
│   │
│   └── lib/
│       ├── supabase/
│       │   ├── client.js       # Browser Supabase client
│       │   └── server.js       # Server Supabase client
│       └── utils.js            # Shared utilities
│
├── supabase/
│   ├── config.toml
│   ├── schema.sql              # Base schema
│   ├── seed.sql                # Seed data (optional)
│   └── migrations/
│       └── YYYYMMDD_description.sql
│
├── package.json
├── next.config.mjs
└── env.example
```

---

## 🔐 Authentication Pattern

### Supabase Server Client
```javascript
// web/src/lib/supabase/server.js
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // Handle middleware context where cookies can't be set
          }
        },
      },
    }
  );
}
```

### Supabase Browser Client
```javascript
// web/src/lib/supabase/client.js
import { createBrowserClient } from "@supabase/ssr";

export function createBrowserSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
```

### Server Action with Auth
```javascript
// web/src/app/actions.js
"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function getUserOrThrow() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return { supabase, user };
}

export async function createItem(formData) {
  const { supabase, user } = await getUserOrThrow();

  const title = formData.get("title")?.toString().trim();
  
  if (!title) {
    throw new Error("Title is required");
  }

  const { error } = await supabase.from("items").insert({
    title,
    user_id: user.id,
  });

  if (error) throw error;

  revalidatePath("/");
}
```

---

## 🗄️ Database Pattern

### Base Schema
```sql
-- web/supabase/schema.sql

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Example table
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update timestamp trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_items_updated_at on public.items;
create trigger set_items_updated_at
  before update on public.items
  for each row execute procedure public.set_updated_at();

-- Enable Row Level Security
alter table public.items enable row level security;

-- RLS Policies
drop policy if exists "Users can view their items" on public.items;
create policy "Users can view their items"
  on public.items for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their items" on public.items;
create policy "Users can insert their items"
  on public.items for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their items" on public.items;
create policy "Users can update their items"
  on public.items for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their items" on public.items;
create policy "Users can delete their items"
  on public.items for delete
  using (auth.uid() = user_id);

-- Indexes
create index if not exists idx_items_user_id on public.items (user_id);
```

### Migration Pattern
```sql
-- web/supabase/migrations/20251214_add_feature.sql

-- Add new column
alter table public.items
  add column if not exists priority integer default 0;

-- Add index
create index if not exists idx_items_priority 
  on public.items (user_id, priority);

-- Add comment
comment on column public.items.priority is 'Item priority (0=low, 1=medium, 2=high)';
```

---

## ⚛️ Component Patterns

### Server Component (Default)
```javascript
// web/src/app/page.js
import { createServerSupabaseClient } from "@/lib/supabase/server";
import ItemList from "@/components/item-list";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return <div>Please sign in</div>;
  }

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Items</h1>
      <ItemList items={items || []} />
    </main>
  );
}
```

### Client Component with Form
```javascript
// web/src/components/item-form.jsx
"use client";

import { useState, useTransition } from "react";
import { createItem } from "@/app/actions";

export default function ItemForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target);

    startTransition(async () => {
      try {
        await createItem(formData);
        e.target.reset();
      } catch (err) {
        setError(err.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          disabled={isPending}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Item"}
      </button>
    </form>
  );
}
```

### Optimistic Update Pattern
```javascript
"use client";

import { useOptimistic } from "react";
import { deleteItem } from "@/app/actions";

export default function ItemList({ items }) {
  const [optimisticItems, updateOptimistic] = useOptimistic(
    items,
    (state, removedId) => state.filter(item => item.id !== removedId)
  );

  const handleDelete = async (id) => {
    updateOptimistic(id);
    await deleteItem(id);
  };

  return (
    <ul className="space-y-2">
      {optimisticItems.map(item => (
        <li key={item.id} className="flex items-center justify-between p-3 border rounded">
          <span>{item.title}</span>
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## 🎨 Styling Pattern

### Tailwind Configuration
```javascript
// web/tailwind.config.js
export default {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
```

### Common Tailwind Patterns
```javascript
// Button styles
const buttonStyles = {
  primary: "rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-50",
  secondary: "rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:opacity-50",
  danger: "rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-500 disabled:opacity-50",
};

// Input styles
const inputStyles = "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

// Card styles
const cardStyles = "rounded-lg border border-gray-200 bg-white p-4 shadow-sm";
```

---

## 🚀 Deployment Pattern

### Environment Variables
```bash
# Required for all apps
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Add to Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Pull locally
vercel env pull web/.env.local --yes
```

### Deployment Script
```powershell
# web/deploy.ps1
# Build and deploy to production

# Ensure we're in web directory
cd $PSScriptRoot

# Build locally to catch errors
Write-Host "Building locally..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Fix errors before deploying." -ForegroundColor Red
    exit 1
}

# Deploy to production
Write-Host "Deploying to Vercel..." -ForegroundColor Cyan
cd ..
vercel deploy --prod --yes

Write-Host "Deployment complete!" -ForegroundColor Green
```

---

## 🧪 Testing Checklist

Before deploying:
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript/ESLint errors
- [ ] Auth flow works (sign up, sign in, sign out)
- [ ] Create/Read/Update/Delete operations work
- [ ] RLS policies prevent unauthorized access
- [ ] Mobile responsive (test at 375px width)
- [ ] Error states handled gracefully
- [ ] Loading states shown during async operations

---

## 🔧 Common Utilities

### Date Formatting
```javascript
// web/src/lib/utils.js
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
```

### Validation
```javascript
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateRequired(value, fieldName) {
  if (!value?.toString().trim()) {
    throw new Error(`${fieldName} is required`);
  }
}
```

---

## 📦 Package.json Pattern

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.47.10",
    "next": "^15.1.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "eslint": "^9",
    "eslint-config-next": "^15.1.3",
    "postcss": "^8",
    "tailwindcss": "^3.4.1"
  }
}
```

---

## 🎯 Key Takeaways

1. **Server Components are default** - Add "use client" only when needed
2. **One actions.js file** - All server actions in one place
3. **RLS over manual checks** - Let PostgreSQL handle access control
4. **Tailwind for all styling** - No CSS modules or styled-components
5. **Simple > Clever** - Choose readable code over clever tricks

---

**Remember**: These patterns exist to make development faster and more consistent.
Follow them in every AOFA app, and update this file when you discover better patterns.

Last Updated: December 14, 2025

