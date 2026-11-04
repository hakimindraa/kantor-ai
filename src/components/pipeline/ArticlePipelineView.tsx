'use client';

import React from 'react';
import { useOfficeStore } from '@/store/officeStore';
import { PipelineArticle, PipelineStage } from '@/types/pipeline';
import confetti from 'canvas-confetti';
import {
  PlusCircle,
  ArrowRight,
  Check,
  ExternalLink,
  Search,
  PenTool,
  Camera,
  Clock,
  BarChart2
} from 'lucide-react';

const STAGES: {
  id: PipelineStage;
  label: string;
  agentName: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  {
    id: 'incoming',
    label: 'Incoming Feeds',
    agentName: 'SCOUT',
    icon: Search,
    description: 'Scraping RSS & deduplikasi konten'
  },
  {
    id: 'drafting',
    label: 'Drafting & 5W+1H',
    agentName: 'SCRIBE',
    icon: PenTool,
    description: 'Penyusunan naskah & SEO title'
  },
  {
    id: 'image_processing',
    label: 'Image & WebP',
    agentName: 'PIXEL',
    icon: Camera,
    description: 'Kompresi WebP & CDN ImgBB'
  },
  {
    id: 'scheduled',
    label: 'Queue & Pacing',
    agentName: 'CHRONOS',
    icon: Clock,
    description: 'Pengaturan slot publikasi berkala'
  },
  {
    id: 'published',
    label: 'Published & Indexed',
    agentName: 'RADAR',
    icon: BarChart2,
    description: 'Google Indexing API & Telegram blast'
  }
];

export const ArticlePipelineView: React.FC = () => {
  const articles = useOfficeStore((state) => state.articles);
  const moveArticleStage = useOfficeStore((state) => state.moveArticleStage);
  const triggerManualPipelineRun = useOfficeStore((state) => state.triggerManualPipelineRun);
  const addActivityLog = useOfficeStore((state) => state.addActivityLog);

  const getNextStage = (current: PipelineStage): PipelineStage | null => {
    switch (current) {
      case 'incoming':
        return 'drafting';
      case 'drafting':
        return 'image_processing';
      case 'image_processing':
        return 'scheduled';
      case 'scheduled':
        return 'published';
      default:
        return null;
    }
  };

  const handleAdvance = (article: PipelineArticle) => {
    const next = getNextStage(article.currentStage);
    if (!next) return;

    moveArticleStage(article.id, next);

    if (next === 'published') {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}

      addActivityLog({
        agentId: 'radar',
        agentName: 'RADAR',
        agentColor: '#FAFAFA',
        category: 'seo',
        level: 'success',
        message: `Artikel "${article.title.substring(0, 30)}..." telah DITERBITKAN dan sinyal indeks dikirim ke Google & Bing!`
      });

      addActivityLog({
        agentId: 'hermes',
        agentName: 'HERMES',
        agentColor: '#FAFAFA',
        category: 'distribution',
        level: 'info',
        message: `Notifikasi rilis artikel "${article.title.substring(0, 25)}..." dikirim ke Telegram Channel.`
      });
    } else {
      addActivityLog({
        agentId: article.assignedAgent,
        agentName: article.assignedAgent.toUpperCase(),
        agentColor: '#FAFAFA',
        category: 'editorial',
        level: 'info',
        message: `Artikel "${article.title.substring(0, 30)}..." beralih ke tahap ${next.toUpperCase()}`
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-3 sm:p-6 overflow-hidden select-none bg-[#0A0A0A] font-mono">
      {/* Pipeline Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-white uppercase tracking-wider">
              ARTICLE PRODUCTION PIPELINE
            </h1>
            <span className="px-2 py-0.5 rounded-none text-[10px] bg-white text-black font-bold">
              AUTONOMOUS WORKFLOW
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Alur otomatisasi redaksi: SCOUT → SCRIBE → PIXEL → CHRONOS → RADAR & HERMES.
          </p>
        </div>

        <button
          onClick={triggerManualPipelineRun}
          className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-neutral-200 text-black rounded-none text-xs font-bold transition-colors cursor-pointer border border-white"
        >
          <PlusCircle className="w-4 h-4" />
          <span>INGEST WIRE BARU</span>
        </button>
      </div>

      {/* Visual Workflow Steps Flowbar */}
      <div className="py-2.5 border-b border-[#262626] flex items-center justify-between overflow-x-auto gap-2 text-xs">
        {STAGES.map((s, idx) => {
          const Icon = s.icon;
          return (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-2 px-2.5 py-1 bg-[#121212] border border-[#262626] shrink-0 rounded-none">
                <span className="w-1.5 h-1.5 bg-white" />
                <Icon className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-bold text-white">{s.agentName}:</span>
                <span className="text-neutral-400 text-[11px]">{s.label}</span>
              </div>
              {idx < STAGES.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* 5-Column Kanban Board - Mobile Horizontal Swipeable, Desktop 5-Col Grid */}
      <div className="flex-1 flex md:grid md:grid-cols-5 gap-2.5 pt-3 overflow-x-auto md:overflow-y-auto min-h-0 snap-x snap-mandatory pb-2">
        {STAGES.map((stage) => {
          const stageArticles = articles.filter((a) => a.currentStage === stage.id);
          const Icon = stage.icon;

          return (
            <div
              key={stage.id}
              className="w-[85vw] sm:w-[300px] md:w-auto shrink-0 snap-center bg-[#121212] border border-[#262626] rounded-none flex flex-col overflow-hidden"
            >
              {/* Column Header */}
              <div className="p-2.5 border-b border-[#262626] flex items-center justify-between bg-[#161616]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white" />
                  <div>
                    <h3 className="text-xs font-black text-white uppercase">{stage.label}</h3>
                    <p className="text-[10px] text-neutral-500 font-mono">// {stage.agentName}</p>
                  </div>
                </div>
                <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-[#262626] text-white">
                  {stageArticles.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {stageArticles.map((article) => {
                  const nextStage = getNextStage(article.currentStage);

                  return (
                    <div
                      key={article.id}
                      className="p-3 bg-[#0A0A0A] border border-[#262626] hover:border-[#52525B] transition-colors flex flex-col justify-between"
                    >
                      <div>
                        {/* Category & Read Time */}
                        <div className="flex items-center justify-between text-[10px] mb-1.5">
                          <span className="px-1.5 py-0.2 bg-[#181818] border border-[#333333] text-neutral-300 font-semibold uppercase">
                            {article.category}
                          </span>
                          <span className="text-neutral-500 tabular-nums">{article.readTime}</span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-bold text-white leading-snug line-clamp-3 font-sans">
                          {article.title}
                        </h4>

                        {/* Source */}
                        <p className="text-[10px] text-neutral-500 mt-2 truncate">
                          SUMBER: {article.source}
                        </p>

                        {/* Image Optimization Savings */}
                        {article.optimizedImageSize && (
                          <div className="mt-1.5 text-[10px] p-1.5 bg-[#141414] border border-[#262626] text-neutral-300">
                            WEBP: {article.optimizedImageSize}
                          </div>
                        )}

                        {/* Scheduled time info */}
                        {article.scheduledTime && (
                          <div className="mt-1.5 text-[10px] p-1.5 bg-[#141414] border border-[#262626] text-neutral-300">
                            RELEASE: {article.scheduledTime}
                          </div>
                        )}

                        {/* Published Status Info */}
                        {article.currentStage === 'published' && (
                          <div className="mt-1.5 space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] text-white font-bold">
                              <Check className="w-3.5 h-3.5" />
                              <span>GOOGLE & BING INDEXED</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-3 pt-2 border-t border-[#262626] flex items-center justify-between text-[10px]">
                        <span className="text-neutral-500 tabular-nums">SEO: {article.seoScore}</span>

                        {nextStage ? (
                          <button
                            onClick={() => handleAdvance(article)}
                            className="flex items-center gap-1 px-2 py-0.5 bg-white text-black hover:bg-neutral-200 font-bold transition-colors cursor-pointer rounded-none"
                          >
                            <span>LANJUT</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <a
                            href={article.publishedUrl || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-white hover:underline font-bold"
                          >
                            <span>LIVE URL</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}

                {stageArticles.length === 0 && (
                  <div className="p-6 text-center text-[10px] text-neutral-600 font-mono">
                    NO ARTICLES IN STAGE
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
