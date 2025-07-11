'use client'

import { Button } from '@repo/ui/components'
import { useSession, signIn, signOut } from '@repo/auth'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold">Blog Service</h1>
        <p className="text-lg text-muted-foreground">
          Create and manage your blog content
        </p>
        
        {session ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Hello, {session.user?.name}! Start writing your blog.
            </p>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Blog Features:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Write and edit posts</li>
                  <li>Manage categories</li>
                  <li>Schedule publications</li>
                </ul>
              </div>
              <Button onClick={() => signOut()}>Sign In</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Please sign in to write blog posts
            </p>
            <Button onClick={() => signIn()}>Sign In</Button>
          </div>
        )}
      </div>
    </div>
  )
}