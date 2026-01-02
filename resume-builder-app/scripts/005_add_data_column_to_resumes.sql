-- Add data column to resumes table to store structured resume data
alter table public.resumes 
add column if not exists data jsonb default '{}'::jsonb;

-- Add index for data column for better query performance
create index if not exists idx_resumes_data on public.resumes using gin(data);
