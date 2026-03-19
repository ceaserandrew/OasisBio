// Client-side authentication utilities using Supabase

import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from './supabase';

// Create auth context
interface AuthContextType {
  user: any;
  session: any;
  isLoading: boolean;
  signInWithEmail: (email: string) => Promise<{ error: any }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with email (send OTP)
  const signInWithEmail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    return { error };
  };

  // Verify OTP
  const verifyOtp = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });
    return { error };
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    isLoading,
    signInWithEmail,
    verifyOtp,
    signOut
  };

  // Use React.createElement instead of JSX
  return React.createElement(AuthContext.Provider, { value: value }, children);
};

// Custom hook to use auth
export const useSession = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return {
    data: context.session ? { user: context.user, session: context.session } : null,
    status: context.isLoading ? 'loading' : context.session ? 'authenticated' : 'unauthenticated'
  };
};

// Export signIn function
export const signIn = (provider: string, options?: { callbackUrl?: string }) => {
  if (provider === 'credentials') {
    // For email/password (not used in our implementation)
    return Promise.resolve({ error: null });
  } else {
    // For social providers
    return supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: options?.callbackUrl || window.location.origin
      }
    });
  }
};

// Mock authOptions for compatibility
export const authOptions = {
  adapter: null,
  providers: [],
  session: {
    strategy: 'jwt'
  },
  secret: 'mock-secret'
};

// Export signOut function
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};