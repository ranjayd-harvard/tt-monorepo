'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ExternalLink, Zap } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface Service {
  name: string
  href: string
  description: string
  icon: string
  port: number
  status?: 'online' | 'offline' | 'maintenance'
}

interface ServiceSwitcherProps {
  currentService?: string
  services?: Service[]
  compact?: boolean
  showStatus?: boolean
}

const defaultServices: Service[] = [
  { 
    name: 'Rest Service', 
    href: 'http://localhost:3000', 
    description: 'API Gateway & REST Endpoints',
    icon: '🚀',
    port: 3000,
    status: 'online'
  },
  { 
    name: 'Menu Service', 
    href: 'http://localhost:3001', 
    description: 'Navigation Management Hub',
    icon: '📋',
    port: 3001,
    status: 'online'
  },
  { 
    name: 'Blog Service', 
    href: 'http://localhost:3002', 
    description: 'Content Publishing Platform',
    icon: '✍️',
    port: 3002,
    status: 'online'
  },
]

export function ServiceSwitcher({ 
  currentService,
  services = defaultServices,
  compact = false,
  showStatus = true
}: ServiceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentServiceInfo = services.find(service => 
    service.name.toLowerCase().includes(currentService?.toLowerCase() || '')
  )

  const otherServices = services.filter(service => 
    !service.name.toLowerCase().includes(currentService?.toLowerCase() || '')
  )

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return '#22c55e'
      case 'offline': return '#ef4444'
      case 'maintenance': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'online': return 'Online'
      case 'offline': return 'Offline'
      case 'maintenance': return 'Maintenance'
      default: return 'Unknown'
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: compact ? '8px' : '12px',
            padding: compact ? '8px 12px' : '12px 16px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: compact ? '13px' : '14px',
            fontWeight: '500',
            minWidth: compact ? 'auto' : '160px',
            justifyContent: 'space-between'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(99, 102, 241, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: compact ? '14px' : '16px' }}>
              {currentServiceInfo?.icon || '⚡'}
            </span>
            {!compact && (
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>
                  {currentServiceInfo?.name || 'Services'}
                </div>
                {showStatus && currentServiceInfo?.status && (
                  <div style={{ 
                    fontSize: '11px', 
                    opacity: '0.9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: getStatusColor(currentServiceInfo.status)
                      }}
                    />
                    {getStatusText(currentServiceInfo.status)}
                  </div>
                )}
              </div>
            )}
          </div>
          <ChevronDown 
            style={{ 
              width: compact ? '14px' : '16px', 
              height: compact ? '14px' : '16px',
              transition: 'transform 0.2s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
            }} 
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        style={{
          width: '320px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          padding: '8px',
          boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)'
        }}
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel 
          style={{ 
            padding: '12px 16px 8px 16px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          Available Services
        </DropdownMenuLabel>

        {/* Current Service */}
        {currentServiceInfo && (
          <>
            <div
              style={{
                margin: '0 8px 8px 8px',
                padding: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}
                >
                  {currentServiceInfo.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '600',
                    marginBottom: '2px'
                  }}>
                    {currentServiceInfo.name}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    opacity: '0.9',
                    marginBottom: '4px'
                  }}>
                    {currentServiceInfo.description}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    opacity: '0.8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#22c55e'
                      }}
                    />
                    Currently Active • Port {currentServiceInfo.port}
                  </div>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator style={{ margin: '8px 0' }} />
          </>
        )}

        {/* Other Services */}
        {otherServices.map((service) => (
          <DropdownMenuItem key={service.name} asChild>
            <Link
              href={service.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                margin: '2px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#374151',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'
                e.currentTarget.style.color = '#6366f1'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#374151'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}
              >
                {service.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500',
                  marginBottom: '2px'
                }}>
                  {service.name}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#6b7280',
                  marginBottom: '2px'
                }}>
                  {service.description}
                </div>
                {showStatus && (
                  <div style={{ 
                    fontSize: '11px', 
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: getStatusColor(service.status)
                      }}
                    />
                    {getStatusText(service.status)} • Port {service.port}
                  </div>
                )}
              </div>
              <ExternalLink style={{ width: '14px', height: '14px', opacity: '0.5' }} />
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator style={{ margin: '8px 0' }} />
        
        {/* Footer */}
        <div
          style={{
            padding: '8px 16px',
            fontSize: '11px',
            color: '#6b7280',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Zap style={{ width: '12px', height: '12px' }} />
            Microservices Platform
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
