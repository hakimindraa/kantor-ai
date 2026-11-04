'use client';

import React from 'react';
import { Html } from '@react-three/drei';
import { useOfficeStore } from '@/store/officeStore';

export const VideoWall: React.FC = () => {
  const stats = useOfficeStore((state) => state.stats);
  const articles = useOfficeStore((state) => state.articles);
  const agents = useOfficeStore((state) => state.agents);
  const setCameraPreset = useOfficeStore((state) => state.setCameraPreset);
  const setActiveTab = useOfficeStore((state) => state.setActiveTab);

  return (
    <group position={[15.15, 2.4, 0]} rotation={[0, -Math.PI / 2, 0]}>
      {/* Backing Frame Box */}
      <mesh castShadow>
        <boxGeometry args={[11, 4.4, 0.15]} />
        <meshStandardMaterial color="#070D18" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Outer Cyan Neon Border */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[10.85, 4.25, 0.02]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>

      {/* Screen Face Mesh */}
      <mesh position={[0, 0, 0.09]}>
        <boxGeometry args={[10.7, 4.1, 0.02]} />
        <meshBasicMaterial color="#0A1120" />
      </mesh>

      {/* Interactive High-Def HTML Display Embedded on Wall */}
      <Html
        position={[0, 0, 0.11]}
        transform
        distanceFactor={7.5}
        scale={0.22}
      >
        <div className="w-[860px] h-[520px] bg-gradient-to-br from-[#080D1A] via-[#0E1A2E] to-[#0A1224] p-6 text-white select-none rounded-lg border-2 border-cyan-500/40 shadow-[0_0_30px_rgba(56,189,248,0.3)] flex flex-col justify-between font-sans">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌐</span>
              <div>
                <h1 className="text-2xl font-black tracking-wider text-white">LIVE NEWSROOM</h1>
                <p className="text-xs text-cyan-400 font-mono tracking-widest">AI AUTOMATION COMMAND MATRIX</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-red-600/30 border border-red-500 rounded-full">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold text-red-400 tracking-wider">● LIVE</span>
              </div>
              <div className="text-right font-mono text-xs text-slate-300">
                <div className="text-cyan-300 font-bold">20:30 WIB</div>
                <div className="text-[10px] text-slate-400">INDEXING ACTIVE</div>
              </div>
            </div>
          </div>

          {/* Center Main Content Grid */}
          <div className="grid grid-cols-12 gap-5 my-3 flex-1 items-center">
            
            {/* World Map & Activity Streams (Col 8) */}
            <div className="col-span-8 bg-[#0B1528]/80 border border-slate-700/60 rounded-xl p-4 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>GLOBAL RSS & INGESTION SOURCES</span>
                <span className="text-emerald-400 font-mono">48 FEEDS STREAMING</span>
              </div>

              {/* Simplified Geometric World Map Grid */}
              <div className="relative h-44 bg-[#070D18] rounded-lg border border-cyan-900/40 overflow-hidden p-2 flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Simulated Geolocation Signal Dots */}
                <div className="absolute top-1/3 left-1/4 flex flex-col items-center">
                  <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping opacity-75" />
                  <span className="text-[9px] font-mono text-cyan-300 mt-1">JAKARTA HUB</span>
                </div>
                <div className="absolute top-1/4 right-1/4 flex flex-col items-center">
                  <span className="w-3 h-3 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-[9px] font-mono text-purple-300 mt-1">TOKYO CLUSTER</span>
                </div>
                <div className="absolute bottom-1/3 left-1/3 flex flex-col items-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-mono text-emerald-300 mt-1">SINGAPORE DC</span>
                </div>

                <div className="text-center z-10">
                  <p className="text-sm font-semibold text-slate-200">KANTOR REDAKSI VIRTUAL TERINTEGRASI</p>
                  <p className="text-xs text-slate-400 font-mono mt-1">Real-time Neon Postgres Pooler • Latency: 24ms</p>
                </div>
              </div>

              {/* Live Ticker */}
              <div className="flex items-center gap-2 mt-3 bg-black/40 px-3 py-1.5 rounded text-xs border border-cyan-500/20">
                <span className="text-cyan-400 font-bold uppercase text-[10px]">TICKER:</span>
                <span className="text-slate-200 truncate">
                  {articles[0]?.title || 'Memantau sumber berita terbaru...'}
                </span>
              </div>
            </div>

            {/* Pipeline Tracker (Col 4) */}
            <div className="col-span-4 bg-[#0B1528]/80 border border-slate-700/60 rounded-xl p-4 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  NEWSROOM PIPELINE
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-cyan-950/40 border border-cyan-500/30">
                    <span className="font-semibold text-cyan-300">1. SCOUT</span>
                    <span className="text-emerald-400 font-bold">✓ ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-purple-950/40 border border-purple-500/30">
                    <span className="font-semibold text-purple-300">2. SCRIBE</span>
                    <span className="text-emerald-400 font-bold">✓ DRAFTING</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-amber-950/40 border border-amber-500/30">
                    <span className="font-semibold text-amber-300">3. PIXEL</span>
                    <span className="text-emerald-400 font-bold">✓ OPTIMIZING</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-blue-950/40 border border-blue-500/30">
                    <span className="font-semibold text-blue-300">4. CHRONOS</span>
                    <span className="text-cyan-400 font-bold">QUEUE: {stats.inQueue}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-emerald-950/40 border border-emerald-500/30">
                    <span className="font-semibold text-emerald-300">5. RADAR</span>
                    <span className="text-emerald-400 font-bold">✓ INDEXED</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('pipeline')}
                className="w-full mt-2 py-1.5 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400 text-cyan-200 text-xs font-bold rounded transition-all"
              >
                Buka Pipeline Board →
              </button>
            </div>
          </div>

          {/* Bottom Live Metrics */}
          <div className="grid grid-cols-4 gap-3 pt-3 border-t border-cyan-500/20">
            <div className="bg-[#0B1528]/90 border border-slate-700/60 rounded-lg p-2.5">
              <div className="text-[11px] text-slate-400">Articles Today</div>
              <div className="text-xl font-bold text-white mt-0.5">{stats.articlesToday}</div>
            </div>
            <div className="bg-[#0B1528]/90 border border-slate-700/60 rounded-lg p-2.5">
              <div className="text-[11px] text-slate-400">In Publishing Queue</div>
              <div className="text-xl font-bold text-blue-400 mt-0.5">{stats.inQueue}</div>
            </div>
            <div className="bg-[#0B1528]/90 border border-slate-700/60 rounded-lg p-2.5">
              <div className="text-[11px] text-slate-400">Published Today</div>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">{stats.publishedToday}</div>
            </div>
            <div className="bg-[#0B1528]/90 border border-slate-700/60 rounded-lg p-2.5">
              <div className="text-[11px] text-slate-400">Next Scheduled</div>
              <div className="text-xl font-bold text-cyan-400 mt-0.5">{stats.nextPublishTime}</div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};

