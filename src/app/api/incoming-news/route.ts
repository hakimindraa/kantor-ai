import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    return NextResponse.json({
      status: 'success',
      agent: 'SCOUT',
      message: 'Incoming news payload received and queued for deduplication.',
      payloadReceived: body,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    agent: 'SCOUT',
    endpoint: '/api/incoming-news',
    monitoredSources: 48,
    activeFeeds: ['antara-rss', 'reuters-wire', 'kompas-tech', 'bmkg-alerts'],
    mode: 'SIMULATED'
  });
}

