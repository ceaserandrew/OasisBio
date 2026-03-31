import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const globalForSupabaseClient = global as unknown as { supabaseClient: ReturnType<typeof createClient> };

export const supabaseClient =
  globalForSupabaseClient.supabaseClient ||
  createClient(supabaseUrl, supabaseAnonKey);

if (process.env.NODE_ENV !== 'production') {
  globalForSupabaseClient.supabaseClient = supabaseClient;
}

export default supabaseClient;
