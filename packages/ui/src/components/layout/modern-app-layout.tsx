'use client'

import { ModernHeader } from './modern-header'
import { ModernFooter } from './modern-footer'

interface ModernAppLayoutProps {
  children: React.ReactNode
  currentService?: string
  headerTheme?: 'light' | 'dark' | 'gradient' | 'glass'
  headerBackgroundColor?: string
}

export function ModernAppLayout({ 
  children, 
  currentService,
  headerTheme = 'gradient',
  headerBackgroundColor
}: ModernAppLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header with custom theme */}
      <ModernHeader 
        currentService={currentService}
        theme={headerTheme}
        backgroundColor={headerBackgroundColor}
      />
      
      {/* Main Content */}
      <main style={{ flex: '1' }}>
        {children}
      </main>
      
      {/* Dark Footer */}
      <ModernFooter />
    </div>
  )
}

