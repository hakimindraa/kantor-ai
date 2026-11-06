'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { officeStore } from '@/lib/officeStore';
import { OfficeEvent, OfficeAction } from '@/types/kantorAi';
import { soundManager } from '@/services/audio/soundManager';
import { X, Sparkles, ExternalLink } from 'lucide-react';

interface ActionMeta {
  emoji: string;
  label: string;
  badgeBg: string;
  badgeText: string;
  borderGlow: string;
  defaultBubble: (ev: OfficeEvent) => string;
}

const ACTION_METAS: Record<string, ActionMeta> = {
  draft_created: {
    emoji: '🕵️‍♂️',
    label: 'DRAFT CREATED',
    badgeBg: 'bg-sky-500/20',
    badgeText: 'text-sky-300',
    borderGlow: 'border-sky-500/50',
    defaultBubble: (ev) => `Breaking news masuk dari ${ev.source || 'portal media'}!`
  },
  cover_generated: {
    emoji: '📸',
    label: 'COVER GENERATED',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-300',
    borderGlow: 'border-rose-500/50',
    defaultBubble: () => 'Foto sampul ImgBB siap!'
  },
  article_published: {
    emoji: '🎉',
    label: 'ARTICLE PUBLISHED',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    borderGlow: 'border-emerald-500/50',
    defaultBubble: (ev) => `Hore! Berita resmi tayang: "${ev.title}"`
  },
  article_rewritten: {
    emoji: '🔗',
    label: 'ARTICLE REWRITTEN',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-300',
    borderGlow: 'border-purple-500/50',
    defaultBubble: (ev) => `Menyadur berita dari ${ev.source || 'tautan eksternal'}!`
  },
  ai_studio_generated: {
    emoji: '🪄',
    label: 'AI STUDIO GENERATED',
    badgeBg: 'bg-pink-500/20',
    badgeText: 'text-pink-300',
    borderGlow: 'border-pink-500/50',
    defaultBubble: (ev) => `Model ${ev.model || 'Gemini Flash'} selesai meracik naskah!`
  },
  author_created: {
    emoji: '👥',
    label: 'AUTHOR ONBOARDED',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-300',
    borderGlow: 'border-blue-500/50',
    defaultBubble: (ev) => `Selamat bergabung ${ev.author || 'Wartawan Baru'}!`
  },
  db_purged: {
    emoji: '🧹',
    label: 'DATABASE PURGED',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    borderGlow: 'border-amber-500/50',
    defaultBubble: () => 'Bzzzt! Database & temporary cache dibersihkan!'
  },
  bottele_rss_scraped: {
    emoji: '📡',
    label: 'RADAR RSS SCOUTED',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    borderGlow: 'border-emerald-500/50',
    defaultBubble: (ev) => `Radar ${ev.category || 'Berita'} menangkap breaking news dari ${ev.source || 'RSS Portal Media'}!`
  },
  bottele_dispatch_telegram: {
    emoji: '📱',
    label: 'TELEGRAM DISPATCH',
    badgeBg: 'bg-orange-500/20',
    badgeText: 'text-orange-300',
    borderGlow: 'border-orange-500/50',
    defaultBubble: (ev) => `Alert darurat dipancarkan ke grup Telegram redaksi: "${ev.title.substring(0, 36)}..."`
  },
  bottele_synced_adafakta: {
    emoji: '🛡️',
    label: 'SETOR KE ADAFAKTA',
    badgeBg: 'bg-teal-500/20',
    badgeText: 'text-teal-300',
    borderGlow: 'border-teal-500/50',
    defaultBubble: (ev) => `Berita terverifikasi ${ev.category || ''} sukses disetor ke Meja Redaksi adafakta.web.id!`
  }
};

export const OfficeEventBanner: React.FC = () => {
  const [currentEvent, setCurrentEvent] = useState<OfficeEvent | null>(null);
  const [showBlitz, setShowBlitz] = useState(false);

  useEffect(() => {
    const unsubscribe = officeStore.subscribe((event) => {
      setCurrentEvent(event);
      if (!event) return;

      // 1. Camera Blitz Flash Effect on cover_generated
      if (event.action === 'cover_generated') {
        setShowBlitz(true);
        soundManager.playCameraFlash();
        setTimeout(() => setShowBlitz(false), 350);
      }

      // 2. Confetti Explosion on article_published
      if (event.action === 'article_published') {
        soundManager.playPublishChime();
        try {
          confetti({
            particleCount: 75,
            spread: 80,
            origin: { y: 0.25 },
            colors: ['#10B981', '#34D399', '#F59E0B', '#38BDF8', '#FFFFFF']
          });
        } catch {
          // ignore confetti if canvas not available
        }
      }

      // 3. Audio Cues for other actions
      if (event.action === 'ai_studio_generated') {
        soundManager.playSciFiChime();
      } else if (event.action === 'bottele_dispatch_telegram') {
        soundManager.playTelegramPing();
      } else if (event.action === 'db_purged') {
        soundManager.playServerPulse();
      } else if (event.action !== 'cover_generated' && event.action !== 'article_published') {
        soundManager.playKeyboardClick();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const meta = currentEvent ? ACTION_METAS[currentEvent.action] || ACTION_METAS.draft_created : null;

  return (
    <>
      {/* 📸 FULLSCREEN CAMERA FLASH BLITZ OVERLAY */}
      {showBlitz && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-white/80 animate-out fade-out duration-300 transition-opacity" />
      )}

      {/* 🎭 FLOATING EVENT SPEECH BUBBLE & BANNER */}
      {currentEvent && meta && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-xl animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div
            className={`bg-[#0F1318]/95 backdrop-blur-md text-white border ${meta.borderGlow} shadow-2xl p-3.5 sm:p-4 rounded-xl flex items-start gap-3.5 ring-1 ring-white/10`}
          >
            {/* Animated Emoji Avatar */}
            <div className="w-11 h-11 shrink-0 rounded-lg bg-[#1E242C] border border-white/10 flex items-center justify-center text-2xl shadow-inner animate-bounce">
              {meta.emoji}
            </div>

            {/* Content Body */}
            <div className="flex-1 min-w-0 font-sans">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase ${meta.badgeBg} ${meta.badgeText} border border-current/20`}
                >
                  {meta.label}
                </span>

                {currentEvent.category && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-neutral-400 font-mono">
                    {currentEvent.category}
                  </span>
                )}

                <span className="text-[10px] text-neutral-400 font-mono ml-auto">
                  LIVE SIGNAL
                </span>
              </div>

              {/* Character Speech Bubble Quote */}
              <p className="text-xs sm:text-sm font-semibold text-neutral-100 italic leading-snug">
                &ldquo;{meta.defaultBubble(currentEvent)}&rdquo;
              </p>

              {/* Title & Metadata Details */}
              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-neutral-400 font-mono truncate">
                <span className="truncate text-white font-medium">
                  {currentEvent.title}
                </span>
                {currentEvent.source && (
                  <span className="shrink-0 text-neutral-400">• {currentEvent.source}</span>
                )}
                {currentEvent.author && (
                  <span className="shrink-0 text-sky-400">• By {currentEvent.author}</span>
                )}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setCurrentEvent(null)}
              className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              title="Tutup Notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

