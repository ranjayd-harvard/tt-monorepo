import LandingPage from '@repo/ui/components/auth/landing-page'

export default function HomePage() {
  return (
    <LandingPage 
      serviceName="Blog Service"
      serviceDescription="Modern content management system with powerful publishing tools"
      features={[
        "Rich Content Editor",
        "SEO Optimization", 
        "Comment System",
        "Content Analytics"
      ]}
    />
  )
}