import { create } from 'zustand';
import { AgentData, AgentId, AgentActivityLog, AgentStatus } from '@/types/agent';
import {
  CameraPreset,
  MovementMode,
  CameraInteractionMode,
  CameraActionType,
  OfficeDataMode,
  TimeOfDay,
  OfficeIncident,
  HologramEvent,
  RemoteActionType
} from '@/types/office';
import { PipelineArticle, PipelineStage } from '@/types/pipeline';
import { INITIAL_AGENTS } from '@/services/mock/mockAgents';
import { INITIAL_LOGS, SIMULATION_TEMPLATES } from '@/services/mock/mockActivities';
import { INITIAL_ARTICLES } from '@/services/mock/mockArticles';
import { INITIAL_OFFICE_STATS, OfficeStats } from '@/services/mock/mockAnalytics';

export type ActiveTab = 'office' | 'agents' | 'activity' | 'pipeline' | 'analytics' | 'backend' | 'settings';

export interface AdminOverrides {
  // Scribe
  scribeModel: 'gemini-3.8-flash' | 'claude-opus-thinking' | 'groq-gpt-oss';
  scribeWordTarget: number;
  scribeInternalLinks: boolean;
  scribePersona: 'straight' | 'investigative' | 'conversational';

  // Pixel
  pixelAutoScrape: boolean;
  pixelTargetWebpKb: number;
  pixelImgbbCdn: boolean;
  pixelWatermark: boolean;

  // Chronos
  chronosWaterfallGapMinutes: number;
  chronosAutoQueueActive: boolean;

  // Hermes
  hermesTelegramAlerts: boolean;
  hermesApprovalButtons: boolean;
  hermesTargetChannel: string;

  // Radar
  radarGoogleIndexing: boolean;
  radarBingIndexNow: boolean;
  radarSitemapLive: boolean;

  // Sentry
  sentryAutoPurge: boolean;
  sentryPoolerWatchdog: boolean;
  sentryVpsKeepalive: boolean;

  // Scout
  scoutAutoIngest: boolean;
  scoutDeduplication: boolean;
  scoutActiveFeeds: string[];
}

interface OfficeState {
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Agents
  agents: AgentData[];
  selectedAgentId: AgentId | null;
  selectAgent: (id: AgentId | null) => void;
  updateAgentStatus: (id: AgentId, status: AgentStatus) => void;
  updateAgentTask: (id: AgentId, task: string, activity: string) => void;
  toggleAgentWorkChill: (id: AgentId) => void;
  setAgentWorking: (id: AgentId) => void;
  setAgentIdle: (id: AgentId, chillPos?: [number, number, number], chillRot?: number) => void;

  // Admin Override Switches (Mandor Controls)
  adminOverrides: AdminOverrides;
  setAdminOverride: <K extends keyof AdminOverrides>(key: K, value: AdminOverrides[K]) => void;

  // 3D & Movement
  movementMode: MovementMode;
  setMovementMode: (mode: MovementMode) => void;
  controlledAgentId: AgentId;
  setControlledAgentId: (id: AgentId) => void;
  cameraPreset: CameraPreset;
  setCameraPreset: (preset: CameraPreset) => void;
  cameraResetTrigger: number;
  cameraFollowPlayer: boolean;
  setCameraFollowPlayer: (follow: boolean) => void;
  cameraInteractionMode: CameraInteractionMode;
  setCameraInteractionMode: (mode: CameraInteractionMode) => void;
  toggleCameraInteractionMode: () => void;
  cameraActionTrigger: { type: CameraActionType; id: number } | null;
  triggerCameraAction: (type: CameraActionType) => void;

  // Player manual control coordinates
  playerPosition: [number, number, number];
  playerRotation: number;
  setPlayerTransform: (pos: [number, number, number], rot: number) => void;

  // Activity logs
  activityLogs: AgentActivityLog[];
  logFilter: AgentId | 'all';
  setLogFilter: (filter: AgentId | 'all') => void;
  isStreamPaused: boolean;
  toggleStreamPaused: () => void;
  addActivityLog: (log: Omit<AgentActivityLog, 'id' | 'timestamp'>) => void;

  // Articles & Pipeline
  articles: PipelineArticle[];
  moveArticleStage: (articleId: string, nextStage: PipelineStage) => void;
  addArticle: (article: Omit<PipelineArticle, 'id' | 'createdAt' | 'updatedAt'>) => void;

  // Stats
  stats: OfficeStats;
  syncLiveDbStats: (dbData: any) => void;

  // UI Modals & Settings
  isBriefModalOpen: boolean;
  briefingAgentId: AgentId | null;
  openBriefModal: (agentId: AgentId) => void;
  closeBriefModal: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  triggerManualPipelineRun: () => void;
  isMobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;

  // Dual Mode: Live Admin vs Demo Sandbox
  dataMode: OfficeDataMode;
  setDataMode: (mode: OfficeDataMode) => void;
  toggleDataMode: () => void;

  // Time of Day: Day, Sunset, Night
  timeOfDay: TimeOfDay;
  setTimeOfDay: (time: TimeOfDay) => void;
  cycleTimeOfDay: () => void;

  // Autonomous Pipeline
  isAutonomousMode: boolean;
  setAutonomousMode: (active: boolean) => void;
  toggleAutonomousMode: () => void;

  // Real-time Hologram Event & Incident Alert
  activeHologram: HologramEvent | null;
  setActiveHologram: (event: HologramEvent | null) => void;
  incidentAlert: OfficeIncident;
  setIncidentAlert: (incident: OfficeIncident) => void;

  // Waterfall Countdown Timer (seconds)
  chronosCountdown: number;
  setChronosCountdown: (sec: number) => void;

  // Article Reader Modal
  activeReaderArticle: PipelineArticle | null;
  openArticleReader: (article: PipelineArticle) => void;
  closeArticleReader: () => void;
}

export const useOfficeStore = create<OfficeState>((set, get) => ({
  activeTab: 'office',
  setActiveTab: (tab) => set({ activeTab: tab, isMobileSidebarOpen: false }),
  isMobileSidebarOpen: false,
  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
  toggleMobileSidebar: () => set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),

  agents: INITIAL_AGENTS,
  selectedAgentId: null,
  selectAgent: (id) => {
    set({ selectedAgentId: id });
    if (id) {
      set({ cameraPreset: 'FOCUS_AGENT' });
    }
  },
  updateAgentStatus: (id, status) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === id ? { ...agent, status, lastActive: 'Baru saja' } : agent
      )
    }));
  },
  toggleAgentWorkChill: (id) => {
    const state = get();
    const agent = state.agents.find((a) => a.id === id);
    if (!agent) return;

    const willChill = agent.status === 'working';
    const nextStatus: AgentStatus = willChill ? 'idle' : 'working';

    const nextPosition = willChill ? [...agent.chillPosition] as [number, number, number] : [...agent.deskPosition] as [number, number, number];
    const nextRotation = willChill ? agent.chillRotation : agent.deskRotation;
    const nextActivity = willChill
      ? agent.chillActivity
      : `Bekerja aktif di meja PC: ${agent.assignedTask}`;

    set((s) => ({
      agents: s.agents.map((a) =>
        a.id === id
          ? {
              ...a,
              status: nextStatus,
              position: nextPosition,
              rotation: nextRotation,
              currentActivity: nextActivity,
              lastActive: 'Baru saja'
            }
          : a
      )
    }));

    state.addActivityLog({
      agentId: agent.id,
      agentName: agent.name,
      agentColor: agent.color,
      category: willChill ? 'editorial' : 'publishing',
      level: willChill ? 'info' : 'success',
      message: willChill
        ? `${agent.name} selesai dengan tugasnya & pergi ke dapur/breakroom untuk nyantai.`
        : `${agent.name} kembali ke meja PC-nya dan mulai bekerja aktif.`
    });
  },
  setAgentWorking: (id) => {
    const state = get();
    const agent = state.agents.find((a) => a.id === id);
    if (!agent) return;
    if (agent.status === 'working') return;

    set((s) => ({
      agents: s.agents.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'working',
              position: [...a.deskPosition],
              rotation: a.deskRotation,
              currentActivity: `Bekerja aktif di meja PC: ${a.assignedTask}`,
              lastActive: 'Baru saja'
            }
          : a
      )
    }));

    state.addActivityLog({
      agentId: agent.id,
      agentName: agent.name,
      agentColor: agent.color,
      category: 'editorial',
      level: 'success',
      message: `${agent.name} kembali ke meja PC-nya dan mulai bekerja aktif.`
    });
  },
  setAgentIdle: (id, chillPos, chillRot) => {
    const state = get();
    const agent = state.agents.find((a) => a.id === id);
    if (!agent) return;

    const nextPos = chillPos ? [...chillPos] as [number, number, number] : [...agent.chillPosition] as [number, number, number];
    const nextRot = chillRot !== undefined ? chillRot : agent.chillRotation;

    set((s) => ({
      agents: s.agents.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'idle',
              chillPosition: nextPos,
              chillRotation: nextRot,
              position: nextPos,
              rotation: nextRot,
              currentActivity: agent.chillActivity,
              lastActive: 'Baru saja'
            }
          : a
      )
    }));

    if (agent.status !== 'idle') {
      state.addActivityLog({
        agentId: agent.id,
        agentName: agent.name,
        agentColor: agent.color,
        category: 'editorial',
        level: 'info',
        message: `${agent.name} selesai dengan tugasnya & berjalan santai ke area breakroom.`
      });
    }
  },
  updateAgentTask: (id, task, activity) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === id
          ? {
              ...agent,
              assignedTask: task,
              currentActivity: activity,
              lastActive: 'Baru saja',
              status: 'working'
            }
          : agent
      )
    }));
  },

  // Admin Override Switches
  adminOverrides: {
    scribeModel: 'gemini-3.8-flash',
    scribeWordTarget: 420,
    scribeInternalLinks: true,
    scribePersona: 'investigative',

    pixelAutoScrape: true,
    pixelTargetWebpKb: 65,
    pixelImgbbCdn: true,
    pixelWatermark: true,

    chronosWaterfallGapMinutes: 60,
    chronosAutoQueueActive: true,

    hermesTelegramAlerts: true,
    hermesApprovalButtons: true,
    hermesTargetChannel: '@AdaFaktaAlerts',

    radarGoogleIndexing: true,
    radarBingIndexNow: true,
    radarSitemapLive: true,

    sentryAutoPurge: true,
    sentryPoolerWatchdog: true,
    sentryVpsKeepalive: true,

    scoutAutoIngest: true,
    scoutDeduplication: true,
    scoutActiveFeeds: ['Antara News', 'Detik Com', 'Kompas Tech', 'BMKG Cuaca', 'CNN Indonesia']
  },
  setAdminOverride: (key, value) => {
    set((state) => ({
      adminOverrides: {
        ...state.adminOverrides,
        [key]: value
      }
    }));
  },

  movementMode: 'AUTOMATIC',
  setMovementMode: (mode) => set({ movementMode: mode }),
  controlledAgentId: 'scout',
  setControlledAgentId: (id) => {
    const agent = get().agents.find((a) => a.id === id);
    set({
      controlledAgentId: id,
      playerPosition: agent ? [...agent.position] : [-10.5, 0, -1.35],
      playerRotation: 0
    });
  },
  cameraPreset: 'ISOMETRIC',
  cameraResetTrigger: 0,
  setCameraPreset: (preset) => set((s) => ({ cameraPreset: preset, cameraResetTrigger: s.cameraResetTrigger + 1 })),
  cameraFollowPlayer: false,
  setCameraFollowPlayer: (follow) => set({ cameraFollowPlayer: follow }),
  cameraInteractionMode: 'PAN',
  setCameraInteractionMode: (mode) => set({ cameraInteractionMode: mode }),
  toggleCameraInteractionMode: () =>
    set((state) => ({
      cameraInteractionMode: state.cameraInteractionMode === 'PAN' ? 'ORBIT' : 'PAN'
    })),
  cameraActionTrigger: null,
  triggerCameraAction: (type) =>
    set((state) => ({
      cameraActionTrigger: { type, id: (state.cameraActionTrigger?.id || 0) + 1 }
    })),

  playerPosition: [-10.5, 0, -1.35],
  playerRotation: 0,
  setPlayerTransform: (pos, rot) => set({ playerPosition: pos, playerRotation: rot }),

  activityLogs: INITIAL_LOGS,
  logFilter: 'all',
  setLogFilter: (filter) => set({ logFilter: filter }),
  isStreamPaused: false,
  toggleStreamPaused: () => set((state) => ({ isStreamPaused: !state.isStreamPaused })),
  addActivityLog: (logData) => {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    const newLog: AgentActivityLog = {
      ...logData,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp
    };
    set((state) => ({
      activityLogs: [newLog, ...state.activityLogs].slice(0, 100)
    }));
  },

  articles: INITIAL_ARTICLES,
  moveArticleStage: (articleId, nextStage) => {
    const now = new Date();
    const timestamp = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    set((state) => {
      const updated = state.articles.map((art) => {
        if (art.id === articleId) {
          const isPublished = nextStage === 'published';
          return {
            ...art,
            currentStage: nextStage,
            updatedAt: `2026-11-04 ${timestamp}`,
            indexedGoogle: isPublished ? true : art.indexedGoogle,
            telegramNotified: isPublished ? true : art.telegramNotified,
            publishedUrl: isPublished ? `https://www.adafakta.web.id/berita/${art.id}` : art.publishedUrl
          };
        }
        return art;
      });

      const publishedCount = updated.filter((a) => a.currentStage === 'published').length;
      const inQueueCount = updated.filter((a) => a.currentStage === 'scheduled').length;

      return {
        articles: updated,
        stats: {
          ...state.stats,
          publishedToday: publishedCount,
          inQueue: inQueueCount
        }
      };
    });
  },
  addArticle: (newArtData) => {
    const now = new Date();
    const timestamp = `2026-11-04 ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newArticle: PipelineArticle = {
      ...newArtData,
      id: `art-${String(Date.now()).slice(-4)}`,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    set((state) => ({
      articles: [newArticle, ...state.articles],
      stats: {
        ...state.stats,
        articlesToday: state.stats.articlesToday + 1
      }
    }));
  },

  stats: INITIAL_OFFICE_STATS,
  syncLiveDbStats: (dbData) => {
    if (!dbData || !dbData.connected) return;

    // Map real articles from database
    const mappedRealArticles: PipelineArticle[] = [];

    if (Array.isArray(dbData.recentDrafts)) {
      dbData.recentDrafts.forEach((d: any) => {
        mappedRealArticles.push({
          id: `draft-${d.id}`,
          title: d.title,
          category: d.category || 'Nasional',
          source: d.source || 'RSS Feed Wire',
          currentStage: d.status === 'draft' ? 'incoming' : 'drafting',
          assignedAgent: d.status === 'draft' ? 'scout' : 'scribe',
          readTime: '3 min',
          wordCount: 420,
          seoScore: 92,
          telegramNotified: false,
          indexedGoogle: false,
          createdAt: d.createdAt ? new Date(d.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Baru saja',
          updatedAt: 'Baru saja'
        });
      });
    }

    if (Array.isArray(dbData.recentArticles)) {
      dbData.recentArticles.forEach((a: any) => {
        mappedRealArticles.push({
          id: `art-${a.id}`,
          title: a.title,
          category: a.category || 'Berita',
          source: 'AdaFakta Redaksi',
          currentStage: a.status === 'published' ? 'published' : a.status === 'scheduled' ? 'scheduled' : 'drafting',
          assignedAgent: a.status === 'published' ? 'radar' : 'chronos',
          readTime: '4 min',
          wordCount: 480,
          featuredImage: a.coverUrl,
          originalImageSize: '2.8 MB (JPEG)',
          optimizedImageSize: '64 KB (WebP < 100 KB)',
          publishedUrl: `https://www.adafakta.web.id/berita/${a.slug}`,
          seoScore: 96,
          telegramNotified: true,
          indexedGoogle: true,
          createdAt: a.publishedAt ? new Date(a.publishedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Hari ini',
          updatedAt: 'Terbit'
        });
      });
    }

    set((state) => ({
      articles: mappedRealArticles.length > 0 ? mappedRealArticles : state.articles,
      stats: {
        ...state.stats,
        serverLatencyMs: dbData.latencyMs || 22,
        publishedToday: dbData.publishedArticlesCount || state.stats.publishedToday,
        inQueue: dbData.scheduledArticlesCount || state.stats.inQueue,
        articlesToday:
          (dbData.publishedArticlesCount || 0) +
          (dbData.scheduledArticlesCount || 0) +
          (dbData.draftArticlesCount || 0)
      }
    }));
  },

  isBriefModalOpen: false,
  briefingAgentId: null,
  openBriefModal: (agentId) => set({ isBriefModalOpen: true, briefingAgentId: agentId }),
  closeBriefModal: () => set({ isBriefModalOpen: false, briefingAgentId: null }),

  soundEnabled: false,
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

  triggerManualPipelineRun: () => {
    const state = get();
    const randomTopics = [
      'Investasi Pusat Data AI Nasional Naik Signifikan di Kuartal IV',
      'Peluncuran Standar Baru Keamanan Siber Finansial Berbasis Biometrik',
      'Kementerian ESDM Uji Coba Pembangkit Listrik Tenaga Surya Terapung',
      'Peluang Ekspor Kopi Spesialisasi Indonesia Tembus Pasar Eropa'
    ];
    const pickedTitle = randomTopics[Math.floor(Math.random() * randomTopics.length)];
    state.addArticle({
      title: pickedTitle,
      category: 'Teknologi',
      source: 'Antara News Feed',
      currentStage: 'incoming',
      assignedAgent: 'scout',
      readTime: '3 min',
      wordCount: state.adminOverrides.scribeWordTarget,
      seoScore: 92,
      telegramNotified: false,
      indexedGoogle: false
    });

    state.addActivityLog({
      agentId: 'scout',
      agentName: 'SCOUT',
      agentColor: '#0284C7',
      category: 'fetch',
      level: 'success',
      message: `Scout: Berita baru masuk dari Antara ("${pickedTitle.substring(0, 35)}...").`
    });
  },

  // Dual Mode: Live Admin vs Demo Sandbox
  dataMode: 'DEMO',
  setDataMode: (mode) => set({ dataMode: mode }),
  toggleDataMode: () =>
    set((state) => ({ dataMode: state.dataMode === 'DEMO' ? 'LIVE' : 'DEMO' })),

  // Time of Day: Day, Sunset, Night
  timeOfDay: 'DAY',
  setTimeOfDay: (time) => set({ timeOfDay: time }),
  cycleTimeOfDay: () =>
    set((state) => {
      const order: TimeOfDay[] = ['DAY', 'SUNSET', 'NIGHT'];
      const nextIdx = (order.indexOf(state.timeOfDay) + 1) % order.length;
      return { timeOfDay: order[nextIdx] };
    }),

  // Autonomous Pipeline
  isAutonomousMode: false,
  setAutonomousMode: (active) => set({ isAutonomousMode: active }),
  toggleAutonomousMode: () =>
    set((state) => ({ isAutonomousMode: !state.isAutonomousMode })),

  // Real-time Hologram Event & Incident Alert
  activeHologram: null,
  setActiveHologram: (event) => set({ activeHologram: event }),
  incidentAlert: { type: 'NONE', message: '', active: false },
  setIncidentAlert: (incident) => set({ incidentAlert: incident }),

  // Waterfall Countdown Timer (seconds)
  chronosCountdown: 875, // default 14 min 35 sec
  setChronosCountdown: (sec) => set({ chronosCountdown: sec }),

  // Article Reader Modal
  activeReaderArticle: null,
  openArticleReader: (article) => set({ activeReaderArticle: article }),
  closeArticleReader: () => set({ activeReaderArticle: null })
}));
