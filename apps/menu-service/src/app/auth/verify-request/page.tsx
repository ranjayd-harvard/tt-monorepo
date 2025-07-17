// apps/{service}/src/app/auth/verify-request/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components'
import { Button } from '@repo/ui/components'
import { Mail } from 'lucide-react'
import Link from 'next/link'

export default function VerifyRequest() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl">Check Your Email</CardTitle>
          <CardDescription>
            A sign in link has been sent to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">
              Click the link in the email to complete your sign in. You can close this window.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/auth/signin">
                Back to Sign In
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}