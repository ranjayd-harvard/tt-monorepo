// Create this file: apps/rest-service/components/SessionDebug.tsx
'use client'

import { useSession } from "next-auth/react"

export default function SessionDebug() {
  const { data: session, status } = useSession()
  
  console.log("Session status:", status)
  console.log("Session data:", session)
  
  if (status === "loading") {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
        <p>Loading session...</p>
      </div>
    )
  }
  
  if (status === "unauthenticated") {
    return (
      <div className="p-4 bg-red-100 border border-red-300 rounded">
        <p>❌ Not signed in</p>
      </div>
    )
  }
  
  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded">
      <h2 className="text-lg font-bold mb-2">
        ✅ Signed in as {session?.user?.email || session?.user?.phone}
      </h2>
      <div className="space-y-1 text-sm">
        <p><strong>User ID:</strong> {session?.user?.id}</p>
        <p><strong>Name:</strong> {session?.user?.name}</p>
        <p><strong>Email:</strong> {session?.user?.email}</p>
        <p><strong>Phone:</strong> {(session?.user as any)?.phone}</p>
        <p><strong>Provider:</strong> {(session as any)?.provider}</p>
      </div>
      <details className="mt-4">
        <summary className="cursor-pointer font-medium">Full Session Data</summary>
        <pre className="mt-2 p-2 bg-gray-100 text-xs overflow-auto rounded">
          {JSON.stringify(session, null, 2)}
        </pre>
      </details>
    </div>
  )
}