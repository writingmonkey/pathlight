-- Pathlight initial schema: profiles, readings, answers with owner-only RLS.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  birth_date date,
  birth_time time,
  birth_place text,
  sun_sign text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tier text not null default 'taste' check (tier in ('taste','full')),
  summary jsonb,
  full_guide jsonb,
  astro jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists readings_user_id_idx on public.readings(user_id);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  reading_id uuid not null references public.readings(id) on delete cascade,
  card_number int not null,
  card_slug text not null,
  question text not null,
  answer text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists answers_reading_id_idx on public.answers(reading_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.readings enable row level security;
alter table public.answers enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "readings_select_own" on public.readings
  for select using (auth.uid() = user_id);
create policy "readings_insert_own" on public.readings
  for insert with check (auth.uid() = user_id);
create policy "readings_update_own" on public.readings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "readings_delete_own" on public.readings
  for delete using (auth.uid() = user_id);

create policy "answers_select_own" on public.answers
  for select using (
    exists (select 1 from public.readings r where r.id = answers.reading_id and r.user_id = auth.uid())
  );
create policy "answers_insert_own" on public.answers
  for insert with check (
    exists (select 1 from public.readings r where r.id = answers.reading_id and r.user_id = auth.uid())
  );
create policy "answers_delete_own" on public.answers
  for delete using (
    exists (select 1 from public.readings r where r.id = answers.reading_id and r.user_id = auth.uid())
  );

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger readings_set_updated_at before update on public.readings
  for each row execute function public.set_updated_at();
