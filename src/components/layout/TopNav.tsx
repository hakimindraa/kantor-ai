'use client';

import React, { useState, useEffect } from 'react';
import { useOfficeStore } from '@/store/officeStore';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  PlusCircle,
  Maximize2,
  Menu,
  ExternalLink
} from 'lucide-react';

export const TopNav: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>('20:30:00 WIB');

  const triggerManualPipelineRun = useOfficeStore((state) => state.triggerManualPipelineRun);
  const setCameraPreset = useOfficeStore((state) => state.setCameraPreset);
  const soundEnabled = useOfficeStore((state) => state.soundEnabled);
  const toggleSound = useOfficeStore((state) => state.toggleSound);
  const stats = useOfficeStore((state) => state.stats);
  const toggleMobileSidebar = useOfficeStore((state) => state.toggleMobileSidebar);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(`${now.toTimeString().split(' ')[0]} WIB`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="h-12 bg-[#262B35] border-b border-[#3D4454] px-3 sm:px-4 flex items-center justify-between z-10 select-none">
      {/* Left Title & Telemetry */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileSidebar}
          className="p-1.5 md:hidden border border-[#3D4454] hover:border-[#5A6478] text-neutral-300 hover:text-white rounded-none cursor-pointer"
          title="Buka Menu Workspace"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-black text-white uppercase tracking-wider truncate">
            NEWSROOM HQ
          </span>
          <span className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 border border-[#5A6478] bg-[#313744] text-neutral-200 font-bold">
            3D SYSTEM
          </span>
        </div>

        {/* Live Monochromatic Telemetry Readouts */}
        <div className="hidden lg:flex items-center gap-2.5 text-[11px] font-mono border-l border-[#3D4454] pl-4">
          <span className="flex items-center gap-1.5 text-neutral-200">
            <span className="w-1.5 h-1.5 rounded-none bg-neutral-300 animate-pulse" />
            <span className="font-bold">LIVE</span>
          </span>
          <span className="text-neutral-500">//</span>
          <span className="text-neutral-300 tabular-nums">LATENCY {stats.serverLatencyMs}ms</span>
          <span className="text-neutral-500">//</span>
          <span className="text-white font-bold tabular-nums">{timeStr}</span>
        </div>
      </div>

      {/* Right Controls & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Ingest Action Button */}
        <button
          onClick={triggerManualPipelineRun}
          className="flex items-center gap-1 px-2.5 py-1 bg-[#313744] hover:bg-[#3D4454] text-white border border-[#5A6478] text-xs font-mono font-bold transition-colors cursor-pointer rounded-none"
          title="Simulasikan Berita Masuk"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">INGEST</span>
        </button>

        {/* Reset Camera to Isometric */}
        <button
          onClick={() => setCameraPreset('ISOMETRIC')}
          className="p-1.5 sm:px-2 sm:py-1 bg-[#262B35] hover:bg-[#313744] text-neutral-200 hover:text-white border border-[#3D4454] transition-colors text-xs font-mono flex items-center gap-1 rounded-none cursor-pointer"
          title="Reset Sudut Pandang Isometric"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-xs">RESET</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className={`p-1.5 border transition-colors rounded-none cursor-pointer ${
            soundEnabled
              ? 'bg-[#475569] text-white border-[#64748B]'
              : 'bg-[#262B35] border-[#3D4454] text-neutral-400 hover:text-white'
          }`}
          title={soundEnabled ? 'Matikan Audio FX' : 'Aktifkan Audio FX'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Fullscreen */}
        <button
          onClick={handleFullscreen}
          className="p-1.5 bg-[#262B35] hover:bg-[#313744] text-neutral-300 hover:text-white border border-[#3D4454] transition-colors rounded-none cursor-pointer hidden sm:block"
          title="Mode Layar Penuh"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* Quick External Portals Navigation */}
        <div className="hidden xl:flex items-center gap-1.5 border-l border-[#3D4454] pl-2 text-[10px] font-mono">
          <a
            href="https://www.adafakta.web.id/admin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 bg-blue-950/60 hover:bg-blue-900 text-blue-300 border border-blue-800 transition-colors"
            title="Buka Web Admin AdaFakta"
          >
            <span>AdaFakta</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a
            href="https://bottelejurnalis.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition-colors"
            title="Buka Bot Jurnalis Radar"
          >
            <span>Radar Bot</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        {/* Admin Profile Monochromatic Badge */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-[#3D4454]">
          <div className="w-6 h-6 rounded-none bg-[#313744] text-neutral-200 flex items-center justify-center text-[10px] font-mono font-bold border border-[#5A6478]">
            AD
          </div>
        </div>
      </div>
    </header>
  );
};
