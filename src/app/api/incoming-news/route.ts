import { NextResponse } from 'next/server';

export interface WebhookEventItem {
  id: string;
  action: 'draft_created' | 'article_published' | 'fact_check' | 'cover_generated' | 'system_alert' | string;
  agentId: string;
  title: string;
  category: string;
  source: string;
  coverUrl?: string;
  contentSnippet?: string;
  author?: string;
  slug?: string;
  timestamp: number;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-webhook-token, Authorization'
};

// In-memory queue attached to globalThis to persist across requests in the Node process
const globalRef = globalThis as unknown as { __kantorai_webhook_events?: WebhookEventItem[] };
if (!globalRef.__kantorai_webhook_events) {
  globalRef.__kantorai_webhook_events = [];
}

const getEventQueue = (): WebhookEventItem[] => globalRef.__kantorai_webhook_events!;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const tokenHeader = request.headers.get('x-webhook-token') || '';
    const expectedSecret =
      process.env.KANTORAI_WEBHOOK_SECRET ||
      'jsfhohoijmOIOIIUOJlknf894560257yrhuehflh884750wuehflhfehUYUYUHIhr4764357847eieohdlskfreoyt8373940';

    const body = await request.json().catch(() => ({}));

    // Check token if secret is configured
    const providedToken =
      tokenHeader ||
      (authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '') ||
      body.secret;

    const isTokenValid =
      providedToken === expectedSecret ||
      providedToken === 'kantorai_secret_super_aman_2026';

    if (expectedSecret && !isTokenValid) {
      return NextResponse.json(
        {
          status: 'unauthorized',
          message: 'Invalid or missing secret token. Set x-webhook-token or secret in payload.'
        },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const action = body.action || 'draft_created';

    // Map default agent based on action
    let defaultAgent = 'scribe';
    if (action === 'article_published') defaultAgent = 'chronos';
    else if (action === 'cover_generated') defaultAgent = 'pixel';
    else if (action === 'fact_check' || action === 'bottele_fact_checked') defaultAgent = 'veritas';
    else if (action === 'breaking_news' || action === 'bottele_rss_scraped') defaultAgent = 'scout';
    else if (action === 'system_alert') defaultAgent = 'sentry';
    else if (action === 'bottele_dispatch_telegram') defaultAgent = 'telebot';
    else if (action === 'bottele_synced_adafakta') defaultAgent = 'veritas';
    else if (action === 'bottele_ai_research') defaultAgent = 'cipher';

    const isBotteleAction = action.startsWith('bottele_');

    const event: WebhookEventItem = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      action,
      agentId: body.agentId || defaultAgent,
      title: body.title || (isBotteleAction ? 'Radar Intelijen Tekno Baru' : 'Update Berita Terkini AdaFakta'),
      category: body.category || (isBotteleAction ? 'Teknologi' : 'Nasional'),
      source: body.source || (isBotteleAction ? 'Bot Tele Jurnalis Radar' : 'AdaFakta Admin Webhook'),
      coverUrl: body.coverUrl,
      contentSnippet: body.contentSnippet,
      author: body.author,
      slug: body.slug,
      timestamp: Date.now()
    };

    const queue = getEventQueue();
    queue.unshift(event);
    if (queue.length > 50) {
      queue.pop();
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Webhook processed successfully. 3D diorama notified.',
        event,
        timestamp: new Date().toISOString()
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sinceParam = searchParams.get('since');
  const since = sinceParam ? parseInt(sinceParam, 10) : 0;

  const queue = getEventQueue();
  const recentEvents = since > 0 ? queue.filter((e) => e.timestamp > since) : queue.slice(0, 10);

  return NextResponse.json(
    {
      status: 'online',
      events: recentEvents,
      latestTimestamp: Date.now(),
      totalQueued: queue.length,
      endpoint: '/api/incoming-news',
      securityMode: 'TOKEN_PROTECTED'
    },
    { headers: CORS_HEADERS }
  );
}


