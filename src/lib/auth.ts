import 'server-only';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { prisma } from '@/lib/prisma';

export async function getServerSession(cookies?: string) {
  try {
    if (!cookies) {
      return null;
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(cookies);
    
    if (error || !user) {
      return null;
    }

    return { user };
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

