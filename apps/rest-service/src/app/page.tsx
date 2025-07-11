'use client'

import { Button } from '@repo/ui/components'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@repo/ui/components'
import { useSession, signIn, signOut } from '@repo/auth'
import { 
  Server, 
  Database, 
  Code, 
  Shield, 
  Zap, 
  ArrowRight,
  Play,
  CheckCircle
} from 'lucide-react'

export default function RestServicePage() {
  const { data: session } = useSession()

  const features = [
    {
      icon: Server,
      title: "High-Performance APIs",
      description: "Lightning-fast REST endpoints with sub-100ms response times",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Database,
      title: "Smart Data Layer",
      description: "Intelligent caching and optimized database connections",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Military-grade encryption with OAuth 2.0 and JWT tokens",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "Clean, well-documented API interfaces with examples",
      gradient: "from-orange-500 to-red-500"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Floating Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>

            <div className="relative">
              <div className="inline-flex items-center space-x-2 glass rounded-full px-4 py-2 text-sm border">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-medium">REST API Service v2.0</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold mt-6 mb-6">
                <span className="gradient-text">Lightning Fast</span><br />
                REST APIs
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Build powerful applications with our high-performance REST API service. 
                Enterprise-grade security, global CDN, and sub-100ms response times.
              </p>
            </div>

            {session ? (
              <div className="space-y-6">
                <div className="card-glass p-6 max-w-md mx-auto border border-green-500/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span className="font-semibold text-green-400">Authenticated</span>
                  </div>
                  <p className="text-muted-foreground">
                    Welcome back, <span className="font-semibold text-foreground">{session.user?.name}</span>! 
                    Your API keys are active and ready to use.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="btn-primary-modern group">
                    <Play className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    Try API Playground
                  </Button>
                  <Button onClick={() => signOut()} variant="outline" className="rounded-xl">
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="card-glass p-6 max-w-md mx-auto border border-amber-500/20">
                  <p className="text-muted-foreground">
                    Sign in to access API keys, documentation, and start building amazing applications.
                  </p>
                </div>
                <Button onClick={() => signIn()} className="btn-primary-modern group">
                  <span>Get Started Free</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build scalable applications with confidence
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