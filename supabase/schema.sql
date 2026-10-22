-- Golf Me database schema (draft v1) for Supabase / Postgres.
-- Run in the Supabase SQL editor. Review before going live: this has not been tested yet.
-- All money is stored in cents (AUD).

create extension if not exists "pgcrypto";

-- People ---------------------------------------------------------------

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('golfer', 'coach')) default 'golfer',
  suburb text,
  created_at timestamptz not null default now()
);

create table if not exists coaches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references profiles (id) on delete cascade,
  slug text unique not null,
  name text not null,
  suburb text not null,
  headline text,
  bio text,
  years_coaching int,
  price_cents int not null check (price_cents > 0),
  focus text[] not null default '{}',
  instagram text,
  website text,
  stripe_account_id text,           -- Stripe Connect account used for monthly payouts
  google_calendar_connected boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Availability ---------------------------------------------------------

-- Recurring weekly availability (0 = Sunday)
create table if not exists availability_rules (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references coaches (id) on delete cascade,
  weekday int not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  check (end_time > start_time)
);

-- Bookings -------------------------------------------------------------

do $$ begin
  create type booking_status as enum
    ('pending', 'confirmed', 'cancelled', 'completed', 'disputed');
exception when duplicate_object then null; end $$;

create table if not exists payouts (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references coaches (id),
  period_start date not null,
  period_end date not null,
  gross_cents int not null,
  fee_cents int not null,
  net_cents int not null,
  stripe_transfer_id text,
  status text not null check (status in ('pending', 'paid', 'failed')) default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references coaches (id),
  student_id uuid not null references profiles (id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  amount_cents int not null check (amount_cents > 0),
  fee_cents int not null check (fee_cents >= 0),
  status booking_status not null default 'pending',
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  cancelled_at timestamptz,
  refund_cents int not null default 0,
  completed_at timestamptz,
  payout_id uuid references payouts (id),
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

-- A coach cannot be double booked
create unique index if not exists bookings_no_double_booking
  on bookings (coach_id, starts_at)
  where status in ('pending', 'confirmed', 'completed');

create index if not exists bookings_coach_idx on bookings (coach_id, starts_at);
create index if not exists bookings_student_idx on bookings (student_id, starts_at);

-- Reviews and lesson notes --------------------------------------------

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid unique not null references bookings (id) on delete cascade,
  coach_id uuid not null references coaches (id),
  student_id uuid not null references profiles (id),
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists lesson_notes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid unique not null references bookings (id) on delete cascade,
  coach_id uuid not null references coaches (id),
  student_id uuid not null references profiles (id),
  coach_notes text,                 -- private to the coach
  student_summary text,             -- shared with the student
  scores jsonb,                     -- for example {"strokes": 92, "fairways": 7}
  created_at timestamptz not null default now()
);

-- Training library -----------------------------------------------------

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  youtube_id text not null,
  sort int not null default 0
);

-- Row level security ---------------------------------------------------

alter table profiles enable row level security;
alter table coaches enable row level security;
alter table availability_rules enable row level security;
alter table bookings enable row level security;
alter table payouts enable row level security;
alter table reviews enable row level security;
alter table lesson_notes enable row level security;
alter table videos enable row level security;

-- Profiles: you can see and edit your own
create policy "profiles self read" on profiles for select using (auth.uid() = id);
create policy "profiles self write" on profiles for update using (auth.uid() = id);

-- Coaches: published coaches are public, coaches manage their own row
create policy "coaches public read" on coaches for select using (published or user_id = auth.uid());
create policy "coaches self write" on coaches for update using (user_id = auth.uid());

-- Availability: public read for published coaches, coach manages their own
create policy "availability public read" on availability_rules for select
  using (exists (select 1 from coaches c where c.id = coach_id and (c.published or c.user_id = auth.uid())));
create policy "availability coach write" on availability_rules for all
  using (exists (select 1 from coaches c where c.id = coach_id and c.user_id = auth.uid()));

-- Bookings: visible to the student and the coach. Created and updated by the server using the service role.
create policy "bookings parties read" on bookings for select
  using (student_id = auth.uid()
         or exists (select 1 from coaches c where c.id = coach_id and c.user_id = auth.uid()));

-- Payouts: coaches see their own
create policy "payouts coach read" on payouts for select
  using (exists (select 1 from coaches c where c.id = coach_id and c.user_id = auth.uid()));

-- Reviews: public read, students write one per completed booking of their own
create policy "reviews public read" on reviews for select using (true);
create policy "reviews student insert" on reviews for insert
  with check (
    student_id = auth.uid()
    and exists (select 1 from bookings b
                where b.id = booking_id and b.student_id = auth.uid() and b.status = 'completed')
  );

-- Lesson notes: the coach and the student on the booking
create policy "notes parties read" on lesson_notes for select
  using (student_id = auth.uid()
         or exists (select 1 from coaches c where c.id = coach_id and c.user_id = auth.uid()));
create policy "notes coach write" on lesson_notes for all
  using (exists (select 1 from coaches c where c.id = coach_id and c.user_id = auth.uid()));

-- Videos: public read
create policy "videos public read" on videos for select using (true);

-- Note: the private column lesson_notes.coach_notes must be hidden from students.
-- Before launch, expose notes to students through a view that excludes coach_notes.
