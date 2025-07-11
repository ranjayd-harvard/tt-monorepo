// Create apps/rest-service/src/app/debug/page.tsx (temporary for testing)
export default function DebugPage() {
    return (
      <div className="p-4">
        <h1>Environment Debug</h1>
        <p>Google Client ID: {process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Not Set'}</p>
        <p>Google Client Secret: {process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Not Set'}</p>
        <p>NextAuth Secret: {process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Not Set'}</p>
        <p>NextAuth URL: {process.env.NEXTAUTH_URL || 'Not Set'}</p>
      </div>
    )
  }