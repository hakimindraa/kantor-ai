export interface OfficeStats {
  activeAgents: number;
  totalAgents: number;
  articlesToday: number;
  articlesTodayTarget: number;
  articlesTrendPercent: number;
  inQueue: number;
  publishedToday: number;
  nextPublishTime: string;
  serverHealth: number; // e.g. 99.98
  serverLatencyMs: number;
  bandwidthSavedMb: number;
  telegramAlertsSent: number;
  indexingSuccessRate: number;
}

export const INITIAL_OFFICE_STATS: OfficeStats = {
  activeAgents: 10,
  totalAgents: 10,
  articlesToday: 181,
  articlesTodayTarget: 181,
  articlesTrendPercent: 100,
  inQueue: 0,
  publishedToday: 181,
  nextPublishTime: 'Standby / Realtime',
  serverHealth: 99.98,
  serverLatencyMs: 18,
  bandwidthSavedMb: 842,
  telegramAlertsSent: 181,
  indexingSuccessRate: 100
};

import { AgentId } from '@/types/agent';

export type BotTeleRubricKey = 'ALL' | 'TEKNO' | 'POLITIK' | 'HUKUM' | 'LINGKUNGAN' | 'BISNIS' | 'INTERNASIONAL';

export interface RubricMetric {
  key: BotTeleRubricKey;
  label: string;
  iconName: string;
  assignedAgentId: AgentId;
  agentName: string;
  color: string;
  monitoredCount: number;
  syncedCount: number;
  dispatchCount: number;
  rssCount: number;
  feeds: string[];
}

export interface BotTeleStats {
  selectedRubric: BotTeleRubricKey;
  radarActive247: boolean;
  freshnessWindow: string;
  activeRssCount: number;
  monitoredTechCount: number;
  dispatchedTelegramCount: number;
  sentToAdaFaktaCount: number;
  lastScrapedSource?: string;
  isScrapingActive?: boolean;
  rubrics: Record<BotTeleRubricKey, RubricMetric>;
}

export const INITIAL_BOTTELE_STATS: BotTeleStats = {
  selectedRubric: 'ALL',
  radarActive247: true,
  freshnessWindow: '30 Menit (Bertahap)',
  activeRssCount: 6,
  monitoredTechCount: 0,
  dispatchedTelegramCount: 0,
  sentToAdaFaktaCount: 0,
  lastScrapedSource: 'TechCrunch',
  rubrics: {
    ALL: {
      key: 'ALL',
      label: 'Semua Liputan',
      iconName: 'Globe',
      assignedAgentId: 'telebot',
      agentName: 'TELEBOT',
      color: '#F97316',
      monitoredCount: 0,
      syncedCount: 0,
      dispatchCount: 0,
      rssCount: 6,
      feeds: ['TechCrunch', 'The Verge', 'DetikINET', 'Antara Tekno', 'DailySocial', 'Google News Tekno ID']
    },
    TEKNO: {
      key: 'TEKNO',
      label: 'Teknologi & AI',
      iconName: 'Cpu',
      assignedAgentId: 'scout',
      agentName: 'SCOUT',
      color: '#00F0FF',
      monitoredCount: 0,
      syncedCount: 0,
      dispatchCount: 0,
      rssCount: 6,
      feeds: ['TechCrunch', 'The Verge', 'DetikINET', 'Antara Tekno', 'DailySocial', 'Google News Tekno ID']
    },
    POLITIK: {
      key: 'POLITIK',
      label: 'Politik & Pemilu',
      iconName: 'Landmark',
      assignedAgentId: 'gentra',
      agentName: 'GENTRA',
      color: '#E11D48',
      monitoredCount: 0,
      syncedCount: 0,
      dispatchCount: 0,
      rssCount: 5,
      feeds: ['Antara Politik', 'Detik News Pemilu', 'Tempo Politik', 'CNN Indonesia Politik', 'KPU Media Center']
    },
    HUKUM: {
      key: 'HUKUM',
      label: 'Hukum & Kriminal',
      iconName: 'Scale',
      assignedAgentId: 'veritas',
      agentName: 'VERITAS',
      color: '#3B82F6',
      monitoredCount: 0,
      syncedCount: 0,
      dispatchCount: 0,
      rssCount: 4,
      feeds: ['Siaran Pers KPK', 'Hukumonline', 'Kejaksaan RI Feed', 'Mahkamah Agung News']
    },
    LINGKUNGAN: {
      key: 'LINGKUNGAN',
      label: 'Lingkungan & Iklim',
      iconName: 'Trees',
      assignedAgentId: 'gaia',
      agentName: 'GAIA',
      color: '#10B981',
      monitoredCount: 0,
      syncedCount: 0,
      dispatchCount: 0,
      rssCount: 4,
      feeds: ['Greenpeace ID', 'BMKG Cuaca & Iklim', 'Walhi Nasional', 'Mongabay Indonesia']
    },
    BISNIS: {
      key: 'BISNIS',
      label: 'Bisnis & Ekonomi',
      iconName: 'TrendingUp',
      assignedAgentId: 'artha',
      agentName: 'ARTHA',
      color: '#F59E0B',
      monitoredCount: 0,
      syncedCount: 0,
      dispatchCount: 0,
      rssCount: 5,
      feeds: ['Bisnis.com', 'CNBC Indonesia', 'Kontan Pasar Modal', 'Bloomberg Technoz', 'Bank Indonesia Rilis']
    },
    INTERNASIONAL: {
      key: 'INTERNASIONAL',
      label: 'Internasional',
      iconName: 'Compass',
      assignedAgentId: 'cipher',
      agentName: 'CIPHER',
      color: '#8B5CF6',
      monitoredCount: 0,
      syncedCount: 0,
      dispatchCount: 0,
      rssCount: 4,
      feeds: ['Reuters World', 'BBC News Asia', 'Al Jazeera English', 'AFP News']
    }
  }
};

export const HOURLY_ARTICLES_DATA = [
  { hour: '08:00', count: 1 },
  { hour: '10:00', count: 2 },
  { hour: '12:00', count: 4 },
  { hour: '14:00', count: 3 },
  { hour: '16:00', count: 3 },
  { hour: '18:00', count: 2 },
  { hour: '20:00', count: 3 }
];

export const CATEGORY_DISTRIBUTION = [
  { name: 'Teknologi & AI', percentage: 38, count: 7, color: '#4CC9F0' },
  { name: 'Fintech & Bisnis', percentage: 28, count: 5, color: '#8B5CF6' },
  { name: 'Nasional & Kebijakan', percentage: 22, count: 4, color: '#F59E0B' },
  { name: 'Sains & Kesehatan', percentage: 12, count: 2, color: '#10B981' }
];

export const AGENT_ACTIVITY_SUMMARY = [
  { name: 'SCOUT', task: 'Feed Processing', throughput: '1,420 items/hr', efficiency: 98 },
  { name: 'SCRIBE', task: 'Draft Generation', throughput: '26 drafts/day', efficiency: 97 },
  { name: 'PIXEL', task: 'WebP Optimization', throughput: '184 images/day', efficiency: 99 },
  { name: 'CHRONOS', task: 'Publish Queueing', throughput: '18 published/day', efficiency: 100 },
  { name: 'HERMES', task: 'Telegram Dispatch', throughput: '92 alerts/day', efficiency: 99 },
  { name: 'RADAR', task: 'API Indexing', throughput: '18 URLs indexed', efficiency: 100 },
  { name: 'SENTRY', task: 'Infra Guarding', throughput: '24ms DB Latency', efficiency: 99.9 }
];

