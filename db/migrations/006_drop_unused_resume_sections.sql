-- resume_sections was superseded by the `data` jsonb column added on resumes
-- (migration 005) before any application code ever queried it. Dropping the
-- unused table and its RLS policies rather than leaving dead schema in place.
drop table if exists public.resume_sections;
