import LandingPage from '@repo/ui/components/auth/landing-page'

export default function HomePage() {
  return (
    <LandingPage 
      serviceName="Rest Service"
      serviceDescription="Powerful REST API service with secure authentication"
      features={[
        "RESTful API Design",
        "Real-time Data Processing", 
        "Scalable Architecture",
        "Comprehensive Security"
      ]}
    />
  )
}
