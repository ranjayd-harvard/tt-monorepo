// packages/ui/src/components/layout/modern-header.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from '@repo/auth/session-provider'
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
        <span style={{ position: imageLoaded ? 'absolute' : 'relative', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
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
  const { data: session, status } = useSession()

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024)
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const services = [
    { name: 'Restaurant', href: 'http://localhost:3000', port: 3000, icon: '🍽️' },
    { name: 'Menu', href: 'http://localhost:3001', port: 3001, icon: '📱' },
    { name: 'Blog', href: 'http://localhost:3002', port: 3002, icon: '✍️' },
  ]

  // Theme configurations
  const getThemeStyles = () => {
    const isDarkTheme = theme === 'dark'
    const isGradientTheme = theme === 'gradient'
    const isGlassTheme = theme === 'glass'
    
    if (backgroundColor) {
      return {
        background: backgroundColor,
        textColor: theme === 'dark' ? '#ffffff' : '#1f2937',
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
      }
    }
    
    if (isGradientTheme) {
      return {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)'
      }
    }
    
    if (isDarkTheme) {
      return {
        background: '#1f2937',
        textColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }
    }
    
    if (isGlassTheme) {
      return {
        background: 'rgba(255, 255, 255, 0.8)',
        textColor: '#1f2937',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(20px)'
      }
    }
    
    // Default light theme
    return {
      background: '#ffffff',
      textColor: '#1f2937',
      borderColor: 'rgba(0, 0, 0, 0.1)'
    }
  }

  const { background, textColor, borderColor, backdropFilter } = getThemeStyles()
  const isDarkTheme = theme === 'dark'

  return (
    <header 
      style={{
        position: 'sticky',
        top: '0',
        zIndex: '50',
        width: '100%',
        background,
        backdropFilter: backdropFilter || 'blur(10px)',
        borderBottom: `1px solid ${borderColor}`,
        boxShadow: theme === 'glass' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px'
      }}>
        
        {/* Logo/Brand Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link 
            href="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: isDarkTheme 
                ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}>
              <Zap style={{ width: '20px', height: '20px' }} />
            </div>
            <span style={{
              fontSize: '24px',
              fontWeight: '700',
              color: textColor,
              letterSpacing: '-0.025em'
            }}>
              YourApp
            </span>
          </Link>

          {/* Service Navigation - Desktop */}
          <nav style={{ 
            display: isLargeScreen ? 'flex' : 'none',
            alignItems: 'center',
            gap: '8px',
            marginLeft: '32px'
          }}>
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
                    color: isActive ? (isDarkTheme ? '#ffffff' : '#1f2937') : textColor,
                    background: isActive 
                      ? (isDarkTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)')
                      : 'transparent',
                    transition: 'all 0.2s ease',
                    border: isActive ? `1px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'}` : '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = isDarkTheme 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.05)'
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
        </div>

        {/* Right Section - User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* Authentication Section */}
          {status === 'loading' ? (
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: isDarkTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
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
              
              {/* FIXED: Removed forceMount={false} */}
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
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  margin: '2px 8px'
                }}>
                  <User style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                  <span style={{ fontSize: '14px', color: '#1f2937' }}>Profile</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  margin: '2px 8px'
                }}>
                  <Settings style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                  <span style={{ fontSize: '14px', color: '#1f2937' }}>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator style={{ 
                  height: '1px', 
                  background: '#f3f4f6', 
                  margin: '8px 16px'
                }} />
                
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    margin: '2px 8px',
                    color: '#dc2626'
                  }}
                >
                  <LogOut style={{ width: '16px', height: '16px' }} />
                  <span style={{ fontSize: '14px' }}>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => signIn()}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: `2px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`,
                background: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                color: textColor,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkTheme 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(0, 0, 0, 0.1)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDarkTheme 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              display: isLargeScreen ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: 'none',
              background: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              color: textColor,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkTheme 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDarkTheme 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.05)'
            }}
          >
            {isMobileMenuOpen ? (
              <X style={{ width: '20px', height: '20px' }} />
            ) : (
              <Menu style={{ width: '20px', height: '20px' }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          background: background,
          borderTop: `1px solid ${borderColor}`,
          padding: '16px 24px',
          display: isLargeScreen ? 'none' : 'block'
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {services.map((service) => {
              const isActive = currentService?.toLowerCase().includes(service.name.toLowerCase())
              return (
                <Link
                  key={service.name}
                  href={service.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    textDecoration: 'none',
                    color: isActive ? (isDarkTheme ? '#ffffff' : '#1f2937') : textColor,
                    background: isActive 
                      ? (isDarkTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)')
                      : 'transparent',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{service.icon}</span>
                  {service.name}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}