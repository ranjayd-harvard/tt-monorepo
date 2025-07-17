import './globals.css'
import { Inter } from 'next/font/google'
import { AuthSessionProvider } from '@repo/auth/session-provider'
import { ModernAppLayout } from '@repo/ui/components'

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
        {/* FIXED: SessionProvider must wrap the entire layout */}
        <AuthSessionProvider>
          <ModernAppLayout 
            currentService="Rest Service"
            headerTheme="gradient"
          >
            {children}
          </ModernAppLayout>
        </AuthSessionProvider>
      </body>
    </html>
  )
}