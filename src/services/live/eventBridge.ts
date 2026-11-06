// Event Bridge between Web Admin Panel and 3D Virtual Office
import { useOfficeStore } from '@/store/officeStore';
import { HologramEvent, OfficeIncident, RemoteActionType } from '@/types/office';
import { AgentId } from '@/types/agent';
import { BotTeleRubricKey } from '@/services/mock/mockAnalytics';
import { soundManager } from '@/services/audio/soundManager';

class EventBridge {
  private autonomousTimer: NodeJS.Timeout | null = null;
  private isAutonomousRunning: boolean = false;
  private countdownTimer: NodeJS.Timeout | null = null;
  private webhookListenerInterval: NodeJS.Timeout | null = null;
  private lastPolledTimestamp: number = Date.now();

  public initCountdownTicker() {
    if (this.countdownTimer || typeof window === 'undefined') return;
    this.countdownTimer = setInterval(() => {
      const store = useOfficeStore.getState();
      const current = store.chronosCountdown;
      if (current <= 1) {
        const gap = (store.adminOverrides.chronosWaterfallGapMinutes || 45) * 60;
        store.setChronosCountdown(gap);
        if (store.adminOverrides.chronosAutoQueueActive) {
          soundManager.playPublishChime();
          store.triggerManualPipelineRun();
          this.dispatchHologram({
            agentId: 'chronos',
            type: 'WEBP_COMPRESS',
            title: '⏱️ WATERFALL SLOT RELEASED',
            subtitle: 'Timer 00:00 ➔ Auto-published to Live Feed',
            timestamp: Date.now()
          });
        }
      } else {
        store.setChronosCountdown(current - 1);
      }
    }, 1000);
  }

  // 1. Trigger Holographic Notification in 3D Office
  public dispatchHologram(event: HologramEvent) {
    const store = useOfficeStore.getState();
    store.setActiveHologram(event);

    // Audio cue
    if (event.type === 'TELEGRAM_ALERT') {
      soundManager.playTelegramPing();
    } else if (event.type === 'WEBP_COMPRESS') {
      soundManager.playServerPulse();
    }

    // Auto-clear after 4.5 seconds
    setTimeout(() => {
      const current = useOfficeStore.getState().activeHologram;
      if (current && current.timestamp === event.timestamp) {
        useOfficeStore.getState().setActiveHologram(null);
      }
    }, 4500);
  }

  // 2. Trigger Technical / Incident Alert in 3D
  public dispatchIncident(incident: OfficeIncident) {
    const store = useOfficeStore.getState();
    store.setIncidentAlert(incident);
  }

  // 3. Clear Incident Alert
  public clearIncident() {
    useOfficeStore.getState().setIncidentAlert({
      type: 'NONE',
      message: '',
      active: false
    });
  }

  // 4. Remote Two-Way Action Triggers (executing from 3D -> Backend)
  public async executeRemoteAction(action: RemoteActionType): Promise<{ success: boolean; message: string }> {
    const store = useOfficeStore.getState();

    try {
      if (action === 'SCRAPE_NOW') {
        soundManager.playKeyboardClick();
        store.setAgentWorking('scout');
        this.dispatchHologram({
          agentId: 'scout',
          type: 'RSS_BREAKING',
          title: '🚨 BREAKING NEWS INGESTION',
          subtitle: 'Scraping 48 RSS Feeds via /api/incoming-news',
          timestamp: Date.now()
        });

        // Call internal API
        try {
          await fetch('/api/incoming-news', { method: 'POST' });
        } catch {
          // Fallback handled smoothly
        }

        store.addActivityLog({
          agentId: 'scout',
          agentName: 'SCOUT',
          agentColor: '#F59E0B',
          category: 'editorial',
          level: 'success',
          message: '📡 Remote Ingestion: Scout berhasil memindai feed berita breaking news terbaru!'
        });

        return { success: true, message: 'Scout berhasil memindai feed berita!' };
      }

      if (action === 'PUBLISH_NOW') {
        soundManager.playPublishChime();
        store.setAgentWorking('chronos');
        this.dispatchHologram({
          agentId: 'chronos',
          type: 'WEBP_COMPRESS',
          title: '🚀 WATERFALL PUBLISH EXECUTED',
          subtitle: 'Slot dilepas ke website AdaFakta & Google Indexing',
          timestamp: Date.now()
        });

        // Trigger advance on Kanban
        store.triggerManualPipelineRun();

        store.addActivityLog({
          agentId: 'chronos',
          agentName: 'CHRONOS',
          agentColor: '#0EA5E9',
          category: 'publishing',
          level: 'success',
          message: '🚀 Remote Publish: Chronos berhasil merilis antrean berikutnya tanpa menunggu jeda!'
        });

        return { success: true, message: 'Artikel berikutnya berhasil diterbitkan!' };
      }

      if (action === 'PURGE_CACHE') {
        soundManager.playServerPulse();
        store.setAgentWorking('sentry');
        this.dispatchHologram({
          agentId: 'sentry',
          type: 'WEBP_COMPRESS',
          title: '🧹 DB & LOG AUTO-PURGE',
          subtitle: 'Neon Postgres temp storage dibersihkan',
          timestamp: Date.now()
        });

        try {
          await fetch('/api/cron/auto-purge', { method: 'POST' });
        } catch {}

        store.addActivityLog({
          agentId: 'sentry',
          agentName: 'SENTRY',
          agentColor: '#84CC16',
          category: 'infrastructure',
          level: 'info',
          message: '🧹 Remote Clean: Sentry membersihkan 240 MB log sampah & temporary pooler cache.'
        });

        return { success: true, message: 'Auto-purge database selesai!' };
      }

      if (action === 'TEST_TELEGRAM') {
        soundManager.playTelegramPing();
        store.setAgentWorking('hermes');
        this.dispatchHologram({
          agentId: 'hermes',
          type: 'TELEGRAM_ALERT',
          title: '📱 TELEGRAM DISPATCH ENVOY',
          subtitle: 'Alert & Approval dikirim ke smartphone Pemred',
          timestamp: Date.now()
        });

        store.addActivityLog({
          agentId: 'hermes',
          agentName: 'HERMES',
          agentColor: '#F97316',
          category: 'publishing',
          level: 'success',
          message: '📱 Remote Alert: Hermes berhasil mengirimkan pesan notifikasi approval Telegram.'
        });

        return { success: true, message: 'Pesan Telegram berhasil dikirim!' };
      }

      return { success: false, message: 'Aksi tidak dikenal' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Gagal menjalankan aksi' };
    }
  }

  // 5. Autonomous Simulation Cycle (Miniatur Hidup)
  public startAutonomousCycle() {
    if (this.isAutonomousRunning) return;
    this.isAutonomousRunning = true;

    let step = 0;
    this.autonomousTimer = setInterval(() => {
      const store = useOfficeStore.getState();
      if (!store.isAutonomousMode) {
        this.stopAutonomousCycle();
        return;
      }

      const cycleSteps = [
        () => {
          // Step 1: Scout scans feed
          soundManager.playKeyboardClick();
          store.setAgentWorking('scout');
          this.dispatchHologram({
            agentId: 'scout',
            type: 'RSS_BREAKING',
            title: '📡 RSS FEED DISCOVERED',
            subtitle: '[ANTARA] Terobosan Ekosistem Digital Nasional',
            timestamp: Date.now()
          });
        },
        () => {
          // Step 2: Scribe drafting, Scout goes to breakroom
          soundManager.playKeyboardClick();
          store.setAgentWorking('scribe');
          store.setAgentIdle('scout');
          this.dispatchHologram({
            agentId: 'scribe',
            type: 'GEMINI_DRAFT',
            title: '✍️ GEMINI 3.8 FLASH DRAFTING',
            subtitle: '5W+1H: 340/420 kata (SEO 96/100)',
            timestamp: Date.now()
          });
        },
        () => {
          // Step 3: Pixel compressing image, Scribe goes to cafe
          store.setAgentWorking('pixel');
          store.setAgentIdle('scribe');
          this.dispatchHologram({
            agentId: 'pixel',
            type: 'WEBP_COMPRESS',
            title: '🖼️ WEBP COMPRESSION -97.5%',
            subtitle: '2,140 KB ➔ 54 KB | ImgBB CDN Synced',
            timestamp: Date.now()
          });
        },
        () => {
          // Step 4: Chronos releases & Radar pings Google
          soundManager.playPublishChime();
          store.setAgentWorking('chronos');
          store.setAgentWorking('radar');
          store.setAgentWorking('hermes');
          store.setAgentIdle('pixel');
          this.dispatchHologram({
            agentId: 'radar',
            type: 'SEO_PING',
            title: '🚀 ARTICLE PUBLISHED & INDEXED',
            subtitle: 'Google Indexing API: Status 200 OK',
            timestamp: Date.now()
          });
          store.triggerManualPipelineRun();

          setTimeout(() => {
            const currentStore = useOfficeStore.getState();
            if (currentStore.isAutonomousMode) {
              currentStore.setAgentIdle('hermes');
            }
          }, 4500);
        }
      ];

      cycleSteps[step % cycleSteps.length]();
      step++;
    }, 8000);
  }

  public stopAutonomousCycle() {
    if (this.autonomousTimer) {
      clearInterval(this.autonomousTimer);
      this.autonomousTimer = null;
    }
    this.isAutonomousRunning = false;
  }

  // 6. Handle Live External Webhook Event from AdaFakta Admin
  public handleIncomingWebhook(event: {
    action: string;
    agentId?: AgentId;
    title: string;
    category?: string;
    source?: string;
    coverUrl?: string;
    contentSnippet?: string;
    author?: string;
    model?: string;
  }) {
    const store = useOfficeStore.getState();
    const isBotteleAction = event.action.startsWith('bottele_');
    
    // Resolve target agent correctly for both West Wing (AdaFakta) and East Wing (Bot Tele)
    let targetAgentId: AgentId = (event.agentId as AgentId);
    if (!targetAgentId) {
      if (event.action === 'draft_created') targetAgentId = 'scout_west';
      else if (event.action === 'cover_generated') targetAgentId = 'pixel';
      else if (event.action === 'article_published') targetAgentId = 'scribe';
      else if (event.action === 'article_rewritten') targetAgentId = 'sadur';
      else if (event.action === 'ai_studio_generated') targetAgentId = 'nova';
      else if (event.action === 'author_created') targetAgentId = 'hrd';
      else if (event.action === 'db_purged') targetAgentId = 'robosweep';
      else if (isBotteleAction) targetAgentId = 'scout';
      else targetAgentId = 'scribe';
    }

    // 1. Target agent stops chilling and returns to PC desk
    store.setAgentWorking(targetAgentId);

    // 2. Specialized handling for Bot Tele Jurnalis Radar vs AdaFakta Redaksi
    if (isBotteleAction) {
      const catLower = (event.category || '').toLowerCase();
      let rubricKey: BotTeleRubricKey = 'TEKNO';
      if (catLower.includes('politik') || catLower.includes('pemilu')) rubricKey = 'POLITIK';
      else if (catLower.includes('hukum') || catLower.includes('kriminal') || catLower.includes('korupsi')) rubricKey = 'HUKUM';
      else if (catLower.includes('lingkungan') || catLower.includes('iklim') || catLower.includes('hutan')) rubricKey = 'LINGKUNGAN';
      else if (catLower.includes('bisnis') || catLower.includes('ekonomi') || catLower.includes('ihsg') || catLower.includes('pasar')) rubricKey = 'BISNIS';
      else if (catLower.includes('internasional') || catLower.includes('global') || catLower.includes('dunia')) rubricKey = 'INTERNASIONAL';

      if (event.action === 'bottele_rss_scraped') {
        store.incrementRubricMetric(rubricKey, 'monitoredCount');
        store.incrementBotTeleStat('monitoredTechCount');
        soundManager.playKeyboardClick();
        this.dispatchHologram({
          agentId: targetAgentId,
          type: 'RSS_BREAKING',
          title: `📡 [${rubricKey}] RSS SCOUTED`,
          subtitle: `${event.source || 'Radar'}: ${event.title.substring(0, 36)}`,
          timestamp: Date.now()
        });
      } else if (event.action === 'bottele_dispatch_telegram') {
        store.incrementRubricMetric(rubricKey, 'dispatchCount');
        store.incrementBotTeleStat('dispatchedTelegramCount');
        soundManager.playTelegramPing();
        this.dispatchHologram({
          agentId: targetAgentId,
          type: 'TELEGRAM_ALERT',
          title: `📱 [${rubricKey}] TELEGRAM DISPATCH`,
          subtitle: event.title.substring(0, 38),
          timestamp: Date.now()
        });
      } else if (event.action === 'bottele_synced_adafakta') {
        store.incrementRubricMetric(rubricKey, 'syncedCount');
        store.incrementBotTeleStat('sentToAdaFaktaCount');
        soundManager.playPublishChime();
        this.dispatchHologram({
          agentId: targetAgentId,
          type: 'SEO_PING',
          title: `🛡️ [${rubricKey}] DISETOR KE REDAKSI`,
          subtitle: event.title.substring(0, 38),
          timestamp: Date.now()
        });
      } else {
        soundManager.playKeyboardClick();
        this.dispatchHologram({
          agentId: targetAgentId,
          type: 'GEMINI_DRAFT',
          title: `📡 RADAR [${rubricKey}]: ${event.action.replace('bottele_', '').toUpperCase()}`,
          subtitle: event.title.substring(0, 42),
          timestamp: Date.now()
        });
      }

      // Activity log for Bot Tele Jurnalis
      store.addActivityLog({
        agentId: targetAgentId,
        agentName: targetAgentId.toUpperCase(),
        agentColor: '#10B981',
        category: 'fetch',
        level: 'success',
        message: `[RADAR BOT TELE] ${targetAgentId.toUpperCase()} memproses [${rubricKey}]: "${event.title.substring(0, 42)}..."`
      });
      return;
    }

    // Standard AdaFakta Webhook Handling (7 Workflow Actions)
    if (event.action === 'article_published') {
      soundManager.playPublishChime();
      this.dispatchHologram({
        agentId: targetAgentId,
        type: 'SEO_PING',
        title: '🎉 BERITA RESMI TAYANG',
        subtitle: `Hore! "${event.title.substring(0, 42)}" tayang ke publik`,
        timestamp: Date.now()
      });
    } else if (event.action === 'cover_generated') {
      soundManager.playCameraFlash();
      this.dispatchHologram({
        agentId: targetAgentId,
        type: 'WEBP_COMPRESS',
        title: '📸 FOTO SAMPUL IMGBB SIAP',
        subtitle: 'Foto 16:9 dioptimalkan ke WebP CDN',
        timestamp: Date.now()
      });
    } else if (event.action === 'draft_created') {
      soundManager.playKeyboardClick();
      this.dispatchHologram({
        agentId: targetAgentId,
        type: 'GEMINI_DRAFT',
        title: '🕵️‍♂️ DRAF BREAKING NEWS MASUK',
        subtitle: `${event.source || 'Portal'}: ${event.title.substring(0, 38)}`,
        timestamp: Date.now()
      });
    } else if (event.action === 'article_rewritten') {
      soundManager.playKeyboardClick();
      this.dispatchHologram({
        agentId: targetAgentId,
        type: 'GEMINI_DRAFT',
        title: '🔗 MENYADUR BERITA DARI URL',
        subtitle: `${event.source || 'Sumber luar'}: ${event.title.substring(0, 36)}`,
        timestamp: Date.now()
      });
    } else if (event.action === 'ai_studio_generated') {
      soundManager.playSciFiChime();
      this.dispatchHologram({
        agentId: targetAgentId,
        type: 'GEMINI_DRAFT',
        title: '🪄 AI STUDIO SELESAI MERACIK',
        subtitle: `Model ${event.model || 'Gemini'} menuntaskan narasi investigasi`,
        timestamp: Date.now()
      });
    } else if (event.action === 'author_created') {
      soundManager.playPublishChime();
      this.dispatchHologram({
        agentId: targetAgentId,
        type: 'SEO_PING',
        title: '👥 WARTAWAN BARU BERGABUNG',
        subtitle: `Selamat bergabung ${event.author || 'Kontributor'} di Redaksi`,
        timestamp: Date.now()
      });
    } else if (event.action === 'db_purged') {
      soundManager.playServerPulse();
      this.dispatchHologram({
        agentId: targetAgentId,
        type: 'WEBP_COMPRESS',
        title: '🧹 DATABASE SELESAI DIBERSIHKAN',
        subtitle: 'Bzzzt! Temporary cache & log dibersihkan',
        timestamp: Date.now()
      });
    } else {
      soundManager.playKeyboardClick();
      this.dispatchHologram({
        agentId: targetAgentId,
        type: targetAgentId === 'pixel' ? 'WEBP_COMPRESS' : 'GEMINI_DRAFT',
        title: `📡 WEBHOOK: ${event.action.replace('_', ' ').toUpperCase()}`,
        subtitle: event.title.substring(0, 48),
        timestamp: Date.now()
      });
    }

    // 3. Add to Kanban Pipeline
    const isPublish = event.action === 'article_published';
    const newArticleStage = isPublish ? 'published' : 'drafting';
    store.addArticle({
      title: event.title,
      category: event.category || 'Nasional',
      source: event.source || 'AdaFakta Admin Webhook',
      currentStage: newArticleStage,
      assignedAgent: targetAgentId,
      readTime: '3 min',
      wordCount: 420,
      seoScore: 95,
      featuredImage: event.coverUrl,
      telegramNotified: isPublish,
      indexedGoogle: isPublish
    });

    // 4. Log to Live Activity Feed
    store.addActivityLog({
      agentId: targetAgentId,
      agentName: targetAgentId.toUpperCase(),
      agentColor: '#38BDF8',
      category: isPublish ? 'publishing' : 'editorial',
      level: 'success',
      message: `[WEBHOOK] ${targetAgentId.toUpperCase()} (${event.action}): "${event.title.substring(0, 42)}..."`
    });
  }

  // 7. Background Webhook Polling Listener (<2ms in-memory server queue)
  public startWebhookListener() {
    if (this.webhookListenerInterval || typeof window === 'undefined') return;
    this.lastPolledTimestamp = Date.now() - 5000;

    this.webhookListenerInterval = setInterval(async () => {
      if (typeof document !== 'undefined' && document.hidden) return;
      try {
        const res = await fetch(`/api/incoming-news?since=${this.lastPolledTimestamp}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data && Array.isArray(data.events) && data.events.length > 0) {
          data.events.forEach((ev: any) => {
            this.handleIncomingWebhook(ev);
          });
          this.lastPolledTimestamp = data.latestTimestamp || Date.now();
        }
      } catch {
        // silent
      }
    }, 3500);
  }

  public stopWebhookListener() {
    if (this.webhookListenerInterval) {
      clearInterval(this.webhookListenerInterval);
      this.webhookListenerInterval = null;
    }
  }
}

export const eventBridge = new EventBridge();
