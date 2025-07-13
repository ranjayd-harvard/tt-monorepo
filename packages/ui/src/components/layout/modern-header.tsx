// Updated: packages/ui/src/components/layout/modern-header.tsx
// Moving ServiceSwitcher to right side next to user section

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from '@repo/auth'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Zap, 
  ChevronDown
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { ServiceSwitcher } from '../navigation/service-switcher'

interface ModernHeaderProps {
  currentService?: string
}

// Custom Avatar Component (same as before)
function InlineAvatar({ 
  src, 
  alt, 
  fallback, 
  size = 32 
}: { 
  src?: string; 
  alt?: string; 
  fallback: string; 
  size?: number;
}) {
  const [imageError, setImageError] = useState(false)
  
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: src && !imageError ? 'transparent' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: 'white',
        fontSize: `${size * 0.4}px`,
        fontWeight: '600',
        position: 'relative',
        flexShrink: 0
      }}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
          onError={() => setImageError(true)}
        />
      ) : (
        <span style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '100%',
          height: '100%'
        }}>
          {fallback}
        </span>
      )}
    </div>
  )
}

export function ModernHeader({ currentService }: ModernHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(true)
  const { data: session, status } = useSession()

  // Handle screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const services = [
    { 
      name: 'Rest Service', 
      href: 'http://localhost:3000', 
      description: 'API Gateway & REST Endpoints',
      icon: '🚀',
      port: 3000,
      status: 'online' as const
    },
    { 
      name: 'Menu Service', 
      href: 'http://localhost:3001', 
      description: 'Navigation Management Hub',
      icon: '📋',
      port: 3001,
      status: 'online' as const
    },
    { 
      name: 'Blog Service', 
      href: 'http://localhost:3002', 
      description: 'Content Publishing Platform',
      icon: '✍️',
      port: 3002,
      status: 'online' as const
    },
  ]

  const currentServiceInfo = services.find(service => 
    service.name.toLowerCase().includes(currentService?.toLowerCase() || '')
  )

  return (
    <div>
      <header 
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          zIndex: '50',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div 
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px'
          }}
        >
          <div 
            style={{
              display: 'flex',
              height: '80px',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {/* Logo Section - Left Side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link 
                href="/" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  textDecoration: 'none'
                }}
              >
                <div 
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    padding: '8px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Zap style={{ width: '24px', height: '24px', color: 'white' }} />
                </div>
                <div>
                  <h1 style={{ 
                    margin: '0',
                    fontSize: '20px', 
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Microservices Platform
                  </h1>
                  <p style={{ 
                    margin: '0',
                    fontSize: '12px', 
                    color: '#6b7280'
                  }}>
                    {currentServiceInfo?.description || 'Modern Architecture'}
                  </p>
                </div>
              </Link>
            </div>

            {/* Right Side - Service Switcher + User Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              
              {/* Service Switcher - Desktop */}
              {isLargeScreen && (
                <ServiceSwitcher 
                  currentService={currentService}
                  services={services}
                  showStatus={true}
                />
              )}

              {/* User Section */}
              {status === 'loading' ? (
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    borderRadius: '12px',
                    opacity: '0.6'
                  }}
                />
              ) : session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <InlineAvatar
                        src={session.user?.image || ''}
                        alt={session.user?.name || 'User'}
                        fallback={session.user?.name?.charAt(0).toUpperCase() || 'U'}
                        size={32}
                      />
                      {isLargeScreen && (
                        <div style={{ textAlign: 'left' }}>
                          <p style={{ 
                            margin: '0', 
                            fontSize: '14px', 
                            fontWeight: '500',
                            color: '#111827'
                          }}>
                            {session.user?.name}
                          </p>
                          <p style={{ 
                            margin: '0', 
                            fontSize: '12px', 
                            color: '#6b7280' 
                          }}>
                            Online
                          </p>
                        </div>
                      )}
                      <ChevronDown style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    style={{
                      width: '256px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px'
                    }}
                    align="end"
                  >
                    <DropdownMenuLabel style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <InlineAvatar
                          src={session.user?.image || ''}
                          alt={session.user?.name || 'User'}
                          fallback={session.user?.name?.charAt(0).toUpperCase() || 'U'}
                          size={48}
                        />
                        <div>
                          <p style={{ 
                            margin: '0', 
                            fontWeight: '500',
                            fontSize: '14px',
                            color: '#111827'
                          }}>
                            {session.user?.name}
                          </p>
                          <p style={{ 
                            margin: '0', 
                            fontSize: '12px', 
                            color: '#6b7280' 
                          }}>
                            {session.user?.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem style={{ padding: '12px 16px', margin: '0 8px', borderRadius: '8px' }}>
                      <User style={{ width: '16px', height: '16px', marginRight: '12px' }} />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem style={{ padding: '12px 16px', margin: '0 8px', borderRadius: '8px' }}>
                      <Settings style={{ width: '16px', height: '16px', marginRight: '12px' }} />
                      <span>Preferences</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => signOut()}
                      style={{
                        padding: '12px 16px',
                        margin: '0 8px 8px 8px',
                        borderRadius: '8px',
                        color: '#dc2626'
                      }}
                    >
                      <LogOut style={{ width: '16px', height: '16px', marginRight: '12px' }} />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={() => signIn()}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
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
                  Sign In
                </button>
              )}

              {/* Mobile Section - Service Switcher + Menu Button */}
              {!isLargeScreen && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ServiceSwitcher 
                    currentService={currentService}
                    services={services}
                    compact={true}
                    showStatus={false}
                  />
                  <button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      background: 'transparent',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    {isMobileMenuOpen ? 
                      <X style={{ width: '24px', height: '24px' }} /> : 
                      <Menu style={{ width: '24px', height: '24px' }} />
                    }
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu - Only when needed */}
          {!isLargeScreen && isMobileMenuOpen && (
            <div 
              style={{
                padding: '16px',
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280', 
                marginBottom: '12px',
                textTransform: 'uppercase',
                fontWeight: '600',
                letterSpacing: '0.05em'
              }}>
                Quick Actions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings style={{ width: '16px', height: '16px' }} />
                  <span>Settings</span>
                </button>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User style={{ width: '16px', height: '16px' }} />
                  <span>Profile</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <div style={{ height: '80px' }} />
    </div>
  )
}
