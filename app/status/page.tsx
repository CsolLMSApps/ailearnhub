import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'System Status | AI Learn Hub',
  description: 'Current status of AI Learn Hub services and dependencies'
}

export const dynamic = 'force-dynamic'

interface ExternalService {
  name: string
  status: string
  url: string
  description: string
}

export default async function StatusPage() {
  // Fetch health check
  let healthData = null
  try {
    const response = await fetch('https://ailearnhub.io/api/health', {
      cache: 'no-store'
    })
    healthData = await response.json()
  } catch (error) {
    console.error('Failed to fetch health data:', error)
  }

  // External services status pages
  const externalServices: ExternalService[] = [
    {
      name: 'Supabase',
      status: 'Check Status',
      url: 'https://status.supabase.com',
      description: 'Database & Authentication'
    },
    {
      name: 'Stripe',
      status: 'Check Status',
      url: 'https://status.stripe.com',
      description: 'Payment Processing'
    },
    {
      name: 'Vercel',
      status: 'Check Status',
      url: 'https://www.vercel-status.com',
      description: 'Hosting & Deployment'
    },
    {
      name: 'Resend',
      status: 'Check Status',
      url: 'https://resend.com/status',
      description: 'Email Delivery'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'degraded': return 'text-yellow-600 bg-yellow-100'
      case 'down': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✓'
      case 'degraded': return '⚠'
      case 'down': return '✕'
      default: return '?'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">System Status</h1>
          <p className="text-xl text-gray-600">
            Current operational status of AI Learn Hub
          </p>
          {healthData && (
            <div className="mt-4">
              <span className={`inline-block px-4 py-2 rounded-full font-bold ${getStatusColor(healthData.status)}`}>
                {getStatusIcon(healthData.status)} Overall Status: {healthData.status.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Internal Services */}
        {healthData && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Internal Services</h2>
            <div className="space-y-4">
              {healthData.services.map((service: any, index: number) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.message}</p>
                    {service.responseTime && (
                      <p className="text-xs text-gray-500 mt-1">Response time: {service.responseTime}ms</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full font-bold text-sm ${getStatusColor(service.status)}`}>
                    {getStatusIcon(service.status)} {service.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
              Last checked: {new Date(healthData.timestamp).toLocaleString()}
              <span className="ml-4">Response time: {healthData.responseTime}ms</span>
            </div>
          </div>
        )}

        {/* External Services */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">External Dependencies</h2>
          <div className="space-y-4">
            {externalServices.map((service, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FF6F00] hover:bg-[#E65100] text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                >
                  Check Status →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Monitoring Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-blue-900 mb-2">Continuous Monitoring</h3>
          <p className="text-blue-800 text-sm">
            All services are monitored every 5 minutes. Automatic alerts are sent if any service becomes unavailable.
          </p>
        </div>

        {/* Incident History */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Incidents</h2>
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg">No recent incidents</p>
            <p className="text-sm mt-2">All systems operating normally</p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-[#FF6F00] hover:text-[#E65100] font-bold"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
