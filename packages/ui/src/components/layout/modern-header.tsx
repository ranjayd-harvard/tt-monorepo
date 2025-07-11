// packages/ui/src/components/layout/modern-header.tsx
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
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface ModernHeaderProps {
  currentService?: string
}

export function ModernHeader({ currentService }: ModernHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const { data: session, status } = useSession()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle theme toggle
  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const services = [
    { 
      name: 'Rest Service', 
      href: 'http://localhost:3000', 
      description: 'API Gateway',
      icon: '🚀'
    },
    { 
      name: 'Menu Service', 
      href: 'http://localhost:3001', 
      description: 'Navigation Hub',
      icon: '📋'
    },
    { 
      name: 'Blog Service', 
      href: 'http://localhost:3002', 
      description: 'Content Platform',
      icon: '✍️'
    },
  ]

  const currentServiceInfo = services.find(service => 
    service.name.toLowerCase().includes(currentService?.toLowerCase() || '')
  )

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled 
          ? 'glass-dark shadow-strong backdrop-blur-xl border-b border-white/10' 
          : 'bg-transparent'
        }
      `}
    >
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Modern Logo */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative bg-gradient-primary p-2 rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold gradient-text">
                  {currentServiceInfo?.name || 'Microservices'}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {currentServiceInfo?.description || 'Platform'}
                </p>
              </div>
            </Link>
          </div>

          {/* Modern Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {services.map((service) => {
              const isActive = currentService?.toLowerCase().includes(
                service.name.toLowerCase().split(' ')[0]
              )
              return (
                <Link
                  key={service.name}
                  href={service.href}
                  className={`
                    relative px-4 py-2 rounded-xl transition-all duration-300 group
                    ${isActive 
                      ? 'bg-gradient-primary text-white shadow-glow' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{service.icon}</span>
                    <span className="font-medium">{service.name}</span>
                  </div>
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-primary rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Modern User Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl hover:bg-accent/10"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* User Authentication */}
            {status === 'loading' ? (
              <div className="h-10 w-10 animate-pulse bg-gradient-primary rounded-xl opacity-60" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-accent/10 rounded-xl p-2">
                    <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                      <AvatarImage 
                        src={session.user?.image || ''} 
                        alt={session.user?.name || 'User'} 
                      />
                      <AvatarFallback className="bg-gradient-primary text-white text-sm">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-64 glass-dark border-white/10" 
                  align="end" 
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={session.user?.image || ''} />
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{session.user?.name}</p>
                        <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-accent/10 rounded-lg mx-2">
                    <User className="mr-3 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-accent/10 rounded-lg mx-2">
                    <Settings className="mr-3 h-4 w-4" />
                    <span>Preferences</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    onClick={() => signOut()}
                    className="cursor-pointer text-destructive hover:bg-destructive/10 rounded-lg mx-2 mb-2"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => signIn()} 
                className="btn-primary-modern"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-xl hover:bg-accent/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Modern Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="glass-dark rounded-2xl m-4 p-4 border border-white/10">
              <nav className="flex flex-col space-y-2">
                {services.map((service) => {
                  const isActive = currentService?.toLowerCase().includes(
                    service.name.toLowerCase().split(' ')[0]
                  )
                  return (
                    <Link
                      key={service.name}
                      href={service.href}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
                        ${isActive 
                          ? 'bg-gradient-primary text-white' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                        }
                      `}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-lg">{service.icon}</span>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-xs opacity-80">{service.description}</p>
                      </div>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}