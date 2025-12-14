-- HoneyDo List - Tasks Table
-- Shared task list for household members

-- Tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  notes text,
  status text not null default 'open' check (status in ('open', 'in_progress', 'done')),
  category text not null default 'home' check (category in ('home', 'grocery')),
  created_by uuid not null references auth.users (id) on delete cascade,
  completed_by uuid references auth.users (id) on delete set null,
  completed_by_email text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

-- Enable Row Level Security
alter table public.tasks enable row level security;

-- RLS Policies - All authenticated users can see all tasks (shared household list)
create policy "Authenticated users can view all tasks"
  on public.tasks for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert tasks"
  on public.tasks for insert
  with check (auth.role() = 'authenticated' and auth.uid() = created_by);

create policy "Authenticated users can update all tasks"
  on public.tasks for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete all tasks"
  on public.tasks for delete
  using (auth.role() = 'authenticated');

-- Indexes for performance
create index if not exists idx_tasks_category on public.tasks (category);
create index if not exists idx_tasks_status on public.tasks (status);
create index if not exists idx_tasks_position on public.tasks (category, position);

