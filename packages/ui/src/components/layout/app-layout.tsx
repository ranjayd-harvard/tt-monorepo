// packages/ui/src/components/layout/app-layout.tsx
'use client'

import { Header } from './header'
import { Footer } from './footer'

interface AppLayoutProps {
  children: React.ReactNode
  currentService?: string
}

export function AppLayout({ children, currentService }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentService={currentService} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

