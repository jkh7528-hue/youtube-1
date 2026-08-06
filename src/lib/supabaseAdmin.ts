import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Server-only Supabase client using the secret/service-role key. This client
 * bypasses Row Level Security, so it must never be imported from a
 * "use client" component — the `server-only` import above throws a build
 * error if that ever happens by accident.
 *
 * Every read/write in this app goes through this client from Server
 * Components, Server Actions, or the cron Route Handler. There is no
 * client-side Supabase usage for this feature.
 *
 * The real client is created lazily (on first actual call) instead of at
 * module load, so `next build`'s route data collection — which imports
 * every route module — doesn't hard-require Supabase env vars to be
 * present. They're still required at request time.
 */
let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseSecretKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}

export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});
