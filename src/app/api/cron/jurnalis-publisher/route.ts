import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    cronJob: '/api/cron/jurnalis-publisher',
    agent: 'CHRONOS',
    executionTime: new Date().toISOString(),
    publishedBatchCount: 1,
    mode: 'SIMULATED'
  });
}

