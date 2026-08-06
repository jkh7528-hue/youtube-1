/**
 * Central place to read environment variables with a clear error instead of a
 * cryptic `undefined` failure three layers down. Server-only secrets are only
 * read inside server code (Server Actions, Route Handlers, Server Components),
 * so this file must never be imported from a "use client" component.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[env] ${name} is not set. Copy .env.example to .env.local and fill it in.`
    );
  }
  return value;
}

export const env = {
  get supabaseUrl() {
    return required("NEXT_PUBLIC_SUPABASE_URL");
  },
  get supabasePublishableKey() {
    return required("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  },
  get supabaseSecretKey() {
    return required("SUPABASE_SECRET_KEY");
  },
  get youtubeApiKey() {
    return required("YOUTUBE_API_KEY");
  },
  get cronSecret() {
    return process.env.CRON_SECRET ?? "";
  },
  /** Empty string disables the password gate. */
  get appPassword() {
    return process.env.APP_PASSWORD ?? "";
  },
};
