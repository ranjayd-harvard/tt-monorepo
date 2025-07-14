// packages/auth/src/session-provider.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { ReactNode } from 'react'

interface AuthSessionProviderProps {
  children: ReactNode
}

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>
}

// Enhanced hook for better TypeScript support
export { useSession, signIn, signOut } from 'next-auth/react'

// Type declarations for enhanced session
declare module 'next-auth' {
  interface Session {
    provider?: string
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      phone?: string | null
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    phone?: string | null
    codeSent?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    provider?: string
    phone?: string
  }
}