import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    cronJob: '/api/cron/auto-purge',
    agent: 'SENTRY',
    purgedTempMb: 240,
    activePoolerConnections: 12,
    databaseStatus: 'HEALTHY',
    timestamp: new Date().toISOString(),
    mode: 'SIMULATED'
  });
}

