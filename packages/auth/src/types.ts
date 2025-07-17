// packages/auth/src/types.ts
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      phone?: string | null
    }
    provider?: string
  }

  interface User {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
    phone?: string | null
    emailVerified?: Date | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    provider?: string
    phone?: string
  }
}