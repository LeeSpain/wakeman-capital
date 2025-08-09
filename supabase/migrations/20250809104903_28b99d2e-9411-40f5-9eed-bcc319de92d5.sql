
-- Create subscribers table to track each user's subscription state
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null unique,
  stripe_customer_id text,
  subscribed boolean not null default false,
  subscription_tier text,
  subscription_end timestamp with time zone,
  updated_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now()
);

-- Helpful index for lookups by user
create index if not exists subscribers_user_id_idx on public.subscribers(user_id);

-- Enable RLS
alter table public.subscribers enable row level security;

-- Users can view ONLY their own subscription info
create policy if not exists "select_own_subscription"
on public.subscribers
for select
to authenticated
using (user_id = auth.uid() or email = auth.email());

-- Allow service-role-backed edge functions to update rows (bypasses via service role),
-- but keep a permissive update policy for authenticated users to allow future client-side edits if needed.
create policy if not exists "update_own_subscription"
on public.subscribers
for update
to authenticated
using (user_id = auth.uid() or email = auth.email());

-- Allow inserts (primarily used by service role functions; authenticated allowed here for flexibility)
create policy if not exists "insert_subscription"
on public.subscribers
for insert
to authenticated
with check (true);
