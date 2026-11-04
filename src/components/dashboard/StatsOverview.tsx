'use client';

import React from 'react';
import { useOfficeStore } from '@/store/officeStore';
import { Users, FileText, Clock, Server, ArrowUpRight, Check } from 'lucide-react';

export const StatsOverview: React.FC = () => {
  const stats = useOfficeStore((state) => state.stats);
  const setActiveTab = useOfficeStore((state) => state.setActiveTab);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 select-none font-mono">
      {/* 1. Active Agents */}
      <div
        onClick={() => setActiveTab('agents')}
        className="p-3 bg-[#1A1B1F] border border-[#32353E] hover:border-[#6B7280] transition-colors cursor-pointer rounded-none group shadow-sm"
      >
        <div className="flex items-center justify-between text-neutral-400 text-[10px] uppercase tracking-wider font-bold">
          <span>ACTIVE AGENTS</span>
          <Users className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-black text-white tabular-nums">{stats.activeAgents}</span>
          <span className="text-xs text-neutral-400 font-mono">/ {stats.totalAgents} ONLINE</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-neutral-300 font-medium">
          <span className="w-1.5 h-1.5 rounded-none bg-neutral-300" />
          <span>ALL UNITS OPERATIONAL</span>
        </div>
      </div>

      {/* 2. Articles Today */}
      <div
        onClick={() => setActiveTab('pipeline')}
        className="p-3 bg-[#1A1B1F] border border-[#32353E] hover:border-[#6B7280] transition-colors cursor-pointer rounded-none group shadow-sm"
      >
        <div className="flex items-center justify-between text-neutral-400 text-[10px] uppercase tracking-wider font-bold">
          <span>ARTICLES TODAY</span>
          <FileText className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-black text-white tabular-nums">{stats.articlesToday}</span>
          <span className="text-xs text-neutral-400 font-mono">PUBLISHED & QUEUE</span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-[10px] text-neutral-300 font-medium">
          <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300" />
          <span className="tabular-nums">+{stats.articlesTrendPercent}% VS YESTERDAY</span>
        </div>
      </div>

      {/* 3. Next Publish */}
      <div
        onClick={() => setActiveTab('pipeline')}
        className="p-3 bg-[#1A1B1F] border border-[#32353E] hover:border-[#6B7280] transition-colors cursor-pointer rounded-none group shadow-sm"
      >
        <div className="flex items-center justify-between text-neutral-400 text-[10px] uppercase tracking-wider font-bold">
          <span>NEXT PUBLISH</span>
          <Clock className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-black text-white tabular-nums">{stats.nextPublishTime}</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-neutral-300 font-medium">
          <span className="w-1.5 h-1.5 rounded-none bg-neutral-400" />
          <span className="tabular-nums">{stats.inQueue} IN BUFFER QUEUE</span>
        </div>
      </div>

      {/* 4. Server Health */}
      <div
        onClick={() => setActiveTab('backend')}
        className="p-3 bg-[#1A1B1F] border border-[#32353E] hover:border-[#6B7280] transition-colors cursor-pointer rounded-none group shadow-sm"
      >
        <div className="flex items-center justify-between text-neutral-400 text-[10px] uppercase tracking-wider font-bold">
          <span>SERVER HEALTH</span>
          <Server className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-black text-white tabular-nums">{stats.serverHealth}%</span>
          <span className="text-xs text-neutral-400 tabular-nums font-mono">{stats.serverLatencyMs}ms</span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-[10px] text-neutral-300 font-medium">
          <Check className="w-3.5 h-3.5 text-neutral-300" />
          <span>NEON POSTGRES CONNECTED</span>
        </div>
      </div>
    </div>
  );
};
