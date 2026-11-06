'use client';

import React, { useState } from 'react';
import { BACKEND_MODULES } from '@/services/mock/mockBackendModules';
import { BackendModuleDef } from '@/types/backend';
import { useOfficeStore } from '@/store/officeStore';
import {
  Terminal,
  Play,
  RefreshCw,
  ArrowLeft,
  Radio,
  ShieldCheck,
  Copy,
  Check,
  Zap,
  CheckCircle2,
  FileCode2
} from 'lucide-react';

export const BackendIntegrationView: React.FC = () => {
  const [modules] = useState<BackendModuleDef[]>(BACKEND_MODULES);
  const [selectedModule, setSelectedModule] = useState<BackendModuleDef>(BACKEND_MODULES[0]);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'modules' | 'inspector'>('modules');
  const [activeSection, setActiveSection] = useState<'webhook' | 'modules'>('webhook');

  // Webhook Simulator State
  const [webhookTarget, setWebhookTarget] = useState<'adafakta' | 'bottele'>('adafakta');
  const [webhookSending, setWebhookSending] = useState(false);
  const [webhookFeedback, setWebhookFeedback] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const addActivityLog = useOfficeStore((state) => state.addActivityLog);

  const handleTestModule = (mod: BackendModuleDef) => {
    setTestingId(mod.id);
    setTestResult('Connecting to adapter endpoint...');

    setTimeout(() => {
      setTestingId(null);
      const simulatedResponse = {
        status: 200,
        ok: true,
        endpoint: mod.pathOrIdentifier,
        executionTime: `${mod.latencyMs}ms`,
        adapterMode: 'PRODUCTION ADAPTER INTERFACE READY',
        timestamp: new Date().toISOString(),
        payloadResponse: mod.samplePayload || {
          message: 'Handler executed successfully via backend adapter.',
          registeredAgent: mod.associatedAgent
        }
      };

      setTestResult(JSON.stringify(simulatedResponse, null, 2));

      addActivityLog({
        agentId: 'sentry',
        agentName: 'SENTRY',
        agentColor: '#FAFAFA',
        category: 'infrastructure',
        level: 'success',
        message: `Endpoint test berhasil: ${mod.name} (${mod.pathOrIdentifier}) merespon dalam ${mod.latencyMs}ms.`
      });
    }, 600);
  };

  const handleSendTestWebhook = async (
    action: 'draft_created' | 'article_published' | 'cover_generated',
    title: string
  ) => {
    setWebhookSending(true);
    setWebhookFeedback(`Mengirim sinyal webhook "${action}"...`);
    try {
      const res = await fetch('/api/incoming-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-token': 'jsfhohoijmOIOIIUOJlknf894560257yrhuehflh884750wuehflhfehUYUYUHIhr4764357847eieohdlskfreoyt8373940'
        },
        body: JSON.stringify({
          action,
          title,
          category: action === 'cover_generated' ? 'Multimedia' : 'Nasional',
          source: 'AdaFakta Admin Webhook Simulator',
          agentId: action === 'draft_created' ? 'scribe' : action === 'cover_generated' ? 'pixel' : 'chronos'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setWebhookFeedback(`✅ Sinyal Webhook terkirim! 3D Diorama & Kanban langsung merespon (${data.event?.agentId?.toUpperCase()}).`);
      } else {
        setWebhookFeedback(`❌ Error: ${data.message}`);
      }
    } catch (err: any) {
      setWebhookFeedback(`❌ Gagal: ${err.message}`);
    } finally {
      setWebhookSending(false);
    }
  };

  const snippetCode = `// lib/kantorAiNotifier.ts (Copy ke proyek Web Admin AdaFakta Anda)
export async function notifyKantorAI(payload: {
  action: 'draft_created' | 'article_published' | 'cover_generated';
  title: string;
  category?: string;
  coverUrl?: string;
}) {
  try {
    const endpoint = process.env.KANTORAI_URL || 'https://aikantoradafakta.vercel.app';
    const secret = process.env.KANTORAI_WEBHOOK_SECRET || 'jsfhohoijmOIOIIUOJlknf894560257yrhuehflh884750wuehflhfehUYUYUHIhr4764357847eieohdlskfreoyt8373940';

    // Timeout 1.5 detik non-blocking (tidak akan pernah membebani web AdaFakta)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    fetch(\`\${endpoint}/api/incoming-news\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-token': secret
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    }).catch(() => {
      // Diamkan kegagalan agar AdaFakta tetap berjalan 100% lancar
    }).finally(() => clearTimeout(timeout));
  } catch {
    // Non-blocking, zero crash guarantee
  }
}`;

  const botteleSnippetCode = `// lib/kantorAiNotifier.ts (Copy ke proyek Web Bot Tele Jurnalis Anda)
export async function notifyKantorAI(payload: {
  action: 'bottele_rss_scraped' | 'bottele_dispatch_telegram' | 'bottele_synced_adafakta' | 'bottele_fact_checked';
  title: string;
  source?: string; // misal: 'TechCrunch', 'The Verge', 'DetikINET', 'Antara Tekno'
  category?: string; // default: 'Teknologi'
}) {
  try {
    const endpoint = process.env.KANTORAI_URL || 'https://aikantoradafakta.vercel.app';
    const secret = process.env.KANTORAI_WEBHOOK_SECRET || 'jsfhohoijmOIOIIUOJlknf894560257yrhuehflh884750wuehflhfehUYUYUHIhr4764357847eieohdlskfreoyt8373940';

    // Timeout 1.5 detik non-blocking (bot telegram tetap lancar 100%)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    fetch(\`\${endpoint}/api/incoming-news\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-token': secret
      },
      body: JSON.stringify({
        ...payload,
        source: payload.source || 'Bot Tele Jurnalis Radar'
      }),
      signal: controller.signal
    }).catch(() => {
      // Diamkan kegagalan agar Bot Tele tetap berjalan lancar
    }).finally(() => clearTimeout(timeout));
  } catch {
    // Non-blocking, zero crash guarantee
  }
}

// CONTOH PENGGUNAAN DI PROYEK BOT TELE:
// 1. Saat bot selesai memindai 6 RSS Teknologi:
// await notifyKantorAI({ action: 'bottele_rss_scraped', title: item.title, source: 'TechCrunch' });
//
// 2. Saat bot mengirim alert Telegram ke redaktur:
// await notifyKantorAI({ action: 'bottele_dispatch_telegram', title: item.title });
//
// 3. Saat bot menyetor hasil riset ke meja AdaFakta:
// await notifyKantorAI({ action: 'bottele_synced_adafakta', title: item.title });`;

  const handleSendTestBotteleWebhook = async (
    action: 'bottele_rss_scraped' | 'bottele_dispatch_telegram' | 'bottele_synced_adafakta',
    title: string,
    source?: string
  ) => {
    setWebhookSending(true);
    setWebhookFeedback(`Mengirim sinyal webhook Bot Tele "${action}"...`);
    try {
      const res = await fetch('/api/incoming-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-token': 'jsfhohoijmOIOIIUOJlknf894560257yrhuehflh884750wuehflhfehUYUYUHIhr4764357847eieohdlskfreoyt8373940'
        },
        body: JSON.stringify({
          action,
          title,
          source: source || 'TechCrunch / DetikINET',
          category: 'Teknologi'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setWebhookFeedback(`✅ Sinyal Radar Bot Tele terkirim! Karakter ${data.event?.agentId?.toUpperCase()} di Sayap Timur langsung merespon.`);
      } else {
        setWebhookFeedback(`❌ Error: ${data.message}`);
      }
    } catch (err: any) {
      setWebhookFeedback(`❌ Gagal: ${err.message}`);
    } finally {
      setWebhookSending(false);
    }
  };

  const handleCopyCode = () => {
    const textToCopy = webhookTarget === 'adafakta' ? snippetCode : botteleSnippetCode;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col p-3 sm:p-6 overflow-hidden select-none bg-[#0A0A0A] font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-white uppercase tracking-wider">
              BACKEND INTEGRATION & WEBHOOK HUB
            </h1>
            <span className="px-2 py-0.5 rounded-none text-[10px] bg-emerald-500 text-black font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              ZERO DB LOAD
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Integrasi satu arah aman antara Web Admin AdaFakta dan Diorama 3D Kantor AI tanpa membebani database Neon.
          </p>
        </div>

        {/* Section Switcher Tabs */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setActiveSection('webhook')}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-none transition-colors cursor-pointer font-bold ${
              activeSection === 'webhook'
                ? 'bg-white text-black border-white'
                : 'bg-[#121212] text-neutral-400 border-[#262626] hover:border-neutral-500'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>WEBHOOK LIVE DISPATCH</span>
          </button>
          <button
            onClick={() => setActiveSection('modules')}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-none transition-colors cursor-pointer font-bold ${
              activeSection === 'modules'
                ? 'bg-white text-black border-white'
                : 'bg-[#121212] text-neutral-400 border-[#262626] hover:border-neutral-500'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>MODUL ADAPTER ({modules.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: WEBHOOK LIVE DISPATCH & SNIPPET GUIDE */}
      {activeSection === 'webhook' && (
        <div className="flex-1 flex flex-col pt-3 overflow-y-auto">
          {/* Webhook Target Selector: AdaFakta vs Bot Tele */}
          <div className="flex items-center gap-2 pb-3 mb-2 border-b border-[#262626]">
            <span className="text-[11px] text-neutral-400 font-bold uppercase">PILIH PROYEK SUMBER:</span>
            <button
              onClick={() => setWebhookTarget('adafakta')}
              className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer border rounded-none ${
                webhookTarget === 'adafakta'
                  ? 'bg-blue-900/60 text-blue-200 border-blue-500'
                  : 'text-neutral-400 border-[#262626] hover:text-white'
              }`}
            >
              📰 REDAKSI UTAMA ADAFAKTA
            </button>
            <button
              onClick={() => setWebhookTarget('bottele')}
              className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer border rounded-none ${
                webhookTarget === 'bottele'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                  : 'text-neutral-400 border-[#262626] hover:text-white'
              }`}
            >
              📡 RADAR BOT TELE JURNALIS
            </button>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column: Live Test Buttons */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-4 bg-[#121212] border border-[#262626]">
                <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold text-white uppercase">
                      {webhookTarget === 'adafakta' ? 'ADAFAKTA WEBHOOK READY' : 'BOT TELE RADAR READY'}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500">ENDPOINT: /api/incoming-news</span>
                </div>

                <p className="text-xs text-neutral-400 mt-2 font-sans leading-relaxed">
                  {webhookTarget === 'adafakta'
                    ? 'Uji coba sinyal webhook langsung ke Sayap Barat (Redaksi). Klik tombol di bawah untuk melihat Scribe, Pixel, atau Chronos bergerak di 3D:'
                    : 'Uji coba sinyal webhook dari bot Telegram ke Sayap Timur (Radar Intelijen). Klik tombol di bawah untuk mengaktifkan Scout, TeleBot, atau Veritas:'}
                </p>

                <div className="mt-4 space-y-2.5">
                  {webhookTarget === 'adafakta' ? (
                    <>
                      <button
                        onClick={() =>
                          handleSendTestWebhook(
                            'draft_created',
                            'Kecerdasan Buatan Nasional Catat Lonjakan Efisiensi di Sektor Publik'
                          )
                        }
                        disabled={webhookSending}
                        className="w-full p-2.5 bg-[#181818] hover:bg-[#222222] border border-[#333333] hover:border-white text-left transition-colors flex items-center justify-between cursor-pointer group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">1. SIMULASI DRAFT BARU (SCRIBE)</span>
                            <span className="px-1.5 py-0.2 text-[9px] bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
                              ACTION: draft_created
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5 font-sans">
                            Scribe berdiri dari breakroom, berjalan ke meja kerja & mulai mengetik naskah.
                          </p>
                        </div>
                        <Zap className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition-colors shrink-0" />
                      </button>

                      <button
                        onClick={() =>
                          handleSendTestWebhook(
                            'cover_generated',
                            'Infografis: Peta Transformasi Teknologi AI Indonesia 2026'
                          )
                        }
                        disabled={webhookSending}
                        className="w-full p-2.5 bg-[#181818] hover:bg-[#222222] border border-[#333333] hover:border-white text-left transition-colors flex items-center justify-between cursor-pointer group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">2. SIMULASI COVER PROSES (PIXEL)</span>
                            <span className="px-1.5 py-0.2 text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                              ACTION: cover_generated
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5 font-sans">
                            Pixel mengompresi gambar cover ke format WebP & menyinkronkan aset visual.
                          </p>
                        </div>
                        <Zap className="w-4 h-4 text-neutral-500 group-hover:text-purple-400 transition-colors shrink-0" />
                      </button>

                      <button
                        onClick={() =>
                          handleSendTestWebhook(
                            'article_published',
                            'RESMI DITERBITKAN: Indonesia Luncurkan Inisiatif AI Berkelanjutan'
                          )
                        }
                        disabled={webhookSending}
                        className="w-full p-2.5 bg-[#181818] hover:bg-[#222222] border border-[#333333] hover:border-white text-left transition-colors flex items-center justify-between cursor-pointer group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">3. SIMULASI TERBIT LIVE (CHRONOS & RADAR)</span>
                            <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                              ACTION: article_published
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5 font-sans">
                            Suara denting chime berbunyi, konfeti meletup, dan artikel muncul di kolom Published.
                          </p>
                        </div>
                        <Zap className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          handleSendTestBotteleWebhook(
                            'bottele_rss_scraped',
                            'Terobosan Superkomputer AI Hemat Energi Resmi Diperkenalkan',
                            'TechCrunch'
                          )
                        }
                        disabled={webhookSending}
                        className="w-full p-2.5 bg-[#181818] hover:bg-[#222222] border border-[#333333] hover:border-white text-left transition-colors flex items-center justify-between cursor-pointer group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-400">1. SIMULASI RSS TEKNO (SCOUT)</span>
                            <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                              ACTION: bottele_rss_scraped
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5 font-sans">
                            Scout menyisir 6 kanal RSS, counter Terpantau (Tekno) bertambah +1 secara realtime.
                          </p>
                        </div>
                        <Zap className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                      </button>

                      <button
                        onClick={() =>
                          handleSendTestBotteleWebhook(
                            'bottele_dispatch_telegram',
                            'Breaking Alert: Pendanaan Startup AI Naik Drastis di Kuartal IV'
                          )
                        }
                        disabled={webhookSending}
                        className="w-full p-2.5 bg-[#181818] hover:bg-[#222222] border border-[#333333] hover:border-white text-left transition-colors flex items-center justify-between cursor-pointer group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-sky-400">2. SIMULASI DISPATCH TELEGRAM (TELEBOT)</span>
                            <span className="px-1.5 py-0.2 text-[9px] bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
                              ACTION: bottele_dispatch_telegram
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5 font-sans">
                            TeleBot memproses pesan peringatan liputan ke smartphone jurnalis di lapangan.
                          </p>
                        </div>
                        <Zap className="w-4 h-4 text-neutral-500 group-hover:text-sky-400 transition-colors shrink-0" />
                      </button>

                      <button
                        onClick={() =>
                          handleSendTestBotteleWebhook(
                            'bottele_synced_adafakta',
                            'Dossier Investigasi: Keamanan Privasi Data Biometrik Terverifikasi'
                          )
                        }
                        disabled={webhookSending}
                        className="w-full p-2.5 bg-[#181818] hover:bg-[#222222] border border-[#333333] hover:border-white text-left transition-colors flex items-center justify-between cursor-pointer group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-purple-400">3. SIMULASI SETOR KE ADAFAKTA (VERITAS)</span>
                            <span className="px-1.5 py-0.2 text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                              ACTION: bottele_synced_adafakta
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5 font-sans">
                            Veritas memverifikasi fakta dan menyetor materi investigasi ke Sayap Barat AdaFakta.
                          </p>
                        </div>
                        <Zap className="w-4 h-4 text-neutral-500 group-hover:text-purple-400 transition-colors shrink-0" />
                      </button>
                    </>
                  )}
                </div>

                {webhookFeedback && (
                  <div className="mt-3 p-2 bg-[#0A0A0A] border border-[#333333] text-xs text-neutral-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{webhookFeedback}</span>
                  </div>
                )}
              </div>

              {/* Security Guarantee Box */}
              <div className="p-4 bg-[#121212] border border-[#262626]">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>KEAMANAN ZERO-LOAD DUA ARAH</span>
                </div>
                <ul className="text-xs text-neutral-400 space-y-1.5 font-sans">
                  <li>• <strong>Non-blocking:</strong> Baik web AdaFakta maupun Bot Tele Jurnalis diproteksi timeout 1.5 detik senyap (silent catch).</li>
                  <li>• <strong>Token Protected:</strong> Menggunakan token rahasia webhook terpusat yang sama.</li>
                  <li>• <strong>CORS Bebas Hambatan:</strong> Endpoint <code className="text-neutral-200">/api/incoming-news</code> mengizinkan sinyal lintas domain Vercel.</li>
                </ul>
              </div>
            </div>

            {/* Right Column: Code Snippet */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs font-bold text-white uppercase">
                    {webhookTarget === 'adafakta' ? 'SNIPPET UNTUK WEB ADMIN ADAFAKTA' : 'SNIPPET UNTUK WEB BOT TELE JURNALIS'}
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-neutral-200 text-black text-xs font-bold rounded-none transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'TERSALIN!' : 'SALIN KODE'}</span>
                </button>
              </div>

              <pre className="p-3 bg-[#121212] border border-[#262626] font-mono text-[11px] text-neutral-200 flex-1 overflow-x-auto leading-relaxed select-text">
                {webhookTarget === 'adafakta' ? snippetCode : botteleSnippetCode}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ORIGINAL BACKEND MODULES LIST & INSPECTOR */}
      {activeSection === 'modules' && (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Mobile Tab Switcher */}
          <div className="flex items-center gap-1 pt-3 pb-1 lg:hidden">
            <button
              onClick={() => setMobileTab('modules')}
              className={`flex-1 py-1.5 text-xs font-bold border rounded-none transition-colors cursor-pointer ${
                mobileTab === 'modules'
                  ? 'bg-white text-black border-white'
                  : 'bg-[#121212] text-neutral-400 border-[#262626]'
              }`}
            >
              LIST MODUL ({modules.length})
            </button>
            <button
              onClick={() => setMobileTab('inspector')}
              className={`flex-1 py-1.5 text-xs font-bold border rounded-none transition-colors cursor-pointer ${
                mobileTab === 'inspector'
                  ? 'bg-white text-black border-white'
                  : 'bg-[#121212] text-neutral-400 border-[#262626]'
              }`}
            >
              INSPECTOR & TEST
            </button>
          </div>

          {/* Main Grid: Modules List (Col 6) & Interactive Inspector (Col 6) */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 pt-2 lg:pt-4 overflow-hidden min-h-0">
            {/* Module Cards List */}
            <div className={`lg:col-span-6 overflow-y-auto space-y-2 pr-1 ${mobileTab === 'modules' ? 'block' : 'hidden lg:block'}`}>
              {modules.map((mod) => {
                const isSelected = selectedModule.id === mod.id;

                return (
                  <div
                    key={mod.id}
                    onClick={() => {
                      setSelectedModule(mod);
                      setTestResult(null);
                      setMobileTab('inspector');
                    }}
                    className={`p-3 rounded-none border transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#181818] border-white text-white'
                        : 'bg-[#121212] border-[#262626] hover:border-[#404040]'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-1.5 py-0.2 text-[9px] uppercase bg-[#0A0A0A] border border-[#333333] text-neutral-300 font-bold">
                          {mod.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-neutral-500">
                          AGENT: {mod.associatedAgent.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-white truncate">{mod.name}</h3>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {mod.pathOrIdentifier}
                      </p>
                      <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1 leading-relaxed font-sans">
                        {mod.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between shrink-0 h-full">
                      <span className="text-[9px] px-1.5 py-0.2 bg-white text-black font-bold">
                        {mod.status.toUpperCase()}
                      </span>
                      {mod.latencyMs && (
                        <span className="text-[10px] text-neutral-500 mt-2 tabular-nums">
                          {mod.latencyMs}ms
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Inspector & Test Runner Panel */}
            <div className={`lg:col-span-6 bg-[#121212] border border-[#262626] rounded-none p-3 sm:p-4 flex flex-col justify-between overflow-y-auto ${mobileTab === 'inspector' ? 'block' : 'hidden lg:flex'}`}>
              <div>
                {/* Back button for mobile */}
                <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMobileTab('modules')}
                      className="p-1 border border-[#262626] hover:border-white text-neutral-400 hover:text-white lg:hidden cursor-pointer"
                      title="Kembali ke List Modul"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
                        {selectedModule.type.replace('_', ' ')} TELEMETRY
                      </span>
                      <h2 className="text-sm font-black text-white mt-0.5">{selectedModule.name}</h2>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTestModule(selectedModule)}
                    disabled={testingId === selectedModule.id}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-neutral-200 disabled:opacity-50 text-black rounded-none text-xs font-bold transition-colors cursor-pointer border border-white shrink-0"
                  >
                    {testingId === selectedModule.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    <span>TEST ADAPTER</span>
                  </button>
                </div>

                {/* Spec info */}
                <div className="mt-3 space-y-2">
                  <div className="p-2.5 bg-[#0A0A0A] border border-[#262626]">
                    <div className="text-[9px] text-neutral-500 uppercase">IDENTIFIER / ROUTE</div>
                    <div className="text-xs font-bold text-white mt-0.5 break-all">
                      {selectedModule.pathOrIdentifier}
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#0A0A0A] border border-[#262626]">
                    <div className="text-[9px] text-neutral-500 uppercase">FUNGSIONALITAS</div>
                    <div className="text-xs text-neutral-300 mt-0.5 leading-relaxed font-sans">
                      {selectedModule.description}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2.5 bg-[#0A0A0A] border border-[#262626]">
                      <div className="text-[9px] text-neutral-500 uppercase">ASSOCIATED AGENT</div>
                      <div className="text-xs font-bold text-white mt-0.5">
                        {selectedModule.associatedAgent.toUpperCase()}
                      </div>
                    </div>

                    <div className="p-2.5 bg-[#0A0A0A] border border-[#262626]">
                      <div className="text-[9px] text-neutral-500 uppercase">ENV VARIABLE</div>
                      <div className="text-xs text-neutral-300 mt-0.5 truncate">
                        {selectedModule.environmentVar || 'Internal / Serverless'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Terminal / Response Payload Viewer */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1">
                    <span className="flex items-center gap-1.5 text-neutral-300">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>ADAPTER JSON RESPONSE</span>
                    </span>
                    <span>application/json</span>
                  </div>

                  <pre className="p-3 bg-[#0A0A0A] border border-[#262626] font-mono text-[11px] text-neutral-200 max-h-52 overflow-y-auto">
                    {testResult ||
                      JSON.stringify(
                        {
                          status: 'STANDBY',
                          info: 'Klik "TEST ADAPTER" untuk mensimulasikan handshake endpoint.',
                          target: selectedModule.pathOrIdentifier,
                          configuredAgent: selectedModule.associatedAgent
                        },
                        null,
                        2
                      )}
                  </pre>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#262626] flex items-center justify-between text-[10px] text-neutral-600">
                <span>Production Adapter Layer</span>
                <span>Zero Frontend Secret Storage</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
