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
  Sparkles,
  Power,
  RotateCw
} from 'lucide-react';
import { BotTeleRubricKey } from '@/services/mock/mockAnalytics';

export const StatsOverview: React.FC = () => {
  const stats = useOfficeStore((state) => state.stats);
  const botteleStats = useOfficeStore((state) => state.botteleStats);
  const setSelectedRubric = useOfficeStore((state) => state.setSelectedRubric);
  const toggleRadarPower247 = useOfficeStore((state) => state.toggleRadarPower247);
  const incrementRubricMetric = useOfficeStore((state) => state.incrementRubricMetric);
  const setActiveTab = useOfficeStore((state) => state.setActiveTab);
  const [activeWingTab, setActiveWingTab] = useState<'ALL' | 'WEST' | 'EAST'>('ALL');
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [isFairDistributing, setIsFairDistributing] = useState(false);

  const currentRubricKey = botteleStats.selectedRubric || 'ALL';
  const currentRubric = botteleStats.rubrics?.[currentRubricKey] || botteleStats.rubrics?.ALL;

  const handleScrapeRubric = (rubricKey: BotTeleRubricKey) => {
    setIsScrapingActive(true);
    soundManager.playKeyboardClick();

    const rubric = botteleStats.rubrics[rubricKey];
    const targetAgent = rubric ? rubric.assignedAgentId : 'scout';

    useOfficeStore.getState().setAgentWorking(targetAgent);
    incrementRubricMetric(rubricKey, 'monitoredCount');

    eventBridge.dispatchHologram({
      agentId: targetAgent,
      type: 'RSS_BREAKING',
      title: `📡 RSS: ${rubric.label.toUpperCase()}`,
      subtitle: `Menyisir ${rubric.rssCount} Feed: ${rubric.feeds.slice(0, 3).join(', ')}...`,
      timestamp: Date.now()
    });

    useOfficeStore.getState().addActivityLog({
      agentId: targetAgent,
      agentName: rubric.agentName,
      agentColor: rubric.color,
      category: 'fetch',
      level: 'success',
      message: `📡 ${rubric.agentName} menyisir kawat berita ${rubric.label} (${rubric.feeds.length} feed aktif).`
    });

    setTimeout(() => {
      setIsScrapingActive(false);
    }, 1400);
  };

  const handleFairCategoryDistribution = () => {
    setIsFairDistributing(true);
    soundManager.playPublishChime();

    // Trigger TeleBot first
    useOfficeStore.getState().setAgentWorking('telebot');

    eventBridge.dispatchHologram({
      agentId: 'telebot',
      type: 'SEO_PING',
      title: '⚖️ FAIR CATEGORY DISTRIBUTION',
      subtitle: 'SQL Window PARTITION BY category: 1 Berita Segar per Rubrik',
      timestamp: Date.now()
    });

    // Staggered activation of 6 rubric agents
    const rubricKeys: BotTeleRubricKey[] = ['TEKNO', 'POLITIK', 'HUKUM', 'LINGKUNGAN', 'BISNIS', 'INTERNASIONAL'];
    rubricKeys.forEach((key, idx) => {
      setTimeout(() => {
        const rub = botteleStats.rubrics[key];
        useOfficeStore.getState().setAgentWorking(rub.assignedAgentId);
        incrementRubricMetric(key, 'monitoredCount');
        incrementRubricMetric(key, 'syncedCount');
      }, (idx + 1) * 350);
    });

    setTimeout(() => {
      setIsFairDistributing(false);
    }, 2800);
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
          <div className="p-2.5 sm:p-3 bg-[#16201B]/95 border border-[#1E3A2F] rounded-none shadow-md space-y-2">
            {/* Header Radar Bot Jurnalis */}
            <div className="flex items-center justify-between pb-1.5 border-b border-[#1E3A2F]">
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
                <span>Radar Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Rubric Ribbon Selector (7 Kategori Berita Sesuai Web Bot Tele) */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[9px] scrollbar-thin">
              {(['ALL', 'TEKNO', 'POLITIK', 'HUKUM', 'LINGKUNGAN', 'BISNIS', 'INTERNASIONAL'] as BotTeleRubricKey[]).map(
                (rubricKey) => {
                  const rub = botteleStats.rubrics?.[rubricKey];
                  const isSelected = currentRubricKey === rubricKey;
                  return (
                    <button
                      key={rubricKey}
                      onClick={() => setSelectedRubric(rubricKey)}
                      className={`px-2 py-0.5 font-bold uppercase transition-all rounded-none cursor-pointer whitespace-nowrap border shrink-0 flex items-center gap-1 ${
                        isSelected
                          ? 'bg-emerald-500 text-black border-emerald-300 font-black shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                          : 'bg-[#0E1A14] text-neutral-300 border-[#1E3A2F] hover:text-white hover:border-emerald-600'
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-none"
                        style={{ backgroundColor: isSelected ? '#000000' : rub?.color || '#10B981' }}
                      />
                      <span>{rubricKey}</span>
                    </button>
                  );
                }
              )}
            </div>

            {/* Rubric Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-1 text-[9px] px-2 py-1 bg-[#0E1A14] border border-[#1E3A2F]">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleRadarPower247}
                  className={`flex items-center gap-1 px-1.5 py-0.2 border transition-colors cursor-pointer ${
                    botteleStats.radarActive247
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-700'
                  }`}
                  title="Saklar Radar 24/7 (Klik untuk jeda/aktifkan)"
                >
                  <Power className="w-2.5 h-2.5" />
                  <span>{botteleStats.radarActive247 ? 'RADAR AKTIF 24/7' : 'RADAR DIJEDA'}</span>
                </button>
                <span className="text-neutral-500">|</span>
                <span className="text-neutral-400">Freshness: 30m ➔ 24j (Bertahap)</span>
              </div>

              <div className="flex items-center gap-1 text-neutral-300">
                <span>Analis:</span>
                <span
                  className="font-bold uppercase px-1 py-0.2 border text-[9px]"
                  style={{
                    color: currentRubric?.color || '#10B981',
                    borderColor: `${currentRubric?.color || '#10B981'}40`,
                    backgroundColor: `${currentRubric?.color || '#10B981'}15`
                  }}
                >
                  {currentRubric?.agentName || 'TELEBOT'}
                </span>
              </div>
            </div>

            {/* 4 Stats Cards Reaktif (Menyesuaikan dengan Rubrik yang Dipilih) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {/* Kanal RSS Aktif */}
              <div className="p-2 bg-[#0E1A14] border border-[#1E3A2F] hover:border-emerald-500/60 transition-colors">
                <div className="text-emerald-400 text-[9px] font-bold uppercase truncate flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5" />
                  <span>KANAL RSS</span>
                </div>
                <div className="text-xl font-black text-emerald-300 tabular-nums mt-0.5">
                  {currentRubric?.rssCount || 6}
                </div>
                <div className="text-[9px] text-neutral-400 truncate">
                  {currentRubric?.feeds?.[0] || 'Feed Aktif'}
                </div>
              </div>

              {/* Berita Terpantau */}
              <div className="p-2 bg-[#0E1A14] border border-[#1E3A2F] hover:border-emerald-500/60 transition-colors">
                <div className="text-neutral-400 text-[9px] font-bold uppercase truncate">
                  TERPANTAU ({currentRubricKey})
                </div>
                <div className="text-xl font-black text-white tabular-nums mt-0.5">
                  {currentRubric?.monitoredCount || 0}
                </div>
                <div className="text-[9px] text-neutral-400 truncate">Arsip di Database</div>
              </div>

              {/* Disetor ke AdaFakta */}
              <div className="p-2 bg-[#0E1A14] border border-[#1E3A2F] hover:border-emerald-500/60 transition-colors">
                <div className="text-neutral-400 text-[9px] font-bold uppercase truncate flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>DISETOR</span>
                </div>
                <div className="text-xl font-black text-white tabular-nums mt-0.5">
                  {currentRubric?.syncedCount || 0}
                </div>
                <div className="text-[9px] text-neutral-400 truncate">Ke Meja Redaksi</div>
              </div>

              {/* Telegram Dispatch */}
              <div className="p-2 bg-[#0E1A14] border border-[#1E3A2F] hover:border-emerald-500/60 transition-colors">
                <div className="text-neutral-400 text-[9px] font-bold uppercase truncate flex items-center gap-1">
                  <Send className="w-2.5 h-2.5" />
                  <span>DISPATCH</span>
                </div>
                <div className="text-xl font-black text-white tabular-nums mt-0.5">
                  {currentRubric?.dispatchCount || 0}
                </div>
                <div className="text-[9px] text-neutral-400 truncate">Alarm ke Telegram</div>
              </div>
            </div>

            {/* Footer Aksi Interaktif Sayap Timur */}
            <div className="pt-1.5 border-t border-[#1E3A2F] flex flex-wrap items-center justify-between gap-1.5 text-[9px]">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none animate-pulse" />
                <span>
                  Rubrik: <strong className="text-white">{currentRubric?.label}</strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Tombol Fair Category Distribution */}
                <button
                  onClick={handleFairCategoryDistribution}
                  disabled={isFairDistributing}
                  className={`px-2 py-1 text-[9px] font-mono font-bold border transition-all flex items-center gap-1 rounded-none cursor-pointer ${
                    isFairDistributing
                      ? 'bg-purple-900 text-purple-200 border-purple-500 animate-pulse'
                      : 'bg-[#181824] hover:bg-[#232338] text-purple-300 border-purple-700'
                  }`}
                  title="Ambil 1 berita dari setiap 6 rubrik secara adil via SQL Window PARTITION"
                >
                  <RotateCw className={`w-2.5 h-2.5 ${isFairDistributing ? 'animate-spin' : ''}`} />
                  <span>FAIR 6 RUBRIK</span>
                </button>

                {/* Tombol Tarik Rubrik Spesifik */}
                <button
                  onClick={() => handleScrapeRubric(currentRubricKey)}
                  disabled={isScrapingActive}
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold border transition-all flex items-center gap-1.5 rounded-none cursor-pointer ${
                    isScrapingActive
                      ? 'bg-emerald-700 text-white border-emerald-400 animate-pulse'
                      : 'bg-[#10B981] hover:bg-[#059669] text-black border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  }`}
                  title={`Pindai RSS untuk rubrik ${currentRubricKey} dan aktifkan ${currentRubric?.agentName} di kantor 3D`}
                >
                  <Zap className="w-3 h-3 fill-current" />
                  <span>{isScrapingActive ? 'MEMINDAI...' : `TARIK ${currentRubricKey}`}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
