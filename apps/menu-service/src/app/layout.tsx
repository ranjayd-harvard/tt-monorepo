// apps/rest-service/src/app/layout.tsx (and same for menu-service, blog-service)
import './globals.css'
import { Inter } from 'next/font/google'
import { AuthSessionProvider } from '@repo/auth'
import { ModernAppLayout } from '@repo/ui/components'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Menu Service',
  description: 'Menu microservice',
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
          <ModernAppLayout currentService="Menu Service">
            {children}
          </ModernAppLayout>
        </AuthSessionProvider>
      </body>
    </html>
  )
}