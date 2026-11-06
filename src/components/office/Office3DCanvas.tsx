'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OfficeScene } from '@/three/OfficeScene';
import { useOfficeStore } from '@/store/officeStore';
import { soundManager } from '@/services/audio/soundManager';
import { eventBridge } from '@/services/live/eventBridge';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { ArticleReaderModal } from '@/components/dashboard/ArticleReaderModal';
import { OfficeEventBanner } from './OfficeEventBanner';
import { CameraNavGizmo } from './CameraNavGizmo';
import {
  Compass,
  Monitor,
  Coffee,
  Server,
  Bot,
  Gamepad2,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Hand,
  RotateCw,
  Volume2,
  VolumeX,
  Sun,
  Sunset,
  Moon,
  Zap,
  AlertTriangle
} from 'lucide-react';

const LoadingFallback = () => (
  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0A0A0A] text-white select-none">
    <div className="w-10 h-10 mb-4 bg-white text-black flex items-center justify-center font-mono font-black text-xs">
      HQ
    </div>
    <h3 className="text-xs font-mono font-black tracking-widest text-white uppercase">
      LOADING 3D ARCHITECTURAL DIORAMA
    </h3>
    <p className="text-[10px] text-neutral-500 font-mono mt-1">
      INITIALIZING WORKSTATIONS & BREAKROOM...
    </p>
  </div>
);

export const Office3DCanvas: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [showStats, setShowStats] = useState(true);

  const movementMode = useOfficeStore((state) => state.movementMode);
  const setMovementMode = useOfficeStore((state) => state.setMovementMode);
  const cameraPreset = useOfficeStore((state) => state.cameraPreset);
  const setCameraPreset = useOfficeStore((state) => state.setCameraPreset);
  const cameraInteractionMode = useOfficeStore((state) => state.cameraInteractionMode);
  const setCameraInteractionMode = useOfficeStore((state) => state.setCameraInteractionMode);
  const controlledAgentId = useOfficeStore((state) => state.controlledAgentId);
  const setControlledAgentId = useOfficeStore((state) => state.setControlledAgentId);
  const cameraFollowPlayer = useOfficeStore((state) => state.cameraFollowPlayer);
  const setCameraFollowPlayer = useOfficeStore((state) => state.setCameraFollowPlayer);
  const agents = useOfficeStore((state) => state.agents);

  const dataMode = useOfficeStore((state) => state.dataMode);
  const toggleDataMode = useOfficeStore((state) => state.toggleDataMode);
  const timeOfDay = useOfficeStore((state) => state.timeOfDay);
  const cycleTimeOfDay = useOfficeStore((state) => state.cycleTimeOfDay);
  const isAutonomousMode = useOfficeStore((state) => state.isAutonomousMode);
  const toggleAutonomousMode = useOfficeStore((state) => state.toggleAutonomousMode);
  const incidentAlert = useOfficeStore((state) => state.incidentAlert);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(soundManager.isSoundMuted());
  }, []);

  const handleToggleSound = () => {
    const nextActive = soundManager.toggleSound();
    setIsMuted(!nextActive);
  };

  const handleToggleAutonomous = () => {
    toggleAutonomousMode();
    const nextActive = !isAutonomousMode;
    if (nextActive) {
      eventBridge.startAutonomousCycle();
    } else {
      eventBridge.stopAutonomousCycle();
    }
  };

  useEffect(() => {
    setMounted(true);
    eventBridge.initCountdownTicker();
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebGlSupported(false);
    } catch {
      setWebGlSupported(false);
    }
  }, []);

  if (!mounted) return <LoadingFallback />;

  if (!webGlSupported) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0A0A0A] p-8 text-center text-white font-mono">
        <h3 className="text-sm font-bold text-white mb-2">WEBGL REQUIRED</h3>
        <p className="text-xs text-neutral-400">
          Please enable hardware acceleration in your browser settings.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#1E222A] overflow-hidden select-none">
      {/* 3D CANVAS */}
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          shadows
          camera={{
            position: [17, 18, 17],
            fov: 36,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            alpha: false
          }}
          className={`w-full h-full ${
            cameraInteractionMode === 'PAN'
              ? 'cursor-grab active:cursor-grabbing'
              : 'cursor-default active:cursor-grabbing'
          }`}
        >
          {/* Architectural Fresh Studio Canvas Backdrop - Luminous Soft Charcoal */}
          <color attach="background" args={['#2A2E38']} />
          <OfficeScene />
        </Canvas>
      </Suspense>

      {/* UNIFIED ARCHITECTURAL FLOATING HUD */}
      <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-4 sm:right-4 z-10 pointer-events-none flex flex-col items-center">
        <div className="w-full max-w-6xl pointer-events-auto space-y-1.5 sm:space-y-2">
          {/* Incident Alert Banner if active */}
          {incidentAlert.active && (
            <div className="w-full bg-red-950/90 border border-red-500 p-1.5 px-3 flex items-center justify-between text-xs text-red-200 font-mono font-bold animate-pulse shadow-xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>INCIDENT ALERT: {incidentAlert.message}</span>
              </div>
              <span className="text-[10px] text-red-400">WATCHDOG AUTO-RETRYING</span>
            </div>
          )}

          {/* Row 1: Camera Preset Toolbar & Mode Switcher */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 bg-[#262B35] border border-[#3D4454] p-1 font-mono overflow-x-auto shadow-xl">
            {/* Camera Presets: Dual Wing Navigation */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] text-slate-400 px-1.5 font-bold uppercase tracking-wider hidden md:inline">
                VIEW:
              </span>

              <button
                onClick={() => setCameraPreset('ISOMETRIC')}
                className={`px-2 py-1 text-xs font-bold rounded-none transition-colors flex items-center gap-1 border cursor-pointer shrink-0 ${
                  cameraPreset === 'ISOMETRIC'
                    ? 'bg-[#475569] text-white border-[#64748B]'
                    : 'text-slate-300 border-transparent hover:text-white hover:bg-[#313744]'
                }`}
                title="Lihat seluruh kantor dual-wing (Sayap Barat, Tengah, dan Sayap Timur)"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>SELURUH HQ</span>
              </button>

              <button
                onClick={() => setCameraPreset('WORKSTATIONS')}
                className={`px-2 py-1 text-xs font-bold rounded-none transition-colors flex items-center gap-1 border cursor-pointer shrink-0 ${
                  cameraPreset === 'WORKSTATIONS'
                    ? 'bg-blue-900/80 text-white border-blue-500'
                    : 'text-slate-300 border-transparent hover:text-white hover:bg-[#313744]'
                }`}
                title="Fokus ke Sayap Barat: Meja Redaksi AdaFakta"
              >
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                <span>REDAKSI</span>
              </button>

              <button
                onClick={() => setCameraPreset('STUDIO_FOTO')}
                className={`px-2 py-1 text-xs font-bold rounded-none transition-colors flex items-center gap-1 border cursor-pointer shrink-0 ${
                  cameraPreset === 'STUDIO_FOTO'
                    ? 'bg-[#475569] text-white border-[#64748B]'
                    : 'text-slate-300 border-transparent hover:text-white hover:bg-[#313744]'
                }`}
                title="Fokus ke Area Tengah: Kedai Kopi Tarak & Lounge Santai"
              >
                <Coffee className="w-3.5 h-3.5 text-amber-400" />
                <span>KOPI TARAK</span>
              </button>

              <button
                onClick={() => setCameraPreset('SENTRY_SERVER')}
                className={`px-2 py-1 text-xs font-bold rounded-none transition-colors flex items-center gap-1 border cursor-pointer shrink-0 ${
                  cameraPreset === 'SENTRY_SERVER'
                    ? 'bg-emerald-950 text-white border-emerald-500'
                    : 'text-slate-300 border-transparent hover:text-white hover:bg-[#313744]'
                }`}
                title="Fokus ke Sayap Timur: Meja Radar Intel & Bot Jurnalis"
              >
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                <span>RADAR BOT</span>
              </button>
            </div>

            {/* Central Quick Automation & Ambience Controls */}
            <div className="flex items-center gap-1 shrink-0">
              {/* OTONOM PIPELINE TOGGLE */}
              <button
                onClick={handleToggleAutonomous}
                className={`px-2 py-1 text-xs font-bold rounded-none transition-all flex items-center gap-1 border cursor-pointer ${
                  isAutonomousMode
                    ? 'bg-amber-500 text-black border-amber-300 font-black shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                    : 'text-slate-300 border-[#3D4454] bg-[#20242C] hover:text-white'
                }`}
                title="Siklus Redaksi Berjalan Otomatis Mandiri"
              >
                <Zap className={`w-3.5 h-3.5 ${isAutonomousMode ? 'animate-pulse text-black fill-current' : 'text-amber-400'}`} />
                <span className="hidden sm:inline">OTONOM: {isAutonomousMode ? 'ON' : 'OFF'}</span>
                <span className="sm:hidden">AUTO</span>
              </button>

              {/* TIME OF DAY CYCLE */}
              <button
                onClick={cycleTimeOfDay}
                className="px-2 py-1 text-xs font-bold rounded-none transition-colors flex items-center gap-1 border border-[#3D4454] bg-[#20242C] text-slate-300 hover:text-white cursor-pointer"
                title={`Siklus Waktu: ${timeOfDay} (Klik untuk ganti Siang/Sore/Lembur)`}
              >
                {timeOfDay === 'DAY' && <Sun className="w-3.5 h-3.5 text-amber-300" />}
                {timeOfDay === 'SUNSET' && <Sunset className="w-3.5 h-3.5 text-orange-400" />}
                {timeOfDay === 'NIGHT' && <Moon className="w-3.5 h-3.5 text-sky-400" />}
                <span className="hidden sm:inline">
                  {timeOfDay === 'DAY' ? 'SIANG' : timeOfDay === 'SUNSET' ? 'SORE' : 'LEMBUR'}
                </span>
              </button>

              {/* SOUND TOGGLE */}
              <button
                onClick={handleToggleSound}
                className={`p-1.5 text-xs font-bold rounded-none transition-colors flex items-center justify-center border border-[#3D4454] cursor-pointer ${
                  isMuted ? 'text-slate-500 bg-[#20242C]' : 'text-emerald-400 bg-[#20242C]'
                }`}
                title={isMuted ? 'Unmute Suara Ambience' : 'Mute Suara Ambience'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              {/* DUAL DATA MODE */}
              <button
                onClick={toggleDataMode}
                className={`px-1.5 sm:px-2 py-0.5 text-[10px] font-bold rounded-none border transition-colors cursor-pointer ${
                  dataMode === 'LIVE'
                    ? 'bg-rose-950 text-rose-300 border-rose-600'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-600'
                }`}
                title="Ganti Mode: Live Production vs Demo Sandbox"
              >
                {dataMode === 'LIVE' ? '🔴 LIVE' : '🟢 DEMO'}
              </button>
            </div>

            {/* Mode Switcher, Camera Control Mode & Stats Toggle */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Quick Camera Navigation Mode: GESER vs PUTAR */}
              <div className="flex items-center bg-[#20242C] p-0.5 border border-[#3D4454]">
                <button
                  onClick={() => setCameraInteractionMode('PAN')}
                  className={`px-1.5 sm:px-2 py-0.5 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                    cameraInteractionMode === 'PAN'
                      ? 'bg-[#475569] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mode Geser (Pan): Klik & seret mouse untuk menggeser kantor"
                >
                  <Hand className="w-3 h-3" />
                  <span className="hidden sm:inline">GESER</span>
                </button>
                <button
                  onClick={() => setCameraInteractionMode('ORBIT')}
                  className={`px-1.5 sm:px-2 py-0.5 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                    cameraInteractionMode === 'ORBIT'
                      ? 'bg-[#475569] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Mode Putar (Orbit): Klik & seret mouse untuk memutar sudut 3D"
                >
                  <RotateCw className="w-3 h-3" />
                  <span className="hidden sm:inline">PUTAR</span>
                </button>
              </div>

              <div className="w-[1px] h-3.5 bg-[#3D4454] mx-0.5 hidden sm:block" />

              <button
                onClick={() => setMovementMode('AUTOMATIC')}
                className={`px-2 py-1 text-xs font-bold rounded-none transition-colors flex items-center gap-1 border cursor-pointer ${
                  movementMode === 'AUTOMATIC'
                    ? 'bg-[#475569] text-white border-[#64748B]'
                    : 'text-slate-300 border-transparent hover:text-white hover:bg-[#313744]'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">AUTO SIM</span>
                <span className="sm:hidden">AUTO</span>
              </button>

              <button
                onClick={() => setMovementMode('MANUAL')}
                className={`px-2 py-1 text-xs font-bold rounded-none transition-colors flex items-center gap-1 border cursor-pointer ${
                  movementMode === 'MANUAL'
                    ? 'bg-[#475569] text-white border-[#64748B]'
                    : 'text-slate-300 border-transparent hover:text-white hover:bg-[#313744]'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">MANUAL WASD</span>
                <span className="sm:hidden">WASD</span>
              </button>

              {/* Stats Overlay Collapse/Expand Toggle */}
              <button
                onClick={() => setShowStats(!showStats)}
                className={`px-1.5 sm:px-2 py-1 text-xs font-bold rounded-none transition-colors flex items-center gap-1 border cursor-pointer ${
                  showStats
                    ? 'bg-[#313744] text-white border-[#5A6478]'
                    : 'bg-[#262B35] text-slate-400 border-[#3D4454] hover:text-white'
                }`}
                title={showStats ? 'Sembunyikan Kartu Stats' : 'Tampilkan Kartu Stats'}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">STATS</span>
                {showStats ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Row 2: Live Minimalist Industrial Stats Overview (Collapsible on Mobile) */}
          {showStats && (
            <div className="animate-in fade-in duration-150">
              <StatsOverview />
            </div>
          )}
        </div>
      </div>

      {/* WASD MANUAL CONTROLS HUD */}
      {movementMode === 'MANUAL' && (
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-10 p-2.5 sm:p-3 bg-[#262B35] border border-[#3D4454] rounded-none text-white max-w-[280px] sm:max-w-xs font-mono shadow-2xl animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#3D4454]">
            <div className="flex items-center gap-1.5 text-white font-bold text-xs">
              <Gamepad2 className="w-3.5 h-3.5 text-slate-300" />
              <span>ROBLOX MANUAL RIG</span>
            </div>
            <span className="text-[9px] px-1 py-0.2 bg-[#475569] text-white border border-[#64748B] font-bold">
              WASD
            </span>
          </div>

          <div className="text-xs space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px]">AVATAR:</span>
              <select
                value={controlledAgentId}
                onChange={(e) => setControlledAgentId(e.target.value as any)}
                className="bg-[#313744] border border-[#3D4454] rounded-none px-1.5 py-0.5 text-white text-xs font-bold outline-none cursor-pointer max-w-[170px] truncate"
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} [{a.status === 'working' ? 'KERJA' : 'NYANTAI'}]
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[10px]">CHASE CAM:</span>
              <button
                onClick={() => setCameraFollowPlayer(!cameraFollowPlayer)}
                className={`px-2 py-0.5 text-[10px] rounded-none font-bold border transition-colors cursor-pointer ${
                  cameraFollowPlayer
                    ? 'bg-[#475569] text-white border-[#64748B]'
                    : 'bg-[#313744] text-slate-400 border-[#3D4454]'
                }`}
              >
                {cameraFollowPlayer ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-[#3D4454] flex flex-col items-center gap-1">
            <div className="w-6 h-6 flex items-center justify-center bg-[#313744] border border-[#5A6478] rounded-none text-xs font-bold text-white">
              W
            </div>
            <div className="flex gap-1">
              <div className="w-6 h-6 flex items-center justify-center bg-[#313744] border border-[#5A6478] rounded-none text-xs font-bold text-white">
                A
              </div>
              <div className="w-6 h-6 flex items-center justify-center bg-[#313744] border border-[#5A6478] rounded-none text-xs font-bold text-white">
                S
              </div>
              <div className="w-6 h-6 flex items-center justify-center bg-[#313744] border border-[#5A6478] rounded-none text-xs font-bold text-white">
                D
              </div>
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5 text-center font-mono">
              Use WASD keys to walk
            </p>
          </div>
        </div>
      )}

      {/* ON-SCREEN NAVIGATION GIZMO (D-PAD & ZOOM CONTROLS) */}
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-10">
        <CameraNavGizmo />
      </div>

      {/* QUICK INSTRUCTION HINT BAR AT BOTTOM CENTER */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 hidden lg:flex items-center gap-3 px-3 py-1 bg-[#262B35]/95 border border-[#3D4454] rounded-none text-[10px] font-mono text-slate-200 pointer-events-none shadow-lg">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-none bg-slate-300" />
          <span>DRAG / PANAH: GESER KANTOR</span>
        </span>
        <span className="text-slate-500">//</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-none bg-slate-400" />
          <span>SCROLL: ZOOM IN/OUT</span>
        </span>
        <span className="text-slate-500">//</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-none bg-slate-300" />
          <span>KLIK AGEN: KERJA // NYANTAI</span>
        </span>
      </div>

      {/* FLOATING EVENT BANNER & SPEECH BUBBLE OVERLAY */}
      <OfficeEventBanner />

      {/* ARTICLE READER MODAL (5W+1H FULL PREVIEW) */}
      <ArticleReaderModal />
    </div>
  );
};
