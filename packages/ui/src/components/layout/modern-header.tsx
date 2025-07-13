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
  theme?: 'light' | 'dark' | 'gradient' | 'glass'
  backgroundColor?: string
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

export function ModernHeader({ 
  currentService, 
  theme = 'gradient',
  backgroundColor 
}: ModernHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(true)
  const [scrolled, setScrolled] = useState(false)
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

  // Handle scroll effect for glass theme
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    if (theme === 'glass') {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [theme])

  // Get header background based on theme
  const getHeaderBackground = () => {
    if (backgroundColor) return backgroundColor

    switch (theme) {
      case 'light':
        return 'rgba(248, 250, 252, 0.95)'
      case 'dark':
        return 'rgba(15, 23, 42, 0.95)'
      case 'gradient':
        return 'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)'
      case 'glass':
        return scrolled 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'rgba(255, 255, 255, 0.5)'
      default:
        return 'rgba(255, 255, 255, 0.95)'
    }
  }

  // Get text color based on theme
  const getTextColor = () => {
    switch (theme) {
      case 'dark':
      case 'gradient':
        return 'white'
      default:
        return '#111827'
    }
  }

  // Get border color based on theme
  const getBorderColor = () => {
    switch (theme) {
      case 'dark':
        return 'rgba(255, 255, 255, 0.1)'
      case 'gradient':
        return 'rgba(255, 255, 255, 0.2)'
      default:
        return 'rgba(0, 0, 0, 0.1)'
    }
  }

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

  const textColor = getTextColor()
  const isDarkTheme = theme === 'dark' || theme === 'gradient'

  return (
    <>
      {/* FIXED HEADER CONTAINER - Prevents layout shifts */}
      <div
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          height: '80px',
          zIndex: '50',
          background: getHeaderBackground(),
          backdropFilter: theme === 'glass' ? 'blur(20px)' : 'none',
          borderBottom: `1px solid ${getBorderColor()}`,
          boxShadow: theme === 'gradient' 
            ? '0 4px 20px rgba(99, 102, 241, 0.3)' 
            : '0 1px 3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          // CRITICAL: Prevent any size changes
          minHeight: '80px',
          maxHeight: '80px',
          overflow: 'visible'
        }}
      >
        {/* INNER CONTAINER - Fixed width, no flex changes */}
        <div 
          style={{
            maxWidth: '1200px',
            width: '100%',
            height: '100%',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            // CRITICAL: Prevent flex item changes
            flexShrink: 0
          }}
        >
          {/* Logo Section - FIXED WIDTH */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              // CRITICAL: Fixed width prevents logo movement
              minWidth: '280px',
              flexShrink: 0
            }}
          >
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
                  background: isDarkTheme 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  padding: '8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  flexShrink: 0
                }}
              >
                <Zap style={{ 
                  width: '24px', 
                  height: '24px', 
                  color: 'white'
                }} />
              </div>
              <div style={{ flexShrink: 0 }}>
                <h1 style={{ 
                  margin: '0',
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  color: textColor,
                  whiteSpace: 'nowrap'
                }}>
                  Microservices Platform
                </h1>
                <p style={{ 
                  margin: '0',
                  fontSize: '12px', 
                  color: isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : '#6b7280',
                  whiteSpace: 'nowrap'
                }}>
                  {currentServiceInfo?.description || 'Modern Architecture'}
                </p>
              </div>
            </Link>
          </div>

          {/* Right Side - FIXED WIDTH CONTAINER */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              // CRITICAL: Fixed width prevents shifts
              minWidth: '400px',
              justifyContent: 'flex-end',
              flexShrink: 0
            }}
          >
            
            {/* Service Switcher - Desktop - ISOLATED POSITIONING */}
            {isLargeScreen && (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <ServiceSwitcher 
                  currentService={currentService}
                  services={services}
                  showStatus={true}
                />
              </div>
            )}

            {/* User Section - ISOLATED POSITIONING */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {status === 'loading' ? (
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    background: isDarkTheme 
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    borderRadius: '12px',
                    opacity: '0.6',
                    flexShrink: 0
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
                        transition: 'all 0.2s ease',
                        // CRITICAL: Fixed dimensions
                        minWidth: isLargeScreen ? '120px' : '40px',
                        height: '48px',
                        flexShrink: 0
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDarkTheme 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : 'rgba(0, 0, 0, 0.05)'
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
                        <div style={{ textAlign: 'left', flexShrink: 0 }}>
                          <p style={{ 
                            margin: '0', 
                            fontSize: '14px', 
                            fontWeight: '500',
                            color: textColor,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '80px'
                          }}>
                            {session.user?.name}
                          </p>
                          <p style={{ 
                            margin: '0', 
                            fontSize: '12px', 
                            color: isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : '#6b7280',
                            whiteSpace: 'nowrap'
                          }}>
                            Online
                          </p>
                        </div>
                      )}
                      <ChevronDown style={{ 
                        width: '16px', 
                        height: '16px', 
                        color: isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : '#6b7280',
                        flexShrink: 0
                      }} />
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
                    sideOffset={8}
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
                    background: isDarkTheme 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    border: isDarkTheme ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    // CRITICAL: Fixed dimensions
                    minWidth: '100px',
                    height: '48px',
                    flexShrink: 0,
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = isDarkTheme
                      ? '0 8px 16px rgba(255, 255, 255, 0.2)'
                      : '0 8px 16px rgba(99, 102, 241, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Section - FIXED WIDTH */}
            {!isLargeScreen && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <div style={{ position: 'relative' }}>
                  <ServiceSwitcher 
                    currentService={currentService}
                    services={services}
                    compact={true}
                    showStatus={false}
                  />
                </div>
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
                    transition: 'all 0.2s ease',
                    flexShrink: 0
                  }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDarkTheme 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  {isMobileMenuOpen ? 
                    <X style={{ width: '24px', height: '24px', color: textColor }} /> : 
                    <Menu style={{ width: '24px', height: '24px', color: textColor }} />
                  }
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT SPACER - Prevents content from hiding behind fixed header */}
      <div style={{ height: '80px', flexShrink: 0 }} />

      {/* MOBILE MENU - OUTSIDE HEADER CONTAINER */}
      {!isLargeScreen && isMobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: '80px',
            left: '0',
            right: '0',
            zIndex: '40',
            padding: '16px',
            background: getHeaderBackground(),
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${getBorderColor()}`,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ 
            fontSize: '12px', 
            color: isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : '#6b7280',
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
                background: isDarkTheme 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(99, 102, 241, 0.1)',
                color: isDarkTheme ? 'white' : '#6366f1',
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
                background: isDarkTheme 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(99, 102, 241, 0.1)',
                color: isDarkTheme ? 'white' : '#6366f1',
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
    </>
  )
}

