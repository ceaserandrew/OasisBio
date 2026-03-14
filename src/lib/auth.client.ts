// Mock version of auth for client-side use
// This prevents client-side code from importing the real auth module

import { SessionProvider } from 'next-auth/react';

export { SessionProvider } from 'next-auth/react';
export { useSession, signOut, signIn } from 'next-auth/react';

// Mock authOptions for client-side use
export const authOptions = {
  adapter: null,
  providers: [],
  session: {
    strategy: 'jwt' as const,
  },
  secret: 'mock-secret',
};