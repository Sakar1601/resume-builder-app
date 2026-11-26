-- check_rate_limit is SECURITY DEFINER and takes the key, limit and window from its
-- caller. While anon could execute it, anyone holding the public key could reset
-- their own counter or fill up someone else's. Only the server may call it now.
--
-- Before running this, set SUPABASE_SERVICE_ROLE_KEY for the deployed app.
-- Without it the limiter's calls are rejected and it fails open.
revoke all on function public.check_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;
