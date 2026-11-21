-- ============================================================================
-- Non-destructive RLS, Realtime & Schema Cache Reload for existing confession_responses
-- Run in Supabase Dashboard -> SQL Editor (does NOT drop or recreate your table).
-- ============================================================================

-- 1. Ensure creator_name column exists without altering existing rows
alter table public.confession_responses
  add column if not exists creator_name text;

-- 2. Enable Row Level Security (RLS)
alter table public.confession_responses enable row level security;

-- 3. Refresh RLS policies safely
drop policy if exists "Allow visitor to submit response" on public.confession_responses;
drop policy if exists "Allow visitor to submit one response" on public.confession_responses;
drop policy if exists "Allow reading responses" on public.confession_responses;
drop policy if exists "Allow authenticated admin to read responses" on public.confession_responses;
drop policy if exists "Allow authenticated admin to delete test responses" on public.confession_responses;

create policy "Allow visitor to submit response"
  on public.confession_responses
  for insert
  to anon, authenticated
  with check (
    answer in ('YES', 'NO')
    and char_length(trim(coalesce(creator_name, ''))) between 1 and 60
  );

create policy "Allow reading responses"
  on public.confession_responses
  for select
  to anon, authenticated
  using (true);

create policy "Allow authenticated admin to delete test responses"
  on public.confession_responses
  for delete
  to authenticated
  using (auth.role() = 'authenticated');

-- 4. Ensure Realtime is enabled on confession_responses
do $$
begin
  alter publication supabase_realtime add table public.confession_responses;
exception
  when duplicate_object then null;
end $$;

-- 5. Reload PostgREST schema cache immediately
notify pgrst, 'reload schema';
