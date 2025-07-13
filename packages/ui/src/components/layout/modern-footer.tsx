import Link from 'next/link'
import { Github, Twitter, Mail, ExternalLink, Heart, Zap } from 'lucide-react'

export function ModernFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer 
      style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        marginTop: '80px'
      }}
    >
      {/* Decorative top border */}
      <div 
        style={{
          height: '4px',
          background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)'
        }}
      />
      
      <div style={{ padding: '64px 0' }}>
        <div className="container mx-auto px-6">
          {/* Main Footer Content */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '48px',
            marginBottom: '48px'
          }}>
            {/* Brand Section */}
            <div style={{ maxWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div 
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    padding: '12px',
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  <Zap style={{ width: '24px', height: '24px', color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ 
                    margin: '0',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Microservices
                  </h3>
                  <p style={{ margin: '0', fontSize: '14px', color: '#94a3b8' }}>
                    Platform
                  </p>
                </div>
              </div>
              <p style={{ 
                margin: '0 0 24px 0',
                color: '#cbd5e1',
                lineHeight: '1.6',
                fontSize: '16px'
              }}>
                A cutting-edge monorepo architecture with shared authentication and modern UI components for scalable microservices.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link 
                  href="https://github.com" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  aria-label="GitHub"
                >
                  <Github style={{ width: '20px', height: '20px', color: 'white' }} />
                </Link>
                <Link 
                  href="https://twitter.com" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(29, 161, 242, 0.2)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(29, 161, 242, 0.3)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(29, 161, 242, 0.2)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  aria-label="Twitter"
                >
                  <Twitter style={{ width: '20px', height: '20px', color: '#1da1f2' }} />
                </Link>
                <Link 
                  href="mailto:contact@example.com" 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.3)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  aria-label="Email"
                >
                  <Mail style={{ width: '20px', height: '20px', color: '#6366f1' }} />
                </Link>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 style={{ 
                margin: '0 0 24px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: 'white'
              }}>
                Services
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { name: 'Documentation', href: '/docs' },
                  { name: 'API Reference', href: '/api' },
                  { name: 'Support Center', href: '/support' },
                  { name: 'Status Page', href: '/status' }
                ].map((link) => (
                  <Link 
                    key={link.name}
                    href={link.href} 
                    style={{
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      padding: '8px 0',
                      transition: 'all 0.2s ease',
                      borderBottom: '1px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'white'
                      e.currentTarget.style.borderBottomColor = '#6366f1'
                      e.currentTarget.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#cbd5e1'
                      e.currentTarget.style.borderBottomColor = 'transparent'
                      e.currentTarget.style.transform = 'translateX(0)'
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 style={{ 
                margin: '0 0 24px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: 'white'
              }}>
                Stay Updated
              </h4>
              <p style={{ 
                margin: '0 0 24px 0',
                color: '#cbd5e1',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                Get the latest updates on new features and platform improvements.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#6366f1'
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  }}
                />
                <button 
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
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div 
            style={{
              paddingTop: '32px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'space-between'
            }} className="md:flex-row">
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontSize: '14px',
                color: '#94a3b8'
              }}>
                <span>© {currentYear} Microservices Platform.</span>
                <span>Made with</span>
                <Heart style={{ 
                  width: '16px', 
                  height: '16px', 
                  color: '#ef4444',
                  animation: 'pulse 2s infinite'
                }} />
                <span>by developers, for developers.</span>
              </div>
              <div style={{ display: 'flex', gap: '32px' }}>
                <Link 
                  href="/privacy" 
                  style={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94a3b8'
                  }}
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/terms" 
                  style={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94a3b8'
                  }}
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
