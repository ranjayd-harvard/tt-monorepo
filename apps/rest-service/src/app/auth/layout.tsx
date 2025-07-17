import { AuthSessionProvider } from '@repo/auth/session-provider'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthSessionProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </AuthSessionProvider>
  )
}