// packages/ui/src/components/layout/header.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from '@repo/auth'
import { Menu, X, User, LogOut, Settings, Home } from 'lucide-react'
import { Button } from '../ui/button'
import { 
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem, 
} from '../ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface HeaderProps {
  currentService?: string
}

export function Header({ currentService }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  const services = [
    { name: 'Rest Service', href: 'http://localhost:3000', port: 3000 },
    { name: 'Menu Service', href: 'http://localhost:3001', port: 3001 },
    { name: 'Blog Service', href: 'http://localhost:3002', port: 3002 },
  ]

  const currentServiceInfo = services.find(service => 
    service.name.toLowerCase().includes(currentService?.toLowerCase() || '')
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Home className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">
                {currentServiceInfo?.name || 'Microservices'}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Improved Styling */}
          <nav className="hidden md:flex items-center space-x-1">
            {services.map((service) => {
              const isActive = currentService?.toLowerCase().includes(service.name.toLowerCase().split(' ')[0])
              return (
                <Link
                  key={service.name}
                  href={service.href}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }
                  `}
                >
                  {service.name}
                </Link>
              )
            })}
          </nav>

          {/* User Authentication - Improved */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="h-8 w-8 animate-pulse bg-muted rounded-full" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-accent">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={session.user?.image || ''} 
                        alt={session.user?.name || 'User'} 
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut()}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => signIn()} className="px-6">
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - Improved */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <nav className="flex flex-col space-y-1 px-2 py-4">
              {services.map((service) => {
                const isActive = currentService?.toLowerCase().includes(service.name.toLowerCase().split(' ')[0])
                return (
                  <Link
                    key={service.name}
                    href={service.href}
                    className={`
                      px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {service.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}