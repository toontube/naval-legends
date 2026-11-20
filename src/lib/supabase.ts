import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Server-only client. Uses service_role — never import from client/browser code.
export function getSupabase(): SupabaseClient {
  if (!url) throw new Error('SUPABASE_URL missing');
  if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY missing');
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
