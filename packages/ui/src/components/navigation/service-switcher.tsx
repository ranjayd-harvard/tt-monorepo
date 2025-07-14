// packages/ui/src/components/navigation/service-switcher.tsx
'use client'

import React from 'react'
import Link from 'next/link'

interface Service {
  name: string
  href: string
  port: number
  icon: string
}

interface ServiceSwitcherProps {
  currentService?: string
  services?: Service[]
}

const defaultServices: Service[] = [
  { name: 'Restaurant', href: 'http://localhost:3000', port: 3000, icon: '🍽️' },
  { name: 'Menu', href: 'http://localhost:3001', port: 3001, icon: '📱' },
  { name: 'Blog', href: 'http://localhost:3002', port: 3002, icon: '✍️' },
]

export function ServiceSwitcher({ currentService, services = defaultServices }: ServiceSwitcherProps) {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {services.map((service) => {
        const isActive = currentService?.toLowerCase().includes(service.name.toLowerCase())
        return (
          <Link
            key={service.name}
            href={service.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              color: isActive ? '#1f2937' : '#6b7280',
              background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              border: isActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <span style={{ fontSize: '16px' }}>{service.icon}</span>
            {service.name}
          </Link>
        )
      })}
    </nav>
  )
}