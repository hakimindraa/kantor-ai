// types/kantorAi.ts
export type OfficeAction =
  | 'draft_created'
  | 'cover_generated'
  | 'article_published'
  | 'article_rewritten'
  | 'ai_studio_generated'
  | 'author_created'
  | 'db_purged'
  | 'bottele_rss_scraped'
  | 'bottele_dispatch_telegram'
  | 'bottele_synced_adafakta';

export interface OfficeEvent {
  action: OfficeAction;
  title: string;
  category?: string;
  coverUrl?: string;
  articleUrl?: string;
  author?: string;
  excerpt?: string;
  source?: string;
  model?: string;
  timestamp: number;
}

