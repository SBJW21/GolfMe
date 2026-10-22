# Golf Me

Golf coach comparison and booking for Sydney. Built with Next.js, Supabase and Stripe Connect.

## What exists so far

- Home, coach directory with filters, coach profile with reviews and availability
- Booking page and a payment route that creates a Stripe Checkout session
- Training video library (add videos in the Supabase `videos` table)
- Coach information page
- Rules in `lib/pricing.ts`: 15% fee, 24 hour free cancellation, lessons count as done automatically 24 hours after they end
- Monthly payout logic in `lib/payouts.ts` (not yet tested against Stripe)
- Database schema in `supabase/schema.sql`, then `supabase/migration-002-public-views.sql`
- The site reads coaches, reviews, availability and videos from Supabase (`lib/repo.ts`)

If the database has no published coaches, the site shows SAMPLE DATA from `lib/data.ts` with a notice. As soon as one coach is published, the sample data disappears. `supabase/add-test-coach.sql` adds a single test coach.

## Run locally

    npm install
    npm run dev

## Still to connect

1. Coach sign-up and login (coaches are added by SQL for now)
2. Stripe account with Connect enabled: add test keys first, plus a webhook pointing at `/api/stripe/webhook`
3. Email provider for confirmations and reminders
4. Save bookings from the Stripe webhook, student accounts
5. Google Calendar sync for availability

## Deploying

Connect this GitHub repo to Netlify. Every push to the main branch publishes automatically.
Add the variables from `.env.example` in Netlify under Site configuration > Environment variables.
