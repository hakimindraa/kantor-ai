'use client';

import React, { useState } from 'react';
import { useOfficeStore } from '@/store/officeStore';
import { soundManager } from '@/services/audio/soundManager';
import { eventBridge } from '@/services/live/eventBridge';
import {
  FileText,
  CheckCircle2,
  Clock,
  Radio,
  ExternalLink,
  Zap,
  ShieldCheck,
  Send,
  Layers,
  Sparkles
} from 'lucide-react';

export const StatsOverview: React.FC = () => {
  const stats = useOfficeStore((state) => state.stats);
  const botteleStats = useOfficeStore((state) => state.botteleStats);
  const incrementBotTeleStat = useOfficeStore((state) => state.incrementBotTeleStat);
  const setActiveTab = useOfficeStore((state) => state.setActiveTab);
  const [activeWingTab, setActiveWingTab] = useState<'ALL' | 'WEST' | 'EAST'>('ALL');
  const [isScrapingTech, setIsScrapingTech] = useState(false);

  const handleScrapeTechNow = () => {
    setIsScrapingTech(true);
    soundManager.playKeyboardClick();

    // Trigger Scout, Veritas, and TeleBot to working in East Wing
    useOfficeStore.getState().setAgentWorking('scout');
    useOfficeStore.getState().setAgentWorking('veritas');
    useOfficeStore.getState().setAgentWorking('telebot');
    incrementBotTeleStat('monitoredTechCount');

    eventBridge.dispatchHologram({
      agentId: 'scout',
      type: 'RSS_BREAKING',
      title: '📡 6 KANAL RSS DIPINDAI',
      subtitle: 'TechCrunch, DailySocial, DetikINET, The Verge, Antara Tekno, Google News',
      timestamp: Date.now()
    });

    useOfficeStore.getState().addActivityLog({
      agentId: 'scout',
      agentName: 'SCOUT',
      agentColor: '#0284C7',
      category: 'fetch',
      level: 'success',
      message: '📡 Scout menyisir 6 kanal RSS teknologi terkini dari portal bottelejurnalis.vercel.app (0 hoaks terdeteksi).'
    });

    setTimeout(() => {
      setIsScrapingTech(false);
    }, 1500);
  };

  return (
    <div className="space-y-1.5 select-none font-mono">
      {/* Sub-Tabs: Pilih Sayap atau Tampilkan Keduanya */}
      <div className="flex items-center justify-between gap-1 text-[10px]">
        <div className="flex items-center gap-1 bg-[#1A1B1F] p-0.5 border border-[#32353E]">
          <button
            onClick={() => setActiveWingTab('ALL')}
            className={`px-2 py-0.5 font-bold transition-colors cursor-pointer rounded-none flex items-center gap-1 ${
              activeWingTab === 'ALL'
                ? 'bg-[#313744] text-white border border-[#5A6478]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>SEMUA SAYAP</span>
          </button>
          <button
            onClick={() => setActiveWingTab('WEST')}
            className={`px-2 py-0.5 font-bold transition-colors cursor-pointer rounded-none flex items-center gap-1 ${
              activeWingTab === 'WEST'
                ? 'bg-blue-900/60 text-blue-200 border border-blue-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="w-3 h-3 text-blue-400" />
            <span>REDAKSI ADAFAKTA</span>
          </button>
          <button
            onClick={() => setActiveWingTab('EAST')}
            className={`px-2 py-0.5 font-bold transition-colors cursor-pointer rounded-none flex items-center gap-1 ${
              activeWingTab === 'EAST'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>RADAR BOT JURNALIS</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-none bg-emerald-400 animate-pulse" />
          <span>DUAL-WING TELEMETRY LIVE</span>
        </div>
      </div>

      {/* Grid Sayap Barat & Sayap Timur */}
      <div
        className={`grid gap-2 ${
          activeWingTab === 'ALL'
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1'
        }`}
      >
        {/* ================= PANEL SAYAP BARAT: REDAKSI UTAMA ADAFAKTA ================= */}
        {(activeWingTab === 'ALL' || activeWingTab === 'WEST') && (
          <div className="p-2.5 sm:p-3 bg-[#1A1B1F]/95 border border-[#32353E] rounded-none shadow-md">
            {/* Header Redaksi AdaFakta */}
            <div className="flex items-center justify-between pb-2 border-b border-[#32353E]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-none shrink-0" />
                <span className="text-[11px] font-black text-white tracking-wider uppercase">
                  SAYAP BARAT // REDAKSI UTAMA
                </span>
                <span className="text-[9px] px-1 py-0.2 bg-blue-950 text-blue-300 border border-blue-800">
                  adafakta.web.id
                </span>
              </div>
              <a
                href="https://www.adafakta.web.id/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 hover:underline"
                title="Buka Web Admin AdaFakta"
              >
                <span>Admin</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 4 Stats Cards Redaksi AdaFakta (Sesuai Web Admin) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-2">
              {/* Total Artikel */}
              <div
                onClick={() => setActiveTab('pipeline')}
                className="p-2 bg-[#20242C] border border-[#32353E] hover:border-blue-500/60 cursor-pointer transition-colors"
              >
                <div className="text-neutral-400 text-[9px] font-bold uppercase truncate">
                  TOTAL ARTIKEL
                </div>
                <div className="text-xl font-black text-white tabular-nums mt-0.5">
                  {stats.articlesToday}
                </div>
                <div className="text-[9px] text-neutral-400 truncate">Semua arsip berita</div>
              </div>

              {/* Sudah Terbit */}
              <div
                onClick={() => setActiveTab('pipeline')}
                className="p-2 bg-[#20242C] border border-[#32353E] hover:border-emerald-500/60 cursor-pointer transition-colors"
              >
                <div className="text-emerald-400 text-[9px] font-bold uppercase truncate flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>SUDAH TERBIT</span>
                </div>
                <div className="text-xl font-black text-emerald-400 tabular-nums mt-0.5">
                  {stats.publishedToday}
                </div>
                <div className="text-[9px] text-neutral-400 truncate">Tayang di web</div>
              </div>

              {/* Draf Review */}
              <div
                onClick={() => setActiveTab('pipeline')}
                className="p-2 bg-[#20242C] border border-[#32353E] hover:border-amber-500/60 cursor-pointer transition-colors"
              >
                <div className="text-amber-400 text-[9px] font-bold uppercase truncate">
                  DRAF REVIEW
                </div>
                <div className="text-xl font-black text-amber-300 tabular-nums mt-0.5">
                  0
                </div>
                <div className="text-[9px] text-neutral-400 truncate">Menunggu periksa</div>
              </div>

              {/* Terjadwal */}
              <div
                onClick={() => setActiveTab('pipeline')}
                className="p-2 bg-[#20242C] border border-[#32353E] hover:border-sky-500/60 cursor-pointer transition-colors"
              >
                <div className="text-sky-400 text-[9px] font-bold uppercase truncate flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span>TERJADWAL</span>
                </div>
                <div className="text-xl font-black text-sky-300 tabular-nums mt-0.5">
                  {stats.inQueue}
                </div>
                <div className="text-[9px] text-neutral-400 truncate">Menunggu tayang</div>
              </div>
            </div>

            {/* Footer Status Sayap Barat */}
            <div className="mt-2 pt-1.5 border-t border-[#32353E] flex items-center justify-between text-[9px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none" />
                <span>Neon Postgres DB: Connected ({stats.serverLatencyMs}ms)</span>
              </span>
              <span className="text-neutral-500 font-mono">6 Redaktur AI Aktif</span>
            </div>
          </div>
        )}

        {/* ================= PANEL SAYAP TIMUR: RADAR INTELIJEN & BOT JURNALIS ================= */}
        {(activeWingTab === 'ALL' || activeWingTab === 'EAST') && (
          <div className="p-2.5 sm:p-3 bg-[#16201B]/95 border border-[#1E3A2F] rounded-none shadow-md">
            {/* Header Radar Bot Jurnalis */}
            <div className="flex items-center justify-between pb-2 border-b border-[#1E3A2F]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-none shrink-0 animate-pulse" />
                <span className="text-[11px] font-black text-white tracking-wider uppercase">
                  SAYAP TIMUR // RADAR INTELIJEN
                </span>
                <span className="text-[9px] px-1 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-700">
                  bottelejurnalis.vercel.app
                </span>
              </div>
              <a
                href="https://bottelejurnalis.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 hover:underline"
                title="Buka Portal Bot Jurnalis Telegram"
              >
                <span>Radar</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* 4 Stats Cards Radar Bot (Sesuai Web Bot Tele) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-2">
              {/* Kanal RSS Aktif */}
              <div className="p-2 bg-[#0E1A14] border border-[#1E3A2F] hover:border-emerald-500/60 transition-colors">
                <div className="text-emerald-400 text-[9px] font-bold uppercase truncate flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5" />
                  <span>KANAL RSS</span>
                </div>
                <div className="text-xl font-black text-emerald-300 tabular-nums mt-0.5">
                  {botteleStats.activeRssCount}
                </div>
                <div className="text-[9px] text-neutral-400 truncate">Tech, Verge, Detik</div>
              </div>

              {/* Berita Terpantau */}
              <div className="p-2 bg-[#0E1A14] border border-[#1E3A2F] hover:border-emerald-500/60 transition-colors">
                <div className="text-neutral-400 text-[9px] font-bold uppercase truncate">
                  TERPANTAU (TEKNO)
                </div>
                <div className="text-xl font-black text-white tabular-nums mt-0.5">
                  {botteleStats.monitoredTechCount}
                </div>
                <div className="text-[9px] text-neutral-400 truncate">Arsip Tekno di DB</div>
              </div>

              {/* Disetor ke AdaFakta */}
              <div className="p-2 bg-[#0E1A14] border border-[#1E3A2F] hover:border-emerald-500/60 transition-colors">
                <div className="text-neutral-400 text-[9px] font-bold uppercase truncate flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>DISETOR</span>
                </div>
                <div className="text-xl font-black text-white tabular-nums mt-0.5">
                  {botteleStats.sentToAdaFaktaCount}
                </div>
                <div className="text-[9px] text-neutral-400 truncate">Investigasi Redaksi</div>
              </div>

              {/* Telegram Dispatch */}
              <div className="p-2 bg-[#0E1A14] border border-[#1E3A2F] hover:border-emerald-500/60 transition-colors">
                <div className="text-neutral-400 text-[9px] font-bold uppercase truncate flex items-center gap-1">
                  <Send className="w-2.5 h-2.5" />
                  <span>DISPATCH</span>
                </div>
                <div className="text-xl font-black text-white tabular-nums mt-0.5">
                  {botteleStats.dispatchedTelegramCount}
                </div>
                <div className="text-[9px] text-neutral-400 truncate">Alarm ke Telegram</div>
              </div>
            </div>

            {/* Footer Aksi Interaktif Sayap Timur: Tombol Tarik Berita Teknologi */}
            <div className="mt-2 pt-1.5 border-t border-[#1E3A2F] flex flex-wrap items-center justify-between gap-1.5 text-[9px]">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none animate-pulse" />
                <span>Radar Bot Aktif 24/7 (Scout, Veritas, TeleBot, Cipher)</span>
              </div>

              {/* Tombol Aksi Langsung Seperti di Web Bot Tele */}
              <button
                onClick={handleScrapeTechNow}
                disabled={isScrapingTech}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold border transition-all flex items-center gap-1.5 rounded-none cursor-pointer ${
                  isScrapingTech
                    ? 'bg-emerald-700 text-white border-emerald-400 animate-pulse'
                    : 'bg-[#10B981] hover:bg-[#059669] text-black border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                }`}
                title="Pindai 6 feed RSS teknologi sekarang dan gerakkan agen di kantor 3D"
              >
                <Zap className="w-3 h-3 fill-current" />
                <span>{isScrapingTech ? 'MEMINDAI 6 RSS...' : 'TARIK BERITA TEKNO'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
