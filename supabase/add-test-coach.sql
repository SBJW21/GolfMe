-- Adds ONE test coach so you can see the database working on the site.
-- Edit the values, then run in the Supabase SQL editor. Delete the coach when you are done testing.
-- Needs migration-002-public-views.sql to have been run first.

with new_coach as (
  insert into coaches (slug, name, suburb, headline, bio, years_coaching, price_cents, focus, gender, levels, published)
  values (
    'test-coach',
    'Test Coach',
    'Manly',
    'A test coach added from the database',
    'This coach comes from Supabase, not the sample data. Delete it before launch.',
    10,
    9000,
    array['Slice', 'Chipping'],
    'man',
    array['Beginner', 'Intermediate'],
    true
  )
  returning id
)
-- Weekly availability: weekday 0 = Sunday. Hours run in Sydney local time.
insert into availability_rules (coach_id, weekday, start_time, end_time)
select id, d, '07:00', '10:00' from new_coach, unnest(array[2, 4, 6]) as d;

-- To remove the test coach later:
-- delete from coaches where slug = 'test-coach';
