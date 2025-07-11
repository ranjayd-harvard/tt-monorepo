// apps/rest-service/src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { AuthSessionProvider } from '@repo/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Rest Service',
  description: 'Rest microservice',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  )
}