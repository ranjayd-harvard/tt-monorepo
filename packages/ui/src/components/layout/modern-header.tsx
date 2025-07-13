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

// Custom Avatar Component with improved loading states
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
  const [imageLoaded, setImageLoaded] = useState(false)
  
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
        background: src && !imageError && imageLoaded ? 'transparent' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
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
          alt={alt}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease'
          }}
        />
      ) : null}
      {(!src || imageError || !imageLoaded) && (
        <span style={{ position: imageLoaded ? 'absolute' : 'static' }}>
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
  const [isClient, setIsClient] = useState(false) // NEW: Hydration fix
  const { data: session, status } = useSession()

  // NEW: Fix hydration and responsive issues
  useEffect(() => {
    setIsClient(true)
    
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const services = [
    { 
      name: 'Rest Service', 
      href: 'http://localhost:3000',
      description: 'REST API Service',
      status: 'active' as const
    },
    { 
      name: 'Menu Service', 
      href: 'http://localhost:3001',
      description: 'Menu Management',
      status: 'active' as const
    },
    { 
      name: 'Blog Service', 
      href: 'http://localhost:3002',
      description: 'Blog Platform',
      status: 'active' as const
    },
  ]

  const currentServiceInfo = services.find(service => 
    service.name.toLowerCase().includes(currentService?.toLowerCase().split(' ')[0] || '')
  ) || services[0]

  // Theme configurations
  const isDarkTheme = theme === 'dark'
  const isGradientTheme = theme === 'gradient'
  const isGlassTheme = theme === 'glass'

  const getHeaderBackground = () => {
    if (backgroundColor) return backgroundColor
    
    switch (theme) {
      case 'dark':
        return 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
      case 'gradient':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      case 'glass':
        return 'rgba(255, 255, 255, 0.1)'
      default:
        return '#ffffff'
    }
  }

  const getBorderColor = () => {
    if (isDarkTheme || isGradientTheme) return 'rgba(255, 255, 255, 0.1)'
    if (isGlassTheme) return 'rgba(255, 255, 255, 0.2)'
    return 'rgba(0, 0, 0, 0.1)'
  }

  const textColor = isDarkTheme || isGradientTheme ? '#ffffff' : '#1f2937'

  return (
    <>
      {/* FIXED HEADER - ABSOLUTE POSITIONING */}
      <div 
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          zIndex: '50',
          background: getHeaderBackground(),
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${getBorderColor()}`,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          // CRITICAL: Fixed height prevents layout shifts
          height: '80px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div style={{ 
          width: '100%', 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          // CRITICAL: Fixed height container
          height: '80px'
        }}>
          
          {/* LEFT: Brand Section - FIXED WIDTH */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            // CRITICAL: Fixed width prevents brand section from affecting layout
            minWidth: '280px',
            flexShrink: 0
          }}>
            <Link 
              href="/" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div 
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  padding: '12px',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                  flexShrink: 0
                }}
              >
                <Zap style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
              <div style={{ minWidth: '0' }}>
                <h1 style={{ 
                  margin: '0',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: textColor,
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {currentServiceInfo?.name || 'Microservices'}
                </h1>
                <p style={{
                  margin: '0',
                  fontSize: '12px',
                  color: isDarkTheme || isGradientTheme 
                    ? 'rgba(255, 255, 255, 0.7)' 
                    : '#6b7280',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {currentServiceInfo?.description || 'Modern Architecture'}
                </p>
              </div>
            </Link>
          </div>

          {/* RIGHT: Controls Section - FIXED WIDTH CONTAINER */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              // CRITICAL: Fixed width prevents layout shifts
              minWidth: isLargeScreen ? '480px' : '120px',
              justifyContent: 'flex-end',
              flexShrink: 0
            }}
          >
            
            {/* Service Switcher - Desktop Only */}
            {isLargeScreen && isClient && (
              <div style={{ 
                position: 'relative', 
                flexShrink: 0,
                // CRITICAL: Fixed width for service switcher
                minWidth: '180px'
              }}>
                <ServiceSwitcher 
                  currentService={currentService}
                  services={services}
                  showStatus={true}
                />
              </div>
            )}

            {/* User Section - ALWAYS FIXED WIDTH */}
            <div style={{ 
              position: 'relative', 
              flexShrink: 0,
              // CRITICAL: Always reserve the same space
              minWidth: isLargeScreen ? '200px' : '48px',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              {!isClient ? (
                // CRITICAL: SSR placeholder with exact dimensions
                <div 
                  style={{
                    minWidth: isLargeScreen ? '160px' : '40px',
                    maxWidth: isLargeScreen ? '250px' : '40px',
                    height: '48px',
                    background: isDarkTheme 
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    flexShrink: 0,
                    // Subtle animation to indicate loading
                    opacity: '0.6'
                  }}
                />
              ) : status === 'loading' ? (
                // Loading state with exact same dimensions
                <div 
                  style={{
                    minWidth: isLargeScreen ? '160px' : '40px',
                    maxWidth: isLargeScreen ? '250px' : '40px',
                    height: '48px',
                    background: isDarkTheme 
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    borderRadius: '12px',
                    opacity: '0.6',
                    flexShrink: 0,
                    // Pulse animation
                    animation: 'pulse 2s ease-in-out infinite alternate'
                  }}
                />
              ) : session ? (
                // User dropdown with fixed dimensions
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
                        // CRITICAL: Fixed dimensions prevent shifts
                        minWidth: isLargeScreen ? '160px' : '40px',
                        maxWidth: isLargeScreen ? '250px' : '40px',
                        height: '48px',
                        flexShrink: 0,
                        justifyContent: isLargeScreen ? 'flex-start' : 'center'
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
                        src={session.user?.image || undefined}
                        alt={session.user?.name || ''}
                        fallback={session.user?.name?.charAt(0) || 'U'}
                        size={32}
                      />
                      {isLargeScreen && (
                        <>
                          <span style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: textColor,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {session.user?.name || 'User'}
                          </span>
                          <ChevronDown style={{ 
                            width: '16px', 
                            height: '16px', 
                            color: textColor,
                            opacity: '0.7' 
                          }} />
                        </>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  
                  {/* CRITICAL: Absolutely positioned dropdown */}
                  <DropdownMenuContent 
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: '0',
                      zIndex: '60',
                      marginTop: '8px',
                      width: '240px',
                      background: 'white',
                      borderRadius: '12px',
                      padding: '8px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      border: '1px solid rgba(0, 0, 0, 0.1)'
                    }}
                    align="end"
                    forceMount={false}
                  >
                    <DropdownMenuLabel style={{ 
                      padding: '12px 16px', 
                      borderBottom: '1px solid #f3f4f6',
                      marginBottom: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <InlineAvatar
                          src={session.user?.image || undefined}
                          alt={session.user?.name || ''}
                          fallback={session.user?.name?.charAt(0) || 'U'}
                          size={40}
                        />
                        <div style={{ minWidth: '0', flex: '1' }}>
                          <p style={{ 
                            margin: '0', 
                            fontSize: '14px', 
                            fontWeight: '600',
                            color: '#1f2937',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {session.user?.name}
                          </p>
                          <p style={{ 
                            margin: '0', 
                            fontSize: '12px', 
                            color: '#6b7280',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {session.user?.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    
                    <DropdownMenuItem style={{ 
                      padding: '12px 16px', 
                      margin: '0 8px', 
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}>
                      <Settings style={{ width: '16px', height: '16px', marginRight: '12px' }} />
                      <span>Preferences</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator style={{ 
                      margin: '8px 0',
                      height: '1px',
                      background: '#f3f4f6'
                    }} />
                    
                    <DropdownMenuItem 
                      onClick={() => signOut()}
                      style={{
                        padding: '12px 16px',
                        margin: '0 8px 8px 8px',
                        borderRadius: '8px',
                        color: '#dc2626',
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut style={{ width: '16px', height: '16px', marginRight: '12px' }} />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Sign in button with fixed dimensions
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
                    width: isLargeScreen ? '100px' : '40px',
                    height: '48px',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
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
                  {isLargeScreen ? 'Sign In' : <User style={{ width: '20px', height: '20px' }} />}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            {!isLargeScreen && isClient && (
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
                  flexShrink: 0,
                  marginLeft: '8px'
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
            )}
          </div>
        </div>
      </div>

      {/* CRITICAL: Content spacer - prevents content from hiding behind fixed header */}
      <div style={{ height: '80px', flexShrink: 0 }} />

      {/* Mobile Menu - ABSOLUTELY POSITIONED */}
      {!isLargeScreen && isMobileMenuOpen && isClient && (
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
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            // CRITICAL: Prevents layout shift
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto'
          }}
        >
          <div style={{ 
            fontSize: '12px', 
            color: isDarkTheme || isGradientTheme
              ? 'rgba(255, 255, 255, 0.7)' 
              : '#6b7280',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Select Service
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {services.map((service) => {
              const isActive = currentService?.toLowerCase().includes(service.name.toLowerCase().split(' ')[0])
              return (
                <Link
                  key={service.name}
                  href={service.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    background: isActive 
                      ? 'rgba(99, 102, 241, 0.2)' 
                      : 'transparent',
                    border: isActive 
                      ? '1px solid rgba(99, 102, 241, 0.3)' 
                      : '1px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = isDarkTheme 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.02)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: service.status === 'active' 
                      ? '#10b981' 
                      : '#6b7280',
                    flexShrink: 0
                  }} />
                  <div style={{ flex: '1', minWidth: '0' }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: textColor,
                      marginBottom: '2px'
                    }}>
                      {service.name}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: isDarkTheme || isGradientTheme
                        ? 'rgba(255, 255, 255, 0.7)' 
                        : '#6b7280'
                    }}>
                      {service.description}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Pulse animation keyframes */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </>
  )
}