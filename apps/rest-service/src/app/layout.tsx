// apps/rest-service/src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { AuthSessionProvider } from '@repo/auth/session-provider'
import { ModernAppLayout } from '@repo/ui/components'
import { Providers } from "./providers"

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
          <ModernAppLayout 
            currentService="Rest Service"
            headerTheme="gradient"  // Beautiful gradient header
          >
            <Providers>
              {children}
            </Providers>
          </ModernAppLayout>
      </body>
    </html>
  )
}

