-- AOFA Template - Hello World Database Schema
-- This creates a simple "notes" table to verify the stack works

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Notes table (Hello World example)
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update timestamp trigger
create or replace function public.set_notes_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_notes_updated_at on public.notes;
create trigger set_notes_updated_at
  before update on public.notes
  for each row execute procedure public.set_notes_updated_at();

-- Enable Row Level Security
alter table public.notes enable row level security;

-- RLS Policies
drop policy if exists "Users can view their notes" on public.notes;
create policy "Users can view their notes"
  on public.notes for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their notes" on public.notes;
create policy "Users can insert their notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their notes" on public.notes;
create policy "Users can update their notes"
  on public.notes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their notes" on public.notes;
create policy "Users can delete their notes"
  on public.notes for delete
  using (auth.uid() = user_id);

-- Indexes
create index if not exists idx_notes_user_id on public.notes (user_id);
create index if not exists idx_notes_created_at on public.notes (user_id, created_at desc);

