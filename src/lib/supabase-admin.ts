import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const globalForSupabaseAdmin = global as unknown as { supabaseAdmin: ReturnType<typeof createClient> };

export const supabaseAdmin =
  globalForSupabaseAdmin.supabaseAdmin ||
  createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForSupabaseAdmin.supabaseAdmin = supabaseAdmin;
}
