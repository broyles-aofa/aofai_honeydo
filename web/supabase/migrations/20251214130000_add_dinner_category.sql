-- Add 'dinner' to category check constraint

-- Drop the old constraint
alter table public.tasks drop constraint if exists tasks_category_check;

-- Add new constraint with dinner category
alter table public.tasks add constraint tasks_category_check 
  check (category in ('home', 'grocery', 'dinner'));

