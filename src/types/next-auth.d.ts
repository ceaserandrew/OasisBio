import NextAuth from 'next-auth';

interface Profile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  website: string | null;
  locale: string;
  defaultLanguage: string;
}

declare module 'next-auth' {
  interface User {
    id: string;
    name: string | null;
    email: string | null;
    profile?: Profile;
  }

  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      profile?: Profile;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string | null;
    email: string | null;
    profile?: Profile;
  }
}
