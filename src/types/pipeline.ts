import { AgentId } from './agent';

export type PipelineStage = 'incoming' | 'drafting' | 'image_processing' | 'scheduled' | 'published';

export interface PipelineArticle {
  id: string;
  title: string;
  category: string;
  source: string;
  currentStage: PipelineStage;
  assignedAgent: AgentId;
  readTime: string;
  wordCount: number;
  featuredImage?: string;
  originalImageSize?: string;
  optimizedImageSize?: string;
  scheduledTime?: string;
  publishedUrl?: string;
  seoScore: number;
  telegramNotified: boolean;
  indexedGoogle: boolean;
  createdAt: string;
  updatedAt: string;
}

