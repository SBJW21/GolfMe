# Golf Me

Golf coach comparison and booking for Sydney. Built with Next.js, Supabase and Stripe Connect.

## What exists so far

- Home, coach directory with filters, coach profile with reviews and availability
- Booking page and a payment route that creates a Stripe Checkout session
- Training video library (add YouTube IDs in `lib/data.ts`)
- Coach information page
- Rules in `lib/pricing.ts`: 15% fee, 24 hour free cancellation, lessons count as done automatically 24 hours after they end
- Monthly payout logic in `lib/payouts.ts` (not yet tested against Stripe)
- Draft database schema in `supabase/schema.sql` (not yet run)

All coaches, reviews, prices and availability are SAMPLE DATA in `lib/data.ts` until Supabase is connected.

## Run locally

    npm install
    npm run dev

## Still to connect

1. Supabase project: run `supabase/schema.sql`, then add the three Supabase keys
2. Stripe account with Connect enabled: add test keys first, plus a webhook pointing at `/api/stripe/webhook`
3. Email provider for confirmations and reminders
4. Coach sign-up and login, then replace the sample data with database queries
5. Google Calendar sync for availability

## Deploying

Connect this GitHub repo to Netlify. Every push to the main branch publishes automatically.
Add the variables from `.env.example` in Netlify under Site configuration > Environment variables.
