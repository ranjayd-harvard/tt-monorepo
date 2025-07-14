// apps/rest-service/src/app/layout.tsx (and same for menu-service, blog-service)
import './globals.css'
import { Inter } from 'next/font/google'
import { AuthSessionProvider } from '@repo/auth/session-provider'
import { ModernAppLayout } from '@repo/ui/components'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Blog Service',
  description: 'Blog microservice',
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
          <ModernAppLayout 
            currentService="Blog Service"
            headerTheme="glass"  // Modern glass effect header
          >
            {children}
          </ModernAppLayout>
        </AuthSessionProvider>
      </body>
    </html>
  )
}



// Example 4: Custom color theme
/*
<ModernAppLayout 
  currentService="Custom Service"
  headerBackgroundColor="linear-gradient(135deg, #10b981 0%, #059669 100%)"
>
  {children}
</ModernAppLayout>
*/

// Example 5: Light theme
/*
<ModernAppLayout 
  currentService="Light Service"
  headerTheme="light"
>
  {children}
</ModernAppLayout>
*/