import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

/** True when the site is connected to the admin backend. */
export const backendEnabled = Boolean(url && key);

export function supabase(): SupabaseClient | null {
  if (!backendEnabled) return null;
  if (!client) client = createClient(url!, key!, { auth: { persistSession: true, storageKey: "247bd-admin" } });
  return client;
}

export function errorMessage(e: unknown) {
  if (!e) return "Something went wrong. Please try again.";
  if (typeof e === "string") return e;
  const m = (e as { message?: string }).message;
  return m || "Something went wrong. Please try again.";
}
