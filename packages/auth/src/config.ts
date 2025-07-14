// packages/auth/src/config.ts
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
import { Resend } from "resend"
import twilio from "twilio"

// Initialize Resend for email
const resend = new Resend(process.env.RESEND_API_KEY!)

// Initialize Twilio for phone
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

// Store for phone verification codes (use Redis in production)
const phoneVerificationStore = new Map<string, { code: string; expires: number }>()

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // Social Providers
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    // Email Provider using Resend
    EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 587,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY!,
        },
      },
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      async sendVerificationRequest({ identifier: email, url, provider }) {
        try {
          await resend.emails.send({
            from: provider.from as string,
            to: email,
            subject: "Sign in to Your App",
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 40px;">
                  <h1 style="color: #1f2937; margin: 0; font-size: 32px; font-weight: 700;">Welcome Back!</h1>
                  <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Click the button below to sign in to your account</p>
                </div>
                
                <div style="text-align: center; margin: 40px 0;">
                  <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);">
                    Sign In Securely
                  </a>
                </div>
                
                <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 40px 0;">
                  <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 18px;">Security Notice</h3>
                  <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.5;">
                    This sign-in link will expire in 24 hours. If you didn't request this email, you can safely ignore it.
                  </p>
                </div>
                
                <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                    This email was sent from Your App. If you have questions, please contact support.
                  </p>
                </div>
              </div>
            `,
          })
        } catch (error) {
          console.error("Failed to send email:", error)
          throw new Error("Failed to send verification email")
        }
      },
    }),

    // Phone Provider using Credentials
    CredentialsProvider({
      id: "phone",
      name: "Phone",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "Verification Code", type: "text" },
        action: { label: "Action", type: "text" } // 'send' or 'verify'
      },
      async authorize(credentials) {
        if (!credentials?.phone) return null

        const phone = credentials.phone.replace(/\D/g, '') // Remove non-digits
        
        if (credentials.action === "send") {
          // Generate and send verification code
          const code = Math.floor(100000 + Math.random() * 900000).toString()
          const expires = Date.now() + 10 * 60 * 1000 // 10 minutes
          
          phoneVerificationStore.set(phone, { code, expires })
          
          try {
            await twilioClient.messages.create({
              body: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
              from: process.env.TWILIO_PHONE_NUMBER!,
              to: `+${phone}`,
            })
            
            // Return a special response indicating code was sent
            return { id: "code-sent", phone, codeSent: true }
          } catch (error) {
            console.error("Failed to send SMS:", error)
            throw new Error("Failed to send verification code")
          }
        } else if (credentials.action === "verify" && credentials.code) {
          // Verify the code
          const stored = phoneVerificationStore.get(phone)
          
          if (!stored || stored.expires < Date.now()) {
            throw new Error("Verification code expired")
          }
          
          if (stored.code !== credentials.code) {
            throw new Error("Invalid verification code")
          }
          
          // Clean up the code
          phoneVerificationStore.delete(phone)
          
          // Return user object
          return {
            id: `phone-${phone}`,
            phone: `+${phone}`,
            name: `User ${phone}`,
            email: null,
          }
        }
        
        return null
      },
    }),
  ],

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
        
        // Handle phone auth
        if (user.phone) {
          token.phone = user.phone
        }
      }
      return token
    },
    
    async session({ session, token }) {
      // Add provider info to session
      if (token.provider) {
        session.provider = token.provider as string
      }
      
      // Add phone to session if available
      if (token.phone) {
        session.user.phone = token.phone as string
      }
      
      return session
    },

    async signIn({ user, account, profile }) {
      // Allow all sign-ins
      return true
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  events: {
    async signIn({ user, account, profile }) {
      console.log(`User signed in: ${user.email || user.phone} via ${account?.provider}`)
    },
    async signOut({ session }) {
      console.log(`User signed out: ${session?.user?.email || session?.user?.phone}`)
    },
  },
}

// Helper function to send phone verification (can be used in API routes)
export async function sendPhoneVerification(phone: string): Promise<boolean> {
  try {
    const cleanPhone = phone.replace(/\D/g, '')
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = Date.now() + 10 * 60 * 1000 // 10 minutes
    
    phoneVerificationStore.set(cleanPhone, { code, expires })
    
    await twilioClient.messages.create({
      body: `Your verification code is: ${code}. This code will expire in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: `+${cleanPhone}`,
    })
    
    return true
  } catch (error) {
    console.error("Failed to send SMS:", error)
    return false
  }
}

// Helper function to verify phone code
export function verifyPhoneCode(phone: string, code: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '')
  const stored = phoneVerificationStore.get(cleanPhone)
  
  if (!stored || stored.expires < Date.now()) {
    return false
  }
  
  if (stored.code !== code) {
    return false
  }
  
  phoneVerificationStore.delete(cleanPhone)
  return true
}