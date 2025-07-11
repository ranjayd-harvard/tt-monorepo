// packages/auth/src/index.ts
'use client'

export { authOptions } from "./config"
export { useSession, signIn, signOut } from "next-auth/react"
export { AuthSessionProvider } from "./session-provider"