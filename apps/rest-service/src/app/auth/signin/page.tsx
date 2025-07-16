// apps/rest-service/src/app/auth/signin/page.tsx
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@repo/auth/config'
import SignInPage from '@repo/ui/components/auth/signin-page'
import { getProviders } from 'next-auth/react'

export default async function SignIn() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/')
  }

  const providers = await getProviders()
  
  return <SignInPage providers={providers} />
}