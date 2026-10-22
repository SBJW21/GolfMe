import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase clients. Never import this file into a client component.
 *
 * publicClient(): uses the publishable (anon) key. Can only read what row level security
 *   and the public views allow.
 * adminClient(): uses the secret (service role) key. Bypasses row level security, so it is
 *   used only on the server for things like checking which slots are already booked.
 *
 * Both return null when the environment variables are missing, so the site still runs
 * locally on sample data.
 */
export function publicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function adminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
