// packages/ui/src/components/layout/modern-app-layout.tsx
'use client'

import { ModernHeader } from './modern-header'
import { ModernFooter } from './modern-footer'

interface ModernAppLayoutProps {
  children: React.ReactNode
  currentService?: string
}

export function ModernAppLayout({ children, currentService }: ModernAppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(56,189,248,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(120,119,198,0.05),transparent)]"></div>
      </div>

      {/* Header */}
      <ModernHeader currentService={currentService} />
      
      {/* Main Content */}
      <main className="flex-1 pt-20">
        {children}
      </main>
      
      {/* Footer */}
      <ModernFooter />
    </div>
  )
}