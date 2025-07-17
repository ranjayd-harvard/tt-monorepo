import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components';
import { Button } from '@repo/ui/components';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AuthError({
  searchParams
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams.error

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'Signin':
        return 'Try signing in with a different account.'
      case 'OAuthSignin':
        return 'Try signing in with a different account.'
      case 'OAuthCallback':
        return 'Try signing in with a different account.'
      case 'OAuthCreateAccount':
        return 'Try signing in with a different account.'
      case 'EmailCreateAccount':
        return 'Try signing in with a different account.'
      case 'Callback':
        return 'Try signing in with a different account.'
      case 'OAuthAccountNotLinked':
        return 'To confirm your identity, sign in with the same account you used originally.'
      case 'EmailSignin':
        return 'Check your email address.'
      case 'CredentialsSignin':
        return 'Sign in failed. Check the details you provided are correct.'
      default:
        return 'Unable to sign in.'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">Authentication Error</CardTitle>
          <CardDescription>
            {error ? getErrorMessage(error) : 'An error occurred during authentication.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/auth/signin">
              Try Again
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}