// Client-side authentication utilities using Supabase

import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from './supabase';

// Create auth context
const AuthContext = createContext(undefined);

// Auth provider component
export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
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
  const signInWithEmail = async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    return { error };
  };

  // Verify OTP
  const verifyOtp = async (email, token) => {
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
export const signIn = (provider, options) => {
  if (provider === 'credentials') {
    // For email/password (not used in our implementation)
    return Promise.resolve({ error: null });
  } else {
    // For social providers
    return supabase.auth.signInWithOAuth({
      provider: provider,
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