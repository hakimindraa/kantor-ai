import { NextResponse } from 'next/server';
import { fetchNeonLiveStats } from '@/lib/neonDb';

export async function GET() {
  const stats = await fetchNeonLiveStats();
  return NextResponse.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    data: stats
  });
}

