'use client';

import React, { useState } from 'react';
import { useOfficeStore } from '@/store/officeStore';
import {
  X,
  Copy,
  Check,
  Download,
  ExternalLink,
  Clock,
  FileText,
  Sparkles,
  Search,
  Send
} from 'lucide-react';

export const ArticleReaderModal: React.FC = () => {
  const activeArticle = useOfficeStore((state) => state.activeReaderArticle);
  const closeArticleReader = useOfficeStore((state) => state.closeArticleReader);
  const [copied, setCopied] = useState(false);

  if (!activeArticle) return null;

  const handleCopy = () => {
    const text = `# ${activeArticle.title}\n\nKategori: ${activeArticle.category} | Penulis: ${activeArticle.assignedAgent.toUpperCase()} AI\n\n${
      activeArticle.title
    }. Pemerintah dan pelaku industri terus memperkuat integrasi otomasi kecerdasan buatan demi efisiensi nasional. Simak ulasan komprehensif berikut mengenai perkembangan terbaru di sektor ini.\n\n### 5W+1H Ringkasan Berita\n- **What**: Peluncuran inisiatif akselerasi digital.\n- **Who**: Kementerian terkait & konsorsium industri.\n- **Where**: Jakarta & ekosistem cloud regional.\n- **When**: Kuartal berjalan 2026.\n- **Why**: Mendorong transparansi dan kecepatan distribusi informasi.\n- **How**: Melalui pipeline otomasi terintegrasi.\n\nSumber Resmi: ${activeArticle.publishedUrl || 'AdaFakta Portal'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const markdown = `# ${activeArticle.title}\n\n*Dipublikasikan oleh Virtual AI Newsroom HQ*\n\n---\n\n**Kategori**: ${activeArticle.category}\n**Status Pipeline**: ${activeArticle.currentStage.toUpperCase()}\n**Estimasi Kata**: ${activeArticle.wordCount} kata\n**Waktu Baca**: ${activeArticle.readTime}\n\n## Naskah Lengkap\n\n${activeArticle.title}. Artikel ini diproses secara otomatis melalui rangkaian pipeline SCOUT (Scraping), SCRIBE (Gemini 3.8 Flash), PIXEL (WebP Compression), CHRONOS (Waterfall Scheduler), dan RADAR (Google Indexing API).\n\n### Analisis SEO & Distribusi\n- Skor SEO: ${activeArticle.seoScore}/100\n- Status Google Index: ${activeArticle.indexedGoogle ? 'Terindeks (Status 200)' : 'Antrean Indexing'}\n- Notifikasi Telegram: ${activeArticle.telegramNotified ? 'Terkirim ke Redaksi' : 'Belum'}\n\nURL Publikasi: ${activeArticle.publishedUrl || 'https://www.adafakta.web.id'}\n`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeArticle.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 40)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#1E222A] border border-[#3D4454] shadow-2xl flex flex-col max-h-[90vh] font-mono text-white select-text">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#3D4454] bg-[#262B35]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-none animate-pulse" />
            <span className="text-xs font-bold text-slate-200 tracking-wider">
              PRATINJAU ARTIKEL // {activeArticle.currentStage.toUpperCase()}
            </span>
          </div>

          <button
            onClick={closeArticleReader}
            className="p-1 text-slate-400 hover:text-white hover:bg-[#313744] transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs leading-relaxed">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 bg-[#313744] border border-[#475569] text-amber-300 font-bold text-[10px]">
              {activeArticle.category.toUpperCase()}
            </span>
            <span className="flex items-center gap-1 text-slate-400 text-[10px]">
              <Clock className="w-3 h-3" />
              {activeArticle.readTime}
            </span>
            <span className="flex items-center gap-1 text-slate-400 text-[10px]">
              <FileText className="w-3 h-3" />
              {activeArticle.wordCount} KATA
            </span>
            <span className="flex items-center gap-1 text-slate-400 text-[10px]">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              AGEN: {activeArticle.assignedAgent.toUpperCase()}
            </span>
          </div>

          {/* Article Title */}
          <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
            {activeArticle.title}
          </h2>

          {/* Featured Image if available */}
          {activeArticle.featuredImage && (
            <div className="relative w-full h-48 bg-[#181B22] border border-[#3D4454] overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeArticle.featuredImage}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 border border-[#3D4454] text-[9px] text-emerald-400 font-bold">
                {activeArticle.optimizedImageSize}
              </div>
            </div>
          )}

          {/* Simulated Article Body 5W+1H */}
          <div className="space-y-2.5 text-slate-300 pt-2 border-t border-[#2E3340]">
            <p>
              <strong className="text-white">JAKARTA, AdaFakta Newsroom</strong> — Pemerintah bersama konsorsium industri resmi mengumumkan fase berikutnya dalam percepatan automasi ekosistem AI nasional. Langkah strategis ini diharapkan memangkas jeda waktu distribusi informasi hingga 80% dengan efisiensi komputasi optimal.
            </p>
            <p>
              Dalam keterangannya, integrasi model bahasa generasi terbaru seperti Gemini 3.8 Flash terbukti mampu meracik draf berita akurat dalam kaidah jurnalistik 5W+1H, lengkap dengan penataan struktur SEO yang memenuhi standar mesin pencari global.
            </p>
            <p>
              &ldquo;Dengan sinkronisasi langsung antara modul kurasi berita mentah, kompresi aset gambar WebP, dan pengindeksan instan Google, pembaca memperoleh kabar terpercaya dengan waktu latensi seminimal mungkin,&rdquo; demikian bunyi rilis editorial.
            </p>
          </div>

          {/* SEO & Telegram Live Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#2E3340]">
            <div className="p-2 bg-[#262B35] border border-[#3D4454] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[10px] text-slate-300">GOOGLE INDEX</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">
                {activeArticle.indexedGoogle ? '● INSTANT PING' : '● ANTRIAN'}
              </span>
            </div>

            <div className="p-2 bg-[#262B35] border border-[#3D4454] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[10px] text-slate-300">TELEGRAM ALERT</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">
                {activeArticle.telegramNotified ? '● DELIVERED' : '● MENUNGGU'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#3D4454] bg-[#262B35]">
          {activeArticle.publishedUrl ? (
            <a
              href={activeArticle.publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-bold"
            >
              <span>BUKA LINK WEB</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-[10px] text-slate-500">KONTEN SIMULASI REDAKSI</span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 text-xs font-bold bg-[#313744] hover:bg-[#3D4454] text-white border border-[#475569] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'TERSALIN!' : 'SALIN TEKS'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-2.5 py-1 text-xs font-bold bg-white hover:bg-slate-200 text-black border border-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT .MD</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

