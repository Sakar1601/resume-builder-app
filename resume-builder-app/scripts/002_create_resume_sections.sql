-- Create resume sections table to store different sections of each resume
create table if not exists public.resume_sections (
  id uuid primary key default gen_random_uuid(),
  resume_id uuid not null references public.resumes(id) on delete cascade,
  section_type text not null, -- 'personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications'
  content jsonb not null default '{}'::jsonb,
  display_order integer not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.resume_sections enable row level security;

-- RLS policies - users can only access sections of their own resumes
create policy "users_select_own_resume_sections"
  on public.resume_sections for select
  using (
    exists (
      select 1 from public.resumes
      where resumes.id = resume_sections.resume_id
      and resumes.user_id = auth.uid()
    )
  );

create policy "users_insert_own_resume_sections"
  on public.resume_sections for insert
  with check (
    exists (
      select 1 from public.resumes
      where resumes.id = resume_sections.resume_id
      and resumes.user_id = auth.uid()
    )
  );

create policy "users_update_own_resume_sections"
  on public.resume_sections for update
  using (
    exists (
      select 1 from public.resumes
      where resumes.id = resume_sections.resume_id
      and resumes.user_id = auth.uid()
    )
  );

create policy "users_delete_own_resume_sections"
  on public.resume_sections for delete
  using (
    exists (
      select 1 from public.resumes
      where resumes.id = resume_sections.resume_id
      and resumes.user_id = auth.uid()
    )
  );

-- Index for faster queries
create index idx_resume_sections_resume_id on public.resume_sections(resume_id);
