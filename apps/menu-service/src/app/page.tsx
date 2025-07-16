import LandingPage from '@repo/ui/components/auth/landing-page'

export default function HomePage() {
  return (
    <LandingPage 
      serviceName="Menu Service"
      serviceDescription="Dynamic menu management system with real-time updates"
      features={[
        "Dynamic Menu Management",
        "Real-time Menu Updates", 
        "Multi-language Support",
        "Advanced Analytics"
      ]}
    />
  )
}