// packages/ui/src/components/auth/signin-page.tsx - Fixed version
'use client'

import React, { useState, useEffect } from 'react'
import { signIn, getProviders, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { Github, Mail, Phone, ArrowLeft, CheckCircle, AlertCircle, Link } from 'lucide-react'

// Google icon component
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

interface SignInPageProps {
  providers?: any
  csrfToken?: string
  error?: string
}

export default function SignInPage({ providers, csrfToken, error }: SignInPageProps) {
  const router = useRouter()
  const { data: session, status } = useSession() // FIX: Added useSession here
  const searchParams = useSearchParams()
  const [authProviders, setAuthProviders] = useState(providers)
  const [authMethod, setAuthMethod] = useState<'social' | 'email-link' | 'email-code' | 'phone'>('social')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const callbackUrl = searchParams?.get('callbackUrl') || '/'
  const errorParam = searchParams?.get('error')

  // SessionDebug component
  const SessionDebug = () => {
    if (process.env.NODE_ENV !== 'development') return null
    
    console.log("Session status:", status)
    console.log("Session data:", session)
    
    if (status === "loading") {
      return (
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded mb-4">
          <p>Loading session...</p>
        </div>
      )
    }
    
    if (status === "unauthenticated") {
      return (
        <div className="p-4 bg-red-100 border border-red-300 rounded mb-4">
          <p>❌ Not signed in</p>
        </div>
      )
    }
    
    return (
      <div className="p-4 bg-green-100 border border-green-300 rounded mb-4">
        <h2 className="text-lg font-bold mb-2">
          ✅ Signed in as {session?.user?.email || (session?.user as any)?.phone}
        </h2>
        <div className="space-y-1 text-sm">
          <p><strong>User ID:</strong> {session?.user?.id}</p>
          <p><strong>Name:</strong> {session?.user?.name}</p>
          <p><strong>Email:</strong> {session?.user?.email}</p>
          <p><strong>Provider:</strong> {(session as any)?.provider}</p>
        </div>
      </div>
    )
  }

  // Redirect if already signed in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/")
    }
  }, [status, router])
  
  if (status === "authenticated") {
    return (
      <div className="container mx-auto p-8">
        <div className="p-4 bg-green-100 border border-green-300 rounded">
          <p>✅ Already signed in. Redirecting to home...</p>
        </div>
        <SessionDebug />
      </div>
    )
  }

  useEffect(() => {
    if (!authProviders) {
      getProviders().then(setAuthProviders)
    }
  }, [authProviders])

  useEffect(() => {
    if (errorParam) {
      setMessage(getErrorMessage(errorParam))
      setMessageType('error')
    }
  }, [errorParam])

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Invalid verification code. Please try again.'
      case 'EmailSignin':
        return 'Failed to send email. Please try again.'
      case 'SessionRequired':
        return 'Please sign in to access this page.'
      case 'OAuthSignin':
        return 'Error with OAuth provider. Please try again.'
      case 'OAuthCallback':
        return 'Error during OAuth callback. Please try again.'
      case 'OAuthCreateAccount':
        return 'Could not create OAuth account. Please try again.'
      case 'EmailCreateAccount':
        return 'Could not create account with email. Please try again.'
      case 'Callback':
        return 'Error in callback. Please try again.'
      case 'OAuthAccountNotLinked':
        return 'Email already exists with different provider. Please use the original sign-in method.'
      case 'EmailSigninError':
        return 'Failed to send sign-in email. Please try again.'
      case 'CredentialsSigninError':
        return 'Invalid credentials. Please check and try again.'
      case 'Verification':
        return 'The verification link has expired or been used already.'
      default:
        return 'An error occurred. Please try again.'
    }
  }

  const handleSocialSignIn = async (providerId: string) => {
    setIsLoading(true)
    setMessage('')
    setMessageType('')
    
    try {
      const result = await signIn(providerId, { 
        callbackUrl,
        redirect: false 
      })
      
      if (result?.error) {
        setMessage('Failed to sign in with ' + providerId + '. Please try again.')
        setMessageType('error')
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      setMessage('Failed to sign in. Please try again.')
      setMessageType('error')
    }
    setIsLoading(false)
  }

  const handleEmailLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setMessage('')
    setMessageType('')
    
    try {
      // Use the built-in email provider (magic link)
      const result = await signIn('email-link', { 
        email, 
        redirect: false,
        callbackUrl 
      })
      
      if (result?.error) {
        setMessage('Failed to send email. Please try again.')
        setMessageType('error')
      } else {
        setMessage('Check your email for a sign-in link!')
        setMessageType('success')
      }
    } catch (error) {
      setMessage('Failed to send email. Please try again.')
      setMessageType('error')
    }
    setIsLoading(false)
  }

  const handleEmailCodeAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setMessage('')
    setMessageType('')
    
    try {
      if (!isCodeSent) {
        // Request verification code
        const result = await signIn('email-code', {
          email,
          action: 'request',
          redirect: false
        })
        
        console.log('Email code request result:', result)
        
        if (result?.error) {
          setMessage('Failed to send verification code. Please try again.')
          setMessageType('error')
        } else {
          setIsCodeSent(true)
          setMessage('Verification code sent! Check your email.')
          setMessageType('success')
        }
      } else {
        // Verify code
        const result = await signIn('email-code', {
          email,
          code: verificationCode,
          action: 'verify',
          callbackUrl,
          redirect: false
        })
        
        console.log('Email code verify result:', result)
        
        if (result?.error) {
          setMessage(result.error === 'CredentialsSignin' 
            ? 'Invalid or expired verification code. Please try again.' 
            : 'Failed to verify code. Please try again.')
          setMessageType('error')
        } else if (result?.ok) {
          // Force a session refresh and redirect
          window.location.href = callbackUrl
        }
      }
    } catch (error) {
      console.error('Email code auth error:', error)
      setMessage('Failed to process email authentication. Please try again.')
      setMessageType('error')
    }
    setIsLoading(false)
  }

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) return

    setIsLoading(true)
    setMessage('')
    setMessageType('')
    
    try {
      if (!isCodeSent) {
        // Request verification code
        const result = await signIn('phone', {
          phone,
          action: 'request',
          redirect: false
        })
        
        if (result?.error) {
          setMessage('Failed to send verification code. Please check your phone number and try again.')
          setMessageType('error')
        } else {
          setIsCodeSent(true)
          setMessage('Verification code sent! Check your phone.')
          setMessageType('success')
        }
      } else {
        // Verify code
        const result = await signIn('phone', {
          phone,
          code: verificationCode,
          action: 'verify',
          callbackUrl,
          redirect: false
        })
        
        if (result?.error) {
          setMessage(result.error === 'CredentialsSignin' 
            ? 'Invalid or expired verification code. Please try again.' 
            : 'Failed to verify code. Please try again.')
          setMessageType('error')
        } else if (result?.ok) {
          window.location.href = callbackUrl
        }
      }
    } catch (error) {
      setMessage('Failed to process phone authentication. Please try again.')
      setMessageType('error')
    }
    setIsLoading(false)
  }

  const resetAuth = () => {
    setIsCodeSent(false)
    setVerificationCode('')
    setMessage('')
    setMessageType('')
  }

  const resetAllAuth = () => {
    resetAuth()
    setEmail('')
    setPhone('')
  }

  // Check which providers are available
  const hasSocialProviders = authProviders?.google || authProviders?.github
  const hasEmailProvider = authProviders?.email
  const hasEmailCodeProvider = authProviders?.['email-code']
  const hasPhoneProvider = authProviders?.phone

  // Determine available auth methods
  const availableMethods = [
    hasSocialProviders && 'social',
    hasEmailProvider && 'email-link',
    hasEmailCodeProvider && 'email-code',
    hasPhoneProvider && 'phone'
  ].filter(Boolean) as ('social' | 'email-link' | 'email-code' | 'phone')[]

  // Set default method to first available
  useEffect(() => {
    if (availableMethods.length > 0 && !availableMethods.includes(authMethod)) {
      setAuthMethod(availableMethods[0])
    }
  }, [availableMethods, authMethod])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Add session debug info */}
        {process.env.NODE_ENV === 'development' && <SessionDebug />}

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center pb-8">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error/Success Message */}
            {message && (
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                messageType === 'error' 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {messageType === 'error' ? (
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                )}
                <p className="text-sm">{message}</p>
              </div>
            )}

            {/* Auth Method Selector - Only show if multiple methods available */}
            {availableMethods.length > 1 && (
              <div className="grid grid-cols-2 gap-1 bg-gray-100 p-1 rounded-lg">
                {availableMethods.map((method) => (
                  <button
                    key={method}
                    onClick={() => {
                      setAuthMethod(method)
                      resetAllAuth()
                    }}
                    className={`py-2 px-1 rounded-md text-xs font-medium transition-all ${
                      authMethod === method
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {method === 'social' ? 'Social' : 
                     method === 'email-link' ? 'Email Link' : 
                     method === 'email-code' ? 'Email Code' : 'Phone'}
                  </button>
                ))}
              </div>
            )}

            {/* Social Login */}
            {authMethod === 'social' && hasSocialProviders && (
              <div className="space-y-3">
                {authProviders?.google && (
                  <Button
                    variant="outline"
                    onClick={() => handleSocialSignIn('google')}
                    disabled={isLoading}
                    className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                    ) : (
                      <>
                        <GoogleIcon />
                        <span className="ml-3">Continue with Google</span>
                      </>
                    )}
                  </Button>
                )}
                
                {authProviders?.github && (
                  <Button
                    variant="outline"
                    onClick={() => handleSocialSignIn('github')}
                    disabled={isLoading}
                    className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                    ) : (
                      <>
                        <Github className="h-5 w-5" />
                        <span className="ml-3">Continue with GitHub</span>
                      </>
                    )}
                  </Button>
                )}

                {/* Show other options if available */}
                {(hasEmailProvider || hasEmailCodeProvider || hasPhoneProvider) && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {hasEmailProvider && (
                        <Button
                          variant="outline"
                          onClick={() => setAuthMethod('email-link')}
                          className="h-10 text-xs"
                        >
                          <Link className="h-3 w-3 mr-1" />
                          Link
                        </Button>
                      )}
                      {hasEmailCodeProvider && (
                        <Button
                          variant="outline"
                          onClick={() => setAuthMethod('email-code')}
                          className="h-10 text-xs"
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Code
                        </Button>
                      )}
                      {hasPhoneProvider && (
                        <Button
                          variant="outline"
                          onClick={() => setAuthMethod('phone')}
                          className="h-10 text-xs"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          SMS
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Email Magic Link */}
            {authMethod === 'email-link' && hasEmailProvider && (
              <form onSubmit={handleEmailLinkSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailLink">Email Address</Label>
                  <Input
                    id="emailLink"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-600">
                    We'll send you a magic link to sign in instantly
                  </p>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading || !email}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Link className="h-5 w-5 mr-2" />
                      Send Magic Link
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Email Code Authentication */}
            {authMethod === 'email-code' && hasEmailCodeProvider && (
              <form onSubmit={handleEmailCodeAuth} className="space-y-4">
                {!isCodeSent ? (
                  <div className="space-y-2">
                    <Label htmlFor="emailCode">Email Address</Label>
                    <Input
                      id="emailCode"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-600">
                      We'll send you a 6-digit verification code
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ArrowLeft 
                        className="h-4 w-4 cursor-pointer hover:text-gray-900" 
                        onClick={resetAuth}
                      />
                      Code sent to {email}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailVerificationCode">Verification Code</Label>
                      <Input
                        id="emailVerificationCode"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                        maxLength={6}
                        required
                        className="h-12 text-center text-lg tracking-wider font-mono"
                        disabled={isLoading}
                      />
                      <p className="text-xs text-gray-600">
                        Enter the 6-digit code from your email
                      </p>
                    </div>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  disabled={isLoading || (!isCodeSent && !email) || (isCodeSent && verificationCode.length !== 6)}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Mail className="h-5 w-5 mr-2" />
                      {isCodeSent ? 'Verify Code' : 'Send Code'}
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Phone Authentication */}
            {authMethod === 'phone' && hasPhoneProvider && (
              <form onSubmit={handlePhoneAuth} className="space-y-4">
                {!isCodeSent ? (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="h-12"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-600">
                      Include country code (e.g., +1 for US, +44 for UK)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ArrowLeft 
                        className="h-4 w-4 cursor-pointer hover:text-gray-900" 
                        onClick={resetAuth}
                      />
                      Code sent to {phone}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneCode">Verification Code</Label>
                      <Input
                        id="phoneCode"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                        maxLength={6}
                        required
                        className="h-12 text-center text-lg tracking-wider font-mono"
                        disabled={isLoading}
                      />
                      <p className="text-xs text-gray-600">
                        Enter the 6-digit code from your SMS
                      </p>
                    </div>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  disabled={isLoading || (!isCodeSent && !phone) || (isCodeSent && verificationCode.length !== 6)}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Phone className="h-5 w-5 mr-2" />
                      {isCodeSent ? 'Verify Code' : 'Send Code'}
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* No auth methods available */}
            {availableMethods.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No authentication methods configured.</p>
                <p className="text-sm text-gray-500">Please configure MongoDB and your authentication providers in environment variables.</p>
              </div>
            )}

            {/* Back to Home */}
            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="w-full text-gray-600 hover:text-gray-900"
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}