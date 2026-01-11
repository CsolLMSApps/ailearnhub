import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

interface ServiceStatus {
  name: string
  status: 'healthy' | 'degraded' | 'down'
  message?: string
  responseTime?: number
}

export async function GET() {
  const startTime = Date.now()
  const services: ServiceStatus[] = []
  
  // 1. Test Supabase Database
  try {
    const dbStart = Date.now()
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('courses')
      .select('count')
      .limit(1)
    
    const dbTime = Date.now() - dbStart
    
    if (error) throw error
    
    services.push({
      name: 'Supabase Database',
      status: 'healthy',
      message: 'Connected successfully',
      responseTime: dbTime
    })
  } catch (error: any) {
    services.push({
      name: 'Supabase Database',
      status: 'down',
      message: error.message || 'Connection failed'
    })
  }
  
  // 2. Test Supabase Auth
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.auth.getSession()
    
    services.push({
      name: 'Supabase Auth',
      status: 'healthy',
      message: 'Auth service operational'
    })
  } catch (error: any) {
    services.push({
      name: 'Supabase Auth',
      status: 'down',
      message: 'Auth service unavailable'
    })
  }
  
  // 3. Test Stripe API (basic connectivity)
  try {
    const stripeCheck = await fetch('https://api.stripe.com/v1', {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
      }
    })
    
    services.push({
      name: 'Stripe API',
      status: stripeCheck.ok ? 'healthy' : 'degraded',
      message: stripeCheck.ok ? 'API accessible' : 'API may be degraded'
    })
  } catch (error: any) {
    services.push({
      name: 'Stripe API',
      status: 'down',
      message: 'Cannot reach Stripe API'
    })
  }
  
  // 4. Test Resend API
  try {
    const resendCheck = await fetch('https://api.resend.com/emails', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      }
    })
    
    services.push({
      name: 'Resend Email',
      status: resendCheck.ok ? 'healthy' : 'degraded',
      message: resendCheck.ok ? 'Email service operational' : 'Email service may be degraded'
    })
  } catch (error: any) {
    services.push({
      name: 'Resend Email',
      status: 'down',
      message: 'Cannot reach Resend API'
    })
  }
  
  // 5. Check Environment Variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'RESEND_API_KEY'
  ]
  
  const missingEnvVars = requiredEnvVars.filter(key => !process.env[key])
  
  services.push({
    name: 'Environment Variables',
    status: missingEnvVars.length === 0 ? 'healthy' : 'down',
    message: missingEnvVars.length === 0 
      ? 'All required variables present' 
      : `Missing: ${missingEnvVars.join(', ')}`
  })
  
  // Determine overall status
  const hasDown = services.some(s => s.status === 'down')
  const hasDegraded = services.some(s => s.status === 'degraded')
  
  const overallStatus = hasDown ? 'unhealthy' : hasDegraded ? 'degraded' : 'healthy'
  
  const totalTime = Date.now() - startTime
  
  return NextResponse.json({
    status: overallStatus,
    timestamp: new Date().toISOString(),
    responseTime: totalTime,
    services: services,
    version: '1.0.0'
  }, {
    status: overallStatus === 'unhealthy' ? 503 : 200
  })
}
