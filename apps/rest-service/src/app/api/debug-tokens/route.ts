// apps/rest-service/src/app/api/debug-tokens/route.ts
import { debugVerificationTokens, testMongoConnection } from '@repo/auth/config'

export async function GET() {
  try {
    const isConnected = await testMongoConnection()
    const tokens = await debugVerificationTokens()
    
    return Response.json({
      mongodb_connected: isConnected,
      verification_tokens_count: tokens.length,
      verification_tokens: tokens.map(token => ({
        identifier: token.identifier,
        token: token.token?.substring(0, 20) + '...', // Only show first 20 chars for security
        expires: token.expires,
        created: token._id?.getTimestamp?.() || 'unknown'
      })),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return Response.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}