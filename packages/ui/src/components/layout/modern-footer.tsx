// packages/ui/src/components/layout/modern-footer.tsx
import Link from 'next/link'
import { Github, Twitter, Mail, ExternalLink, Heart, Zap } from 'lucide-react'

export function ModernFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      <div className="relative border-t border-border/50">
        <div className="container mx-auto px-6 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-primary p-2 rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold gradient-text">Microservices</h3>
                  <p className="text-sm text-muted-foreground">Platform</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A cutting-edge monorepo architecture with shared authentication and modern UI components for scalable microservices.
              </p>
              <div className="flex space-x-4">
                <Link 
                  href="https://github.com" 
                  className="p-2 rounded-xl hover:bg-accent/10 transition-colors group"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                </Link>
                <Link 
                  href="https://twitter.com" 
                  className="p-2 rounded-xl hover:bg-accent/10 transition-colors group"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5 text-muted-foreground group-hover:text-accent" />
                </Link>
                <Link 
                  href="mailto:contact@example.com" 
                  className="p-2 rounded-xl hover:bg-accent/10 transition-colors group"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                </Link>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h4 className="font-semibold text-foreground">Services</h4>
              <div className="space-y-4">
                {[
                  { name: 'Rest Service', href: 'http://localhost:3000', icon: '🚀' },
                  { name: 'Menu Service', href: 'http://localhost:3001', icon: '📋' },
                  { name: 'Blog Service', href: 'http://localhost:3002', icon: '✍️' }
                ].map((service) => (
                  <Link 
                    key={service.name}
                    href={service.href} 
                    className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <span className="text-sm">{service.icon}</span>
                    <span className="group-hover:translate-x-1 transition-transform">{service.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="space-y-6">
              <h4 className="font-semibold text-foreground">Resources</h4>
              <div className="space-y-4">
                {[
                  { name: 'Documentation', href: '/docs' },
                  { name: 'API Reference', href: '/api' },
                  { name: 'Support Center', href: '/support' },
                  { name: 'Status Page', href: '/status' }
                ].map((link) => (
                  <Link 
                    key={link.name}
                    href={link.href} 
                    className="block text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 transform duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-6">
              <h4 className="font-semibold text-foreground">Stay Updated</h4>
              <p className="text-sm text-muted-foreground">
                Get the latest updates on new features and platform improvements.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="input-modern w-full"
                />
                <button className="btn-primary-modern w-full">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-border/50">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>© {currentYear} Microservices Platform.</span>
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                <span>by developers, for developers.</span>
              </div>
              <div className="flex space-x-8">
                <Link 
                  href="/privacy" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

