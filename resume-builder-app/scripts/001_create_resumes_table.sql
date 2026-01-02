-- Create resumes table with user ownership
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  template text not null default 'modern',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.resumes enable row level security;

-- RLS policies for resumes
create policy "users_select_own_resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

create policy "users_insert_own_resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

create policy "users_update_own_resumes"
  on public.resumes for update
  using (auth.uid() = user_id);

create policy "users_delete_own_resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);
