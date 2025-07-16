import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@repo/auth/config"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    return NextResponse.json({
      session,
      status: session ? 'authenticated' : 'unauthenticated',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Debug session error:", error)
    return NextResponse.json({
      error: "Failed to get session",
      session: null,
      status: 'error'
    }, { status: 500 })
  }
}