// Modern Menu Service Page
// apps/menu-service/src/app/page.tsx
'use client'

import { Button } from '@repo/ui/components'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@repo/ui/components'
import { useSession, signIn, signOut } from '@repo/auth'
import { 
  Menu,
  Navigation,
  Settings,
  Layers,
  Zap,
  ArrowRight,
  Plus,
  Edit,
  Shield,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'

export default function MenuServicePage() {
  const { data: session } = useSession()

  const features = [
    {
      icon: Navigation,
      title: "Dynamic Navigation",
      description: "Create responsive, multi-level navigation menus that adapt to any screen size",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: Settings,
      title: "Permission Control",
      description: "Fine-grained access control with role-based menu visibility",
      gradient: "from-violet-500 to-purple-500"
    },
    {
      icon: Layers,
      title: "Menu Hierarchy",
      description: "Build complex menu structures with unlimited nesting levels",
      gradient: "from-rose-500 to-pink-500"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Touch-friendly interfaces that work perfectly on all devices",
      gradient: "from-blue-500 to-indigo-500"
    }
  ]

  const menuTypes = [
    {
      name: "Header Navigation",
      description: "Top-level navigation bars with dropdowns",
      icon: Monitor,
      items: ["Home", "Products", "Services", "About", "Contact"]
    },
    {
      name: "Sidebar Menu",
      description: "Collapsible sidebar navigation for dashboards",
      icon: Layers,
      items: ["Dashboard", "Analytics", "Users", "Settings", "Help"]
    },
    {
      name: "Mobile Menu",
      description: "Touch-optimized navigation for mobile devices",
      icon: Smartphone,
      items: ["Menu", "Search", "Profile", "Cart", "More"]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>

            <div className="relative">
              <div className="inline-flex items-center space-x-2 bg-gradient-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm">
                <Menu className="h-4 w-4 text-primary" />
                <span className="font-medium">Menu Management System</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold mt-6 mb-6">
                <span className="gradient-text">Smart Navigation</span><br />
                Made Simple
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Create, manage, and deploy beautiful navigation menus across all your applications. 
                Responsive design, permission controls, and real-time updates.
              </p>
            </div>

            {session ? (
              <div className="space-y-6">
                <div className="glass-dark border border-emerald-500/20 rounded-2xl p-6 max-w-md mx-auto">
                  <p className="text-muted-foreground">
                    Welcome, <span className="font-semibold text-foreground">{session.user?.name}</span>! 
                    Ready to create amazing navigation experiences.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="btn-primary-modern group">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Menu
                  </Button>
                  <Button variant="outline" className="rounded-xl">
                    <Edit className="mr-2 h-4 w-4" />
                    Manage Existing
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="glass rounded-2xl p-6 max-w-md mx-auto border border-amber-500/20">
                  <p className="text-muted-foreground">
                    Sign in to start creating and managing navigation menus for your applications.
                  </p>
                </div>
                <Button onClick={() => signIn()} className="btn-primary-modern group">
                  <span>Get Started</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Menu Types Section */}
      {session && (
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                <span className="gradient-text">Menu Templates</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Choose from pre-built templates or create your own
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {menuTypes.map((menu, index) => (
                <div key={index} className="card-glass p-6 hover-lift">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-primary rounded-xl">
                      <menu.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{menu.name}</h3>
                      <p className="text-sm text-muted-foreground">{menu.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {menu.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                        <span className="text-sm">{item}</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-6 rounded-xl" variant="outline">
                    Use Template
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create outstanding navigation experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-glass p-8 hover-lift group">
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:gradient-text transition-all">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}