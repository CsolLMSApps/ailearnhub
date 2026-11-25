// app/api/support/v1/health/route.ts
// Required by spec §3. Used by the Nexus for monitoring.
import { NextResponse } from 'next/server'
import { withNexusAuth } from '@/lib/nexus-auth'

export const GET = withNexusAuth(async () => {
  return NextResponse.json({ status: 'ok', service: 'ailearnhub.io', time: new Date().toISOString() })
})