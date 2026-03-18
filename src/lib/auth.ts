import 'server-only';

import supabase from './supabase';

// Server-side authentication utilities
export const getServerSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Auth utilities for server-side use
export default {
  getServerSession,
  getUser,
  signOut,
};
