
-- 1) Utility: updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2) Videos table
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  description text,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists videos_published_order_idx on public.videos (is_published, sort_order, created_at desc);

alter table public.videos enable row level security;

-- Authenticated users can read only published videos
create policy if not exists "Authenticated can read published videos"
  on public.videos
  for select
  using (auth.role() = 'authenticated' and is_published = true);

-- Admins can read all videos
create policy if not exists "Admins can read all videos"
  on public.videos
  for select
  using (public.has_role(auth.uid(), 'admin'));

-- Admins can manage videos
create policy if not exists "Admins can manage videos"
  on public.videos
  for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

drop trigger if exists set_videos_updated_at on public.videos;
create trigger set_videos_updated_at
  before update on public.videos
  for each row
  execute function public.set_updated_at();

-- 3) Videos settings table (singleton via key='default')
create table if not exists public.videos_settings (
  key text primary key default 'default',
  nav_label text not null default 'Videos',
  page_title text not null default 'How‑to Videos',
  page_description text,
  show_in_nav boolean not null default true,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.videos_settings enable row level security;

-- Authenticated users can read settings
create policy if not exists "Authenticated can read videos settings"
  on public.videos_settings
  for select
  using (auth.role() = 'authenticated');

-- Admins can manage settings
create policy if not exists "Admins can manage videos settings"
  on public.videos_settings
  for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

drop trigger if exists set_videos_settings_updated_at on public.videos_settings;
create trigger set_videos_settings_updated_at
  before update on public.videos_settings
  for each row
  execute function public.set_updated_at();

-- 4) Seed default settings row (idempotent via key)
insert into public.videos_settings (key, page_description)
values ('default', 'Short tutorials to get the most out of the platform.')
on conflict (key) do nothing;
