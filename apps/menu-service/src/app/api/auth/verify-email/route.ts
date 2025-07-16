// apps/rest-service/src/app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { signIn } from 'next-auth/react'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  console.log(`[Email Verification] Processing request - Email: ${email}, Token: ${token?.substring(0, 10)}...`)

  if (!token || !email) {
    console.log('[Email Verification] Missing token or email')
    return NextResponse.redirect(new URL('/auth/error?error=MissingParameters', request.url))
  }

  try {
    // Use our custom email-link provider to verify the token
    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/callback/email-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        token,
        action: 'verify',
        redirect: false,
        callbackUrl
      })
    })

    const data = await result.json()
    console.log('[Email Verification] Verification result:', data)

    if (data.error) {
      console.log(`[Email Verification] Error: ${data.error}`)
      return NextResponse.redirect(new URL(`/auth/error?error=Verification`, request.url))
    }

    if (data.url) {
      console.log(`[Email Verification] Success - redirecting to: ${data.url}`)
      return NextResponse.redirect(new URL(data.url, request.url))
    }

    // If successful but no redirect URL, go to callback URL
    console.log(`[Email Verification] Success - redirecting to callback: ${callbackUrl}`)
    return NextResponse.redirect(new URL(callbackUrl, request.url))

  } catch (error) {
    console.error('[Email Verification] Error during verification:', error)
    return NextResponse.redirect(new URL('/auth/error?error=VerificationFailed', request.url))
  }
}