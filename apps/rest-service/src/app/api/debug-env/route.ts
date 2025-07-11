// apps/rest-service/src/app/api/debug-env/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Not Set',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not Set',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Not Set',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Not Set',
    GITHUB_ID: process.env.GITHUB_ID ? '✅ Set' : '❌ Not Set',
    GITHUB_SECRET: process.env.GITHUB_SECRET ? '✅ Set' : '❌ Not Set',
    NODE_ENV: process.env.NODE_ENV,
    // Show first few characters of actual values for debugging (be careful!)
    GOOGLE_CLIENT_ID_PREVIEW: process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + '...',
    NEXTAUTH_SECRET_PREVIEW: process.env.NEXTAUTH_SECRET?.substring(0, 10) + '...'
  })
}