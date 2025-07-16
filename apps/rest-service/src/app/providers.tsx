// Create or update: apps/rest-service/app/providers.tsx

import { AuthSessionProvider } from '@repo/auth/session-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      {children}
    </AuthSessionProvider>
  )
}