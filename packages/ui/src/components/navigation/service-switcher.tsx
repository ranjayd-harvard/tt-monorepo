// Fixed ServiceSwitcher with proper positioning and chevron handling

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
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
  description?: string
  icon?: string
  status?: 'active' | 'inactive' | 'maintenance'
}

interface ServiceSwitcherProps {
  currentService?: string
  services: Service[]
  compact?: boolean
  showStatus?: boolean
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return '#10b981'
    case 'inactive': return '#6b7280' 
    case 'maintenance': return '#f59e0b'
    default: return '#6b7280'
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'active': return 'Active'
    case 'inactive': return 'Inactive'
    case 'maintenance': return 'Maintenance'
    default: return 'Unknown'
  }
}

export function ServiceSwitcher({ 
  currentService, 
  services, 
  compact = false, 
  showStatus = false 
}: ServiceSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentServiceInfo = services.find(service => 
    service.name.toLowerCase().includes(currentService?.toLowerCase().split(' ')[0] || '')
  ) || services[0]

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
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
              fontSize: compact ? '13px' : '14px',
              fontWeight: '500',
              justifyContent: 'space-between',
              // CRITICAL: Fixed dimensions to prevent layout shift
              width: compact ? '140px' : '180px',
              height: compact ? '36px' : '48px',
              // CRITICAL: Prevent any expansion due to content or transforms
              flexShrink: 0,
              overflow: 'hidden',
              // CRITICAL: Only animate properties that don't affect layout
              transition: 'box-shadow 0.2s ease, transform 0.2s ease',
              // CRITICAL: Contain any layout changes within button
              contain: 'layout style'
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
            {/* Left content area with fixed sizing */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              flex: 1,
              minWidth: 0,
              overflow: 'hidden'
            }}>
              <span style={{ 
                fontSize: compact ? '14px' : '16px',
                width: compact ? '14px' : '16px',
                height: compact ? '14px' : '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {currentServiceInfo?.icon || '⚡'}
              </span>
              {!compact && (
                <div style={{ 
                  textAlign: 'left',
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: '1.2'
                  }}>
                    {currentServiceInfo?.name || 'Services'}
                  </div>
                  {showStatus && currentServiceInfo?.status && (
                    <div style={{ 
                      fontSize: '11px', 
                      opacity: '0.9',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden'
                    }}>
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: getStatusColor(currentServiceInfo.status),
                          flexShrink: 0
                        }}
                      />
                      <span style={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {getStatusText(currentServiceInfo.status)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* CRITICAL: Fixed chevron container to prevent expansion */}
            <div style={{
              width: compact ? '14px' : '16px',
              height: compact ? '14px' : '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              // CRITICAL: Contain the rotation within this fixed area
              overflow: 'hidden'
            }}>
              <ChevronDown 
                style={{ 
                  width: compact ? '14px' : '16px', 
                  height: compact ? '14px' : '16px',
                  // CRITICAL: Only transform the chevron, not its container
                  transition: 'transform 0.2s ease',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  // CRITICAL: Ensure transform doesn't affect parent layout
                  transformOrigin: 'center'
                }} 
              />
            </div>
          </button>
        </DropdownMenuTrigger>

        {/* CRITICAL: Properly positioned dropdown */}
        <DropdownMenuContent
          align="start" // FIXED: Changed from "end" to "start" for proper alignment
          side="bottom"
          sideOffset={8}
          alignOffset={0} // CRITICAL: No offset to align perfectly under button
          avoidCollisions={false} // CRITICAL: Don't auto-adjust position
          style={{
            width: '320px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '16px',
            padding: '8px',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
            // CRITICAL: Ensure dropdown doesn't affect layout
            position: 'absolute',
            zIndex: 60,
            // CRITICAL: Performance optimizations
            transform: 'translateZ(0)',
            willChange: 'transform, opacity',
            // CRITICAL: Contain layout changes
            contain: 'layout style paint'
          }}
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
                  color: 'white',
                  minHeight: '64px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      flexShrink: 0
                    }}
                  >
                    {currentServiceInfo.icon || '⚡'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '600',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {currentServiceInfo.name}
                    </div>
                    <div style={{ 
                      fontSize: '13px', 
                      opacity: '0.9',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {currentServiceInfo.description || 'Currently Active'}
                    </div>
                  </div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                    flexShrink: 0
                  }} />
                </div>
              </div>
              <DropdownMenuSeparator style={{ 
                margin: '8px',
                height: '1px',
                background: 'rgba(0, 0, 0, 0.1)'
              }} />
            </>
          )}

          {/* Other Services */}
          {services
            .filter(service => service.name !== currentServiceInfo?.name)
            .map((service) => (
              <DropdownMenuItem key={service.name} asChild>
                <Link
                  href={service.href}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    margin: '2px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    color: '#374151',
                    cursor: 'pointer',
                    minHeight: '60px',
                    transition: 'background-color 0.2s ease, color 0.2s ease',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.05)'
                    e.currentTarget.style.color = '#6366f1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
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
                      fontSize: '16px',
                      flexShrink: 0
                    }}
                  >
                    {service.icon || '⚡'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: '500',
                      marginBottom: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {service.name}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#6b7280',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {service.description || 'Available'}
                    </div>
                  </div>
                  {service.status && (
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: getStatusColor(service.status),
                        flexShrink: 0
                      }}
                    />
                  )}
                </Link>
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}