'use client'

import { ModernHeader } from './modern-header'
import { ModernFooter } from './modern-footer'

interface ModernAppLayoutProps {
  children: React.ReactNode
  currentService?: string
}

export function ModernAppLayout({ children, currentService }: ModernAppLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header with built-in spacer */}
      <ModernHeader currentService={currentService} />
      
      {/* Main Content - no extra padding needed */}
      <main style={{ flex: '1' }}>
        {children}
      </main>
      
      {/* Footer */}
      <ModernFooter />
    </div>
  )
}

