-- Replaces the in-memory rate limiter (resets per serverless instance, not a
-- real cap) with an atomic Postgres counter. The table itself has no public
-- policies -- only the SECURITY DEFINER function below can touch it, so the
-- anon key can call check_rate_limit() without needing broad write access.

create table if not exists public.rate_limits (
  key text primary key,
  count integer not null default 1,
  window_start timestamptz not null default now()
);

alter table public.rate_limits enable row level security;

create or replace function public.check_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer default 60
)
returns table(allowed boolean, retry_after_seconds integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
  v_window_start timestamptz;
  v_now timestamptz := now();
begin
  insert into public.rate_limits (key, count, window_start)
  values (p_key, 1, v_now)
  on conflict (key) do update
    set count = case
          when public.rate_limits.window_start < v_now - (p_window_seconds || ' seconds')::interval
            then 1
          else public.rate_limits.count + 1
        end,
        window_start = case
          when public.rate_limits.window_start < v_now - (p_window_seconds || ' seconds')::interval
            then v_now
          else public.rate_limits.window_start
        end
  returning count, window_start into v_count, v_window_start;

  if v_count > p_limit then
    return query select false,
      greatest(0, p_window_seconds - extract(epoch from (v_now - v_window_start))::integer);
  else
    return query select true, 0;
  end if;
end;
$$;

grant execute on function public.check_rate_limit(text, integer, integer) to anon, authenticated;
