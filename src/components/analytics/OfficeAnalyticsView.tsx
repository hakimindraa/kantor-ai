'use client';

import React from 'react';
import { useOfficeStore } from '@/store/officeStore';
import {
  HOURLY_ARTICLES_DATA,
  CATEGORY_DISTRIBUTION,
  AGENT_ACTIVITY_SUMMARY
} from '@/services/mock/mockAnalytics';
import {
  FileCheck,
  Image,
  Send,
  HardDrive,
  Clock,
  Check
} from 'lucide-react';

export const OfficeAnalyticsView: React.FC = () => {
  const stats = useOfficeStore((state) => state.stats);

  const maxHourlyCount = Math.max(...HOURLY_ARTICLES_DATA.map((d) => d.count), 5);

  return (
    <div className="w-full h-full flex flex-col p-6 overflow-y-auto select-none bg-[#0A0A0A] font-mono">
      {/* Analytics Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-white uppercase tracking-wider">
              OFFICE ANALYTICS & TELEMETRY
            </h1>
            <span className="px-2 py-0.5 rounded-none text-[10px] bg-white text-black font-bold">
              AGGREGATED METRICS
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Metrik produksi berita harian, optimasi bandwidth WebP, trafik rilis Telegram, dan performa database.
          </p>
        </div>
      </div>

      {/* 6 Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 pt-4">
        {/* Total Today */}
        <div className="p-3 bg-[#121212] border border-[#262626] rounded-none">
          <div className="text-[10px] text-neutral-400 flex items-center justify-between uppercase">
            <span>ARTIKEL TOTAL</span>
            <FileCheck className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1 tabular-nums">{stats.articlesToday}</div>
          <div className="text-[9px] text-neutral-500 mt-0.5">TARGET: 24 ART</div>
        </div>

        {/* Published */}
        <div className="p-3 bg-[#121212] border border-[#262626] rounded-none">
          <div className="text-[10px] text-neutral-400 flex items-center justify-between uppercase">
            <span>TERBIT</span>
            <Check className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1 tabular-nums">{stats.publishedToday}</div>
          <div className="text-[9px] text-neutral-500 mt-0.5">100% INDEXED</div>
        </div>

        {/* In Queue */}
        <div className="p-3 bg-[#121212] border border-[#262626] rounded-none">
          <div className="text-[10px] text-neutral-400 flex items-center justify-between uppercase">
            <span>ANTREAN</span>
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1 tabular-nums">{stats.inQueue}</div>
          <div className="text-[9px] text-neutral-500 mt-0.5">PACING 15M</div>
        </div>

        {/* Images Processed */}
        <div className="p-3 bg-[#121212] border border-[#262626] rounded-none">
          <div className="text-[10px] text-neutral-400 flex items-center justify-between uppercase">
            <span>FOTO PROSES</span>
            <Image className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1 tabular-nums">184</div>
          <div className="text-[9px] text-neutral-500 mt-0.5">FORMAT: WEBP</div>
        </div>

        {/* Bandwidth Saved */}
        <div className="p-3 bg-[#121212] border border-[#262626] rounded-none">
          <div className="text-[10px] text-neutral-400 flex items-center justify-between uppercase">
            <span>BANDWIDTH HEMAT</span>
            <HardDrive className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1 tabular-nums">{stats.bandwidthSavedMb} MB</div>
          <div className="text-[9px] text-neutral-500 mt-0.5">KOMPRESI: 82%</div>
        </div>

        {/* Telegram Alerts */}
        <div className="p-3 bg-[#121212] border border-[#262626] rounded-none">
          <div className="text-[10px] text-neutral-400 flex items-center justify-between uppercase">
            <span>NOTIF TELEGRAM</span>
            <Send className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1 tabular-nums">{stats.telegramAlertsSent}</div>
          <div className="text-[9px] text-neutral-500 mt-0.5">DELIVER 100%</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-3">
        {/* Hourly Publication Bar Chart (Col 8) */}
        <div className="lg:col-span-8 p-4 bg-[#121212] border border-[#262626] rounded-none">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Distribusi Publikasi per Jam</h3>
              <p className="text-[11px] text-neutral-400 font-sans">Volume artikel dirilis otomatis hari ini</p>
            </div>
            <span className="text-[10px] text-neutral-300 bg-[#1A1A1A] border border-[#333333] px-2 py-0.5">
              AVG 2.6 ART/JAM
            </span>
          </div>

          {/* Bar Chart Visual */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-1 border-b border-[#262626] pb-2">
            {HOURLY_ARTICLES_DATA.map((item, idx) => {
              const heightPercent = (item.count / maxHourlyCount) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    {item.count}
                  </span>
                  <div
                    className="w-full max-w-[36px] bg-white transition-all duration-300 hover:bg-neutral-300 rounded-none"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] text-neutral-500">{item.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown (Col 4) */}
        <div className="lg:col-span-4 p-4 bg-[#121212] border border-[#262626] rounded-none flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Komposisi Rubrik Berita</h3>
            <p className="text-[11px] text-neutral-400 font-sans mb-3">Proporsi topik liputan hari ini</p>

            <div className="space-y-2.5">
              {CATEGORY_DISTRIBUTION.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-neutral-300">{cat.name}</span>
                    <span className="text-white tabular-nums">{cat.percentage}% ({cat.count})</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#262626] rounded-none overflow-hidden">
                    <div
                      className="h-full bg-white rounded-none"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 p-2 bg-[#0A0A0A] border border-[#262626] text-[10px] text-neutral-400 font-sans">
            Fokus liputan hari ini: Akselerasi adopsi kecerdasan buatan dan fintech nasional.
          </div>
        </div>
      </div>

      {/* Agent Activity & Efficiency Table */}
      <div className="mt-3 p-4 bg-[#121212] border border-[#262626] rounded-none">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">
          Ringkasan Throughput & Efisiensi AI Agent
        </h3>
        <p className="text-[11px] text-neutral-400 font-sans mb-3">Metrik produktivitas masing-masing modul AI</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#262626] text-neutral-500 font-mono text-[10px]">
                <th className="pb-2">AGENT</th>
                <th className="pb-2">PRIMARY FUNCTION</th>
                <th className="pb-2">THROUGHPUT</th>
                <th className="pb-2">EFFICIENCY</th>
                <th className="pb-2">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {AGENT_ACTIVITY_SUMMARY.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#181818] transition-colors">
                  <td className="py-2 font-bold text-white">{row.name}</td>
                  <td className="py-2 text-neutral-300 font-sans">{row.task}</td>
                  <td className="py-2 text-white tabular-nums">{row.throughput}</td>
                  <td className="py-2 text-white font-bold tabular-nums">{row.efficiency}%</td>
                  <td className="py-2">
                    <span className="px-1.5 py-0.2 text-[9px] bg-white text-black font-bold">
                      OPTIMAL
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
