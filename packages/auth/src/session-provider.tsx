// packages/auth/src/session-provider.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { ReactNode } from 'react'

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}