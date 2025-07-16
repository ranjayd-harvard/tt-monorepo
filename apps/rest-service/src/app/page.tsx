import LandingPage from '@repo/ui/components/auth/landing-page'
import SessionDebug from '../../components/SessionDebug'

export default function HomePage() {
  return (

    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Your App</h1>
      
      {/* Add this temporarily to debug session */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Session Debug Info:</h2>
        <SessionDebug />
      </div>    

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

    </div>
    
  )
}
