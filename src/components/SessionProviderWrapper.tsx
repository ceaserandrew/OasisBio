'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

export interface SessionProviderWrapperProps {
  children: ReactNode;
}

export function SessionProviderWrapper({ children }: SessionProviderWrapperProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
