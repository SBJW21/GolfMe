-- Golf Me migration 002: safe public views, plus coach gender and levels for the matching quiz.
-- Run once in the Supabase SQL editor (after schema.sql).

alter table coaches add column if not exists gender text
  check (gender in ('woman', 'man', 'non_binary'));
alter table coaches add column if not exists levels text[] not null default '{}';

-- The public site reads these views, not the tables. They only expose what visitors should see
-- (no Stripe account ids, no user ids) and only for published coaches.
create or replace view public_coaches as
select id, slug, name, suburb, headline, bio, years_coaching, price_cents,
       focus, gender, levels, instagram, website
from coaches
where published;

create or replace view public_reviews as
select r.id, r.coach_id, r.rating, r.comment, r.created_at,
       split_part(p.full_name, ' ', 1) as author_first_name
from reviews r
join profiles p on p.id = r.student_id
join coaches c on c.id = r.coach_id and c.published;

create or replace view public_availability as
select a.coach_id, a.weekday, a.start_time, a.end_time
from availability_rules a
join coaches c on c.id = a.coach_id and c.published;

grant select on public_coaches, public_reviews, public_availability to anon, authenticated;

-- Visitors who are not signed in can no longer read the raw coaches table.
revoke select on coaches from anon;
