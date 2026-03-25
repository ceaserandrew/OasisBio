import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function getServerSession(cookies?: string) {
  try {
    if (!cookies) {
      return null;
    }

    const { data: { session }, error } = await supabaseAdmin.auth.getUser(cookies);
    
    if (error || !session) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function getUserFromSession(session: any) {
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profiles: true,
    },
  });

  return user;
}

export async function signOut() {
  return { error: null };
}

export default {
  getServerSession,
  getUserFromSession,
  signOut,
};
