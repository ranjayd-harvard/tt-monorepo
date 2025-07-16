// packages/auth/src/config.ts - Completely fixed solution with custom email verification
import type { NextAuthOptions } from "next-auth"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { Resend } from "resend"
import twilio from "twilio"
import crypto from "crypto"

// MongoDB client setup with proper error handling
let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local')
}

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(process.env.MONGODB_URI)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(process.env.MONGODB_URI)
  clientPromise = client.connect()
}

// Initialize Resend for email (only if API key is provided)
let resend: Resend | null = null
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY)
}

// Initialize Twilio for phone (only if credentials are provided)
let twilioClient: any = null
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )
}

// MongoDB collection for ALL verification (email links + codes)
async function getVerificationCollection() {
  const client = await clientPromise
  return client.db().collection("our_verification_tokens")
}

// Helper to store verification token/code in MongoDB
async function storeVerification(identifier: string, token: string, type: 'email-link' | 'email-code' | 'phone', expiresIn: number = 10 * 60 * 1000) {
  try {
    const collection = await getVerificationCollection()
    const expires = new Date(Date.now() + expiresIn)
    
    const verification = {
      identifier,
      token,
      type,
      expires,
      createdAt: new Date()
    }
    
    await collection.replaceOne(
      { identifier, type },
      verification,
      { upsert: true }
    )
    
    console.log(`[Verification] Stored ${type} token for: ${identifier}`)
    return verification
  } catch (error) {
    console.error(`[Verification] Failed to store ${type} token:`, error)
    throw error
  }
}

// Helper to verify and consume token/code from MongoDB
async function verifyAndConsumeToken(identifier: string, token: string, type: 'email-link' | 'email-code' | 'phone'): Promise<boolean> {
  try {
    const collection = await getVerificationCollection()
    
    const stored = await collection.findOne({ identifier, type })
    
    if (!stored || stored.expires < new Date()) {
      if (stored) {
        await collection.deleteOne({ _id: stored._id })
      }
      console.log(`[Verification] ${type} token expired or not found for: ${identifier}`)
      return false
    }
    
    if (stored.token !== token) {
      console.log(`[Verification] Invalid ${type} token for: ${identifier}`)
      return false
    }
    
    // Clean up used token
    await collection.deleteOne({ _id: stored._id })
    console.log(`[Verification] ${type} token verified and consumed for: ${identifier}`)
    return true
  } catch (error) {
    console.error(`[Verification] Failed to verify ${type} token:`, error)
    return false
  }
}

// Helper to create or update user in database
async function createOrUpdateUser(email: string, phone?: string) {
  try {
    const client = await clientPromise
    const users = client.db().collection("users")
    
    const query = email ? { email } : { phone }
    let user = await users.findOne(query)
    
    if (!user) {
      // Create new user with NextAuth expected structure
      const newUser = {
        email: email || null,
        phone: phone || null,
        name: email ? email.split('@')[0] : `User ${phone}`,
        emailVerified: email ? new Date() : null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      const result = await users.insertOne(newUser)
      user = { ...newUser, _id: result.insertedId }
      console.log(`[User] Created new user: ${email || phone}`)
    } else {
      // Update existing user
      const updateData = { 
        updatedAt: new Date(),
        ...(email && { emailVerified: new Date() })
      }
      
      await users.updateOne(
        { _id: user._id },
        { $set: updateData }
      )
      console.log(`[User] Updated existing user: ${email || phone}`)
    }
    
    // Return user object in NextAuth expected format
    return {
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
      name: user.name,
      image: user.image,
      emailVerified: user.emailVerified
    }
  } catch (error) {
    console.error('[User] Failed to create/update user:', error)
    throw error
  }
}

// Create providers array based on available environment variables
const providers = [
  // Social Providers (only if credentials are provided)
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ] : []),

  ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  ] : []),

  // Custom Email Magic Link Provider (replaces problematic NextAuth EmailProvider)
  ...(resend ? [
    CredentialsProvider({
      id: "email-link",
      name: "Email Link",
      credentials: {
        email: { label: "Email", type: "email" },
        token: { label: "Token", type: "text" },
        action: { label: "Action", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        
        const email = credentials.email.toLowerCase()
        
        if (credentials.action === "request") {
          try {
            // Generate a secure random token
            const token = crypto.randomBytes(32).toString('hex')
            
            // Store the token in our database
            await storeVerification(email, token, 'email-link', 24 * 60 * 60 * 1000) // 24 hours
            
            // Create the verification URL
            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
            const callbackUrl = credentials.callbackUrl || baseUrl
            const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}&callbackUrl=${encodeURIComponent(callbackUrl)}`
            
            console.log(`[Email Link] Sending magic link to: ${email}`)
            console.log(`[Email Link] Token: ${token.substring(0, 10)}...`)
            
            await resend!.emails.send({
              from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
              to: email,
              subject: "Sign in to Your App",
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                  <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 30px;">
                      <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: 700;">Welcome Back!</h1>
                      <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Click the button below to sign in to your account</p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3); transition: transform 0.2s;">
                        Sign In Securely
                      </a>
                    </div>
                    
                    <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 30px 0;">
                      <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">Security Notice</h3>
                      <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.5;">
                        This sign-in link will expire in 24 hours. If you didn't request this email, you can safely ignore it.
                      </p>
                    </div>
                    
                    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        This email was sent by Your App
                      </p>
                    </div>
                  </div>
                </div>
              `,
            })
            
            console.log(`[Email Link] Magic link sent successfully to: ${email}`)
            return { id: "link-sent", email, linkSent: true }
          } catch (error) {
            console.error("[Email Link] Failed to send magic link:", error)
            throw new Error("Failed to send verification email")
          }
        } else if (credentials.action === "verify" && credentials.token) {
          // Verify the token
          const isValid = await verifyAndConsumeToken(email, credentials.token, 'email-link')
          
          if (!isValid) {
            throw new Error("Invalid or expired verification link")
          }
          
          return await createOrUpdateUser(email)
        }
        
        return null
      },
    })
  ] : []),

  // Email Code Authentication
  ...(resend ? [
    CredentialsProvider({
      id: "email-code",
      name: "Email Code",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
        action: { label: "Action", type: "text" },
      },
      async authorize(credentials) {
        console.log('[Email Code] Authorize called with:', {
          email: credentials?.email,
          action: credentials?.action,
          hasCode: !!credentials?.code
        })
        
        if (!credentials?.email) {
          console.log('[Email Code] No email provided')
          return null
        }
        
        const email = credentials.email.toLowerCase()
        
        if (credentials.action === "request") {
          try {
            const code = Math.floor(100000 + Math.random() * 900000).toString()
            await storeVerification(email, code, 'email-code')
            
            console.log(`[Email Code] Sending email code to: ${email}`)
            
            await resend!.emails.send({
              from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
              to: email,
              subject: "Your Sign-in Code",
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                  <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                    <div style="text-align: center; margin-bottom: 30px;">
                      <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: 700;">Your Sign-in Code</h1>
                      <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Use this code to sign in to your account</p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <div style="display: inline-block; background: #f3f4f6; padding: 20px 30px; border-radius: 12px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">
                        ${code}
                      </div>
                    </div>
                    
                    <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 30px 0;">
                      <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">Security Notice</h3>
                      <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.5;">
                        This verification code will expire in 10 minutes. If you didn't request this code, you can safely ignore it.
                      </p>
                    </div>
                  </div>
                </div>
              `,
            })
            
            console.log('[Email Code] Email sent successfully')
            // Return null for request action - this prevents automatic sign-in
            return null
          } catch (error) {
            console.error("[Email Code] Failed to send email code:", error)
            throw new Error("Failed to send verification code")
          }
        } else if (credentials.action === "verify" && credentials.code) {
          console.log(`[Email Code] Verifying code for: ${email}`)
          
          const isValid = await verifyAndConsumeToken(email, credentials.code, 'email-code')
          
          if (!isValid) {
            console.log(`[Email Code] Invalid or expired code for: ${email}`)
            throw new Error("Invalid or expired verification code")
          }
          
          console.log(`[Email Code] Code verified successfully for: ${email}`)
          
          // Get or create user in database
          const userData = await createOrUpdateUser(email)
          
          console.log(`[Email Code] User data created/updated:`, userData)
          
          // Return user object that NextAuth expects
          return {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            image: userData.image,
            emailVerified: new Date() // Important for NextAuth
          }
        }
        
        console.log('[Email Code] No valid action provided')
        return null
      },
    })
  ] : []),

  // Phone Authentication
  ...(twilioClient ? [
    CredentialsProvider({
      id: "phone",
      name: "Phone",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "Code", type: "text" },
        action: { label: "Action", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone) return null
        
        const phone = credentials.phone.replace(/\D/g, '')
        
        if (credentials.action === "request") {
          try {
            const code = Math.floor(100000 + Math.random() * 900000).toString()
            await storeVerification(`+${phone}`, code, 'phone')
            
            console.log(`[Phone] Sending SMS code to: +${phone}`)
            
            await twilioClient.messages.create({
              body: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
              from: process.env.TWILIO_PHONE_NUMBER!,
              to: `+${phone}`,
            })
            
            return { id: "code-sent", phone: `+${phone}`, codeSent: true }
          } catch (error) {
            console.error("[Phone] Failed to send SMS:", error)
            throw new Error("Failed to send verification code")
          }
        } else if (credentials.action === "verify" && credentials.code) {
          const isValid = await verifyAndConsumeToken(`+${phone}`, credentials.code, 'phone')
          
          if (!isValid) {
            throw new Error("Invalid or expired verification code")
          }
          
          return await createOrUpdateUser(undefined, `+${phone}`)
        }
        
        return null
      },
    })
  ] : [])
]

export const authOptions: NextAuthOptions = {
  // MongoDB adapter for storing users, accounts, sessions
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  
  providers,

  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token
        token.provider = account.provider
        
        // Store user info in JWT for credentials providers
        if (account.provider === 'email-code' || account.provider === 'phone') {
          token.id = user.id
          token.email = user.email
          token.name = user.name
          token.picture = user.image
          token.emailVerified = user.emailVerified
        }
        
        // Handle phone auth
        if (user.phone) {
          token.phone = user.phone
        }
      }
      return token
    },
    
    async session({ session, token, user }) {
      // For database sessions, user object is available
      if (user) {
        session.user.id = user.id
        if (user.phone) {
          session.user.phone = user.phone
        }
      }
      
      // For JWT sessions or credentials providers, use token
      if (token) {
        // Ensure session has user ID
        if (token.sub) {
          session.user.id = token.sub
        }
        if (token.id) {
          session.user.id = token.id as string
        }
        
        // Add provider info
        if (token.provider) {
          session.provider = token.provider as string
        }
        
        // Add phone if available
        if (token.phone) {
          session.user.phone = token.phone as string
        }
        
        // Ensure email is set
        if (token.email) {
          session.user.email = token.email as string
        }
        
        // Ensure name is set
        if (token.name) {
          session.user.name = token.name as string
        }
      }
      
      return session
    },
  
    async signIn({ user, account, profile }) {
      console.log(`[NextAuth] signIn callback - User: ${user.email || user.phone}, Account: ${account?.provider}`)
      
      // For credentials providers, ensure we have a valid user
      if (account?.provider === 'email-code' || account?.provider === 'phone') {
        return !!(user && (user.email || user.phone))
      }
      
      return true
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`[NextAuth] User signed in: ${user.email || user.phone} via ${account?.provider || 'credentials'}${isNewUser ? ' (new user)' : ''}`)
    },
    async signOut({ session }) {
      console.log(`[NextAuth] User signed out: ${session?.user?.email || session?.user?.phone || 'unknown user'}`)
    },
    async createUser({ user }) {
      console.log(`[NextAuth] New user created in database: ${user.email || user.phone}`)
    },
  },

  debug: process.env.NODE_ENV === "development",
}

// Helper functions for debugging and maintenance
export async function testMongoConnection() {
  try {
    const client = await clientPromise
    await client.db("admin").command({ ping: 1 })
    console.log("✅ MongoDB connection successful")
    return true
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error)
    return false
  }
}

export async function debugVerificationTokens() {
  try {
    const client = await clientPromise
    const ourTokens = await client.db().collection("our_verification_tokens").find({}).toArray()
    
    console.log("Our verification tokens:", ourTokens.length)
    
    return {
      our_tokens: ourTokens.map(token => ({
        identifier: token.identifier,
        type: token.type,
        token: token.token?.substring(0, 10) + '...', 
        expires: token.expires,
        created: token.createdAt
      }))
    }
  } catch (error) {
    console.error("Failed to get verification tokens:", error)
    return { our_tokens: [] }
  }
}

export async function cleanupExpiredCodes() {
  try {
    const client = await clientPromise
    const expired = await client.db().collection("our_verification_tokens").deleteMany({
      expires: { $lt: new Date() }
    })
    
    console.log(`Cleaned up ${expired.deletedCount} expired verification tokens`)
    
    return {
      tokens_cleaned: expired.deletedCount
    }
  } catch (error) {
    console.error("Failed to cleanup expired codes:", error)
    return { tokens_cleaned: 0 }
  }
}