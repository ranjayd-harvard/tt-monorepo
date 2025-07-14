// apps/[service]/src/app/api/auth/phone/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendPhoneVerification, verifyPhoneCode } from '@repo/auth/config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, phone, code } = body

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    if (action === 'send') {
      const success = await sendPhoneVerification(phone)
      
      if (success) {
        return NextResponse.json({ 
          success: true, 
          message: 'Verification code sent successfully' 
        })
      } else {
        return NextResponse.json(
          { error: 'Failed to send verification code' },
          { status: 500 }
        )
      }
    } else if (action === 'verify') {
      if (!code) {
        return NextResponse.json(
          { error: 'Verification code is required' },
          { status: 400 }
        )
      }

      const isValid = verifyPhoneCode(phone, code)
      
      if (isValid) {
        return NextResponse.json({ 
          success: true, 
          message: 'Phone number verified successfully' 
        })
      } else {
        return NextResponse.json(
          { error: 'Invalid or expired verification code' },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "send" or "verify"' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Phone verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}