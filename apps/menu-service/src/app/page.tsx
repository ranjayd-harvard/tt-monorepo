'use client'

import { Button } from '@repo/ui/components'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Loading...</p>

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Menu Service Name</h1>
      
      {session ? (
        <div>
          <p className="mb-4">Welcome, {session.user?.name}!</p>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
      ) : (
        <div>
          <p className="mb-4">Please sign in to continue</p>
          <Button onClick={() => signIn()}>Sign In</Button>
        </div>
      )}
    </main>
  )
}