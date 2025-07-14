'use client'

import { useSession, signIn, signOut } from "@repo/auth/session-provider"
import { Button } from '@repo/ui/components'

export default function HomePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Restaurant Service</h1>
        
        {session ? (
          <div className="space-y-4">
            <p className="text-xl text-gray-600">Welcome, {session.user?.name || session.user?.email}!</p>
            <Button onClick={() => signOut()} className="bg-red-600 hover:bg-red-700">
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xl text-gray-600">Please sign in to continue</p>
            <Button onClick={() => signIn()} className="bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
