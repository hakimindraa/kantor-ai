import { NextResponse } from 'next/server';
import { officeStore } from '@/lib/officeStore';
import { OfficeAction } from '@/types/kantorAi';

export interface WebhookEventItem {
  id: string;
  action: OfficeAction | string;
  agentId: string;
  title: string;
  category: string;
  source: string;
  coverUrl?: string;
  articleUrl?: string;
  contentSnippet?: string;
  author?: string;
  model?: string;
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

    // Check token if secret is configured (supports dual secrets: custom env or default safe key)
    const providedToken =
      tokenHeader ||
      (authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '') ||
      body.secret;

    const isTokenValid =
      providedToken === expectedSecret ||
      providedToken === 'kantorai_secret_super_aman_2026' ||
      providedToken === 'jsfhohoijmOIOIIUOJlknf894560257yrhuehflh884750wuehflhfehUYUYUHIhr4764357847eieohdlskfreoyt8373940';

    if (expectedSecret && !isTokenValid) {
      return NextResponse.json(
        {
          status: 'unauthorized',
          error: 'Unauthorized webhook',
          message: 'Invalid or missing secret token. Set x-webhook-token or secret in payload.'
        },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const action = body.action || 'draft_created';
    const isBotteleAction = action.startsWith('bottele_');
    const rawCategory = (body.category || '').toLowerCase();

    // Mapping Agent Sayap Barat (AdaFakta Workflow) vs Sayap Timur (Bot Tele Jurnalis Radar)
    let defaultAgent = 'scribe';
    let normalizedCategory = body.category || (isBotteleAction ? 'Teknologi & AI' : 'Nasional');

    // 1. Sayap Barat (AdaFakta Workflow)
    if (action === 'draft_created') {
      defaultAgent = 'scout_west';
    } else if (action === 'cover_generated') {
      defaultAgent = 'pixel';
    } else if (action === 'article_published') {
      defaultAgent = 'scribe';
    } else if (action === 'article_rewritten') {
      defaultAgent = 'sadur';
    } else if (action === 'ai_studio_generated') {
      defaultAgent = 'nova';
    } else if (action === 'author_created') {
      defaultAgent = 'hrd';
    } else if (action === 'db_purged') {
      defaultAgent = 'robosweep';
    }
    // 2. Sayap Timur (Bot Tele Jurnalis Rubrics)
    else if (action === 'bottele_dispatch_telegram') {
      defaultAgent = 'telebot';
    } else if (rawCategory.includes('politik') || rawCategory.includes('pemilu')) {
      defaultAgent = 'gentra';
      normalizedCategory = 'Politik & Pemilu';
    } else if (rawCategory.includes('hukum') || rawCategory.includes('kriminal') || rawCategory.includes('korupsi')) {
      defaultAgent = 'veritas';
      normalizedCategory = 'Hukum & Kriminal';
    } else if (rawCategory.includes('lingkungan') || rawCategory.includes('iklim') || rawCategory.includes('hutan')) {
      defaultAgent = 'gaia';
      normalizedCategory = 'Lingkungan & Iklim';
    } else if (rawCategory.includes('bisnis') || rawCategory.includes('ekonomi') || rawCategory.includes('ihsg') || rawCategory.includes('pasar')) {
      defaultAgent = 'artha';
      normalizedCategory = 'Bisnis & Ekonomi';
    } else if (rawCategory.includes('internasional') || rawCategory.includes('global') || rawCategory.includes('dunia')) {
      defaultAgent = 'cipher';
      normalizedCategory = 'Internasional';
    } else if (rawCategory.includes('tekno') || rawCategory.includes('ai') || isBotteleAction) {
      defaultAgent = 'scout';
      normalizedCategory = 'Teknologi & AI';
    } else if (action === 'system_alert') {
      defaultAgent = 'sentry';
    }

    // Trigger officeStore listener
    try {
      officeStore.trigger({
        action: action as OfficeAction,
        title: body.title || 'Aktivitas Baru',
        category: normalizedCategory,
        coverUrl: body.coverUrl,
        articleUrl: body.articleUrl,
        author: body.author,
        excerpt: body.excerpt || body.contentSnippet,
        source: body.source,
        model: body.model
      });
    } catch (e) {
      console.warn('officeStore trigger warning:', e);
    }

    const event: WebhookEventItem = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      action,
      agentId: body.agentId || defaultAgent,
      title: body.title || (isBotteleAction ? `Radar Intelijen [${normalizedCategory}] Baru` : 'Update Berita Terkini AdaFakta'),
      category: normalizedCategory,
      source: body.source || (isBotteleAction ? 'Bot Tele Jurnalis Radar' : 'AdaFakta Admin Webhook'),
      coverUrl: body.coverUrl,
      articleUrl: body.articleUrl,
      contentSnippet: body.contentSnippet || body.excerpt,
      author: body.author,
      model: body.model,
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
