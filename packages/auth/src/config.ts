import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET || "development-secret-key-that-is-at-least-32-characters-long",
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy-secret",
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GitHub({
      clientId: process.env.GITHUB_ID || "dummy-github-id",
      clientSecret: process.env.GITHUB_SECRET || "dummy-github-secret",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      return session
    },
  },
  // Remove custom pages to use NextAuth defaults
  // pages: {
  //   signIn: "/api/auth/signin",
  //   error: "/api/auth/error",
  // },
  trustHost: true,
} satisfies NextAuthConfig