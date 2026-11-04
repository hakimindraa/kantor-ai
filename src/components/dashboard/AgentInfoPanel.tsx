'use client';

import React from 'react';
import { useOfficeStore } from '@/store/officeStore';
import {
  X,
  Play,
  Pause,
  MessageSquare,
  Gamepad2,
  Focus,
  Sliders,
  Zap,
  Brain,
  Rocket,
  Coffee,
  Laptop
} from 'lucide-react';

export const AgentInfoPanel: React.FC = () => {
  const selectedAgentId = useOfficeStore((state) => state.selectedAgentId);
  const selectAgent = useOfficeStore((state) => state.selectAgent);
  const agents = useOfficeStore((state) => state.agents);
  const updateAgentStatus = useOfficeStore((state) => state.updateAgentStatus);
  const openBriefModal = useOfficeStore((state) => state.openBriefModal);
  const setMovementMode = useOfficeStore((state) => state.setMovementMode);
  const setControlledAgentId = useOfficeStore((state) => state.setControlledAgentId);
  const setCameraPreset = useOfficeStore((state) => state.setCameraPreset);
  const addActivityLog = useOfficeStore((state) => state.addActivityLog);

  // Admin Override Controls State
  const adminOverrides = useOfficeStore((state) => state.adminOverrides);
  const setAdminOverride = useOfficeStore((state) => state.setAdminOverride);

  if (!selectedAgentId) return null;

  const agent = agents.find((a) => a.id === selectedAgentId);
  if (!agent) return null;

  const isPaused = agent.status === 'paused';
  const isWorking = agent.status === 'working';
  const toggleAgentWorkChill = useOfficeStore((state) => state.toggleAgentWorkChill);

  const handleTogglePause = () => {
    const nextStatus = isPaused ? 'active' : 'paused';
    updateAgentStatus(agent.id, nextStatus);
    addActivityLog({
      agentId: agent.id,
      agentName: agent.name,
      agentColor: '#FAFAFA',
      category: 'editorial',
      level: isPaused ? 'success' : 'warning',
      message: `Status agent ${agent.name} diubah menjadi: ${nextStatus.toUpperCase()}`
    });
  };

  const handleTakeControl = () => {
    setControlledAgentId(agent.id);
    setMovementMode('MANUAL');
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        onClick={() => selectAgent(null)}
        className="fixed inset-0 bg-black/80 z-30 md:hidden animate-in fade-in duration-150"
      />

      <aside className="fixed inset-y-0 right-0 z-40 w-full sm:w-92 md:relative md:inset-auto md:z-20 md:w-92 h-full bg-[#262B35] border-l border-[#3D4454] p-4 flex flex-col justify-between shrink-0 overflow-y-auto select-none animate-in slide-in-from-right duration-200">
        <div>
          {/* Top Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#3D4454]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-none bg-neutral-200" />
              <span className="text-[10px] font-mono font-bold text-white tracking-widest uppercase">
                TELEMETRY // {agent.name}
              </span>
            </div>

            <button
              onClick={() => selectAgent(null)}
              className="p-1 rounded-none hover:bg-[#313744] text-neutral-300 hover:text-white transition-colors cursor-pointer border border-[#3D4454] hover:border-[#5A6478]"
              title="Tutup Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        {/* Profile Card */}
        <div className="mt-3 p-3.5 bg-[#1E222A] border border-[#3D4454] rounded-none">
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-none flex items-center justify-center font-mono font-black text-sm shrink-0 border tracking-wider text-slate-900"
              style={{ backgroundColor: agent.accentColor, borderColor: agent.color }}
            >
              {agent.name.substring(0, 2)}
            </div>

            <div className="flex-1 min-w-0 font-mono">
              <div className="flex items-center justify-between gap-1">
                <h3 className="text-sm font-black text-white tracking-wider truncate">
                  {agent.name}
                </h3>
                <span
                  className="text-[9px] uppercase px-1.5 py-0.5 rounded-none font-bold"
                  style={
                    isWorking
                      ? { backgroundColor: agent.color, color: '#FFFFFF' }
                      : { border: '1px solid #5A6478', backgroundColor: '#2B303C', color: '#CBD5E1' }
                  }
                >
                  {isWorking ? 'KERJA' : 'NYANTAI'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-300 font-semibold truncate mt-0.5">{agent.role}</p>
              <p className="text-[10px] text-neutral-400 truncate">{agent.department}</p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#3D4454] flex items-center justify-between text-[10px] font-mono">
            <span className="text-neutral-400">ENDPOINT:</span>
            <span className="text-neutral-200 font-semibold truncate max-w-[190px]">
              {agent.endpoint}
            </span>
          </div>
        </div>

        {/* ================= SAKELAR KENDALI MANDOR (ADMIN OVERRIDES) ================= */}
        <div className="mt-3 p-3 bg-[#1E222A] border border-[#3D4454] rounded-none space-y-3 font-mono">
          <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-wider pb-1.5 border-b border-[#3D4454]">
            <Sliders className="w-3.5 h-3.5 text-neutral-300" />
            <span>MANDOR OVERRIDE CONTROLS</span>
          </div>

          {/* SCRIBE CONTROLS */}
          {agent.id === 'scribe' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-300 text-[10px] uppercase font-bold block mb-1.5">
                  AI Model Engine:
                </label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setAdminOverride('scribeModel', 'gemini-3.8-flash')}
                    className={`py-1.5 px-2 rounded-none text-[10px] font-mono font-bold flex flex-col items-center gap-1 border transition-colors cursor-pointer ${
                      adminOverrides.scribeModel === 'gemini-3.8-flash'
                        ? 'bg-[#E2E8F0] text-black border-[#E2E8F0]'
                        : 'bg-[#2B303C] text-neutral-300 border-[#3D4454] hover:text-white hover:border-[#5A6478]'
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    <span>Gemini 3.8</span>
                  </button>

                  <button
                    onClick={() => setAdminOverride('scribeModel', 'claude-opus-thinking')}
                    className={`py-1.5 px-2 rounded-none text-[10px] font-mono font-bold flex flex-col items-center gap-1 border transition-colors cursor-pointer ${
                      adminOverrides.scribeModel === 'claude-opus-thinking'
                        ? 'bg-[#E2E8F0] text-black border-[#E2E8F0]'
                        : 'bg-[#2B303C] text-neutral-300 border-[#3D4454] hover:text-white hover:border-[#5A6478]'
                    }`}
                  >
                    <Brain className="w-3 h-3" />
                    <span>Claude Opus</span>
                  </button>

                  <button
                    onClick={() => setAdminOverride('scribeModel', 'groq-gpt-oss')}
                    className={`py-1.5 px-2 rounded-none text-[10px] font-mono font-bold flex flex-col items-center gap-1 border transition-colors cursor-pointer ${
                      adminOverrides.scribeModel === 'groq-gpt-oss'
                        ? 'bg-[#E2E8F0] text-black border-[#E2E8F0]'
                        : 'bg-[#2B303C] text-neutral-300 border-[#3D4454] hover:text-white hover:border-[#5A6478]'
                    }`}
                  >
                    <Rocket className="w-3 h-3" />
                    <span>Groq 120B</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-neutral-400">TARGET WORD COUNT:</span>
                  <span className="text-white font-bold tabular-nums">
                    {adminOverrides.scribeWordTarget} WORDS
                  </span>
                </div>
                <input
                  type="range"
                  min={350}
                  max={600}
                  step={25}
                  value={adminOverrides.scribeWordTarget}
                  onChange={(e) => setAdminOverride('scribeWordTarget', Number(e.target.value))}
                  className="w-full accent-[#E2E8F0] h-1 bg-[#3D4454] rounded-none cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-400 text-[10px]">INTERNAL LINKING:</span>
                <button
                  onClick={() => setAdminOverride('scribeInternalLinks', !adminOverrides.scribeInternalLinks)}
                  className={`px-2 py-0.5 rounded-none text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                    adminOverrides.scribeInternalLinks
                      ? 'bg-[#E2E8F0] text-black border-[#E2E8F0]'
                      : 'bg-[#2B303C] text-neutral-300 border-[#3D4454]'
                  }`}
                >
                  {adminOverrides.scribeInternalLinks ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>
          )}

          {/* PIXEL CONTROLS */}
          {agent.id === 'pixel' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-neutral-200 text-[10px] font-bold">AUTO COVER SCRAPER:</div>
                  <div className="text-[9px] text-neutral-400">Auto landscape HD photo extraction</div>
                </div>
                <button
                  onClick={() => setAdminOverride('pixelAutoScrape', !adminOverrides.pixelAutoScrape)}
                  className={`px-2.5 py-0.5 rounded-none text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                    adminOverrides.pixelAutoScrape
                      ? 'bg-[#E2E8F0] text-black border-[#E2E8F0]'
                      : 'bg-[#2B303C] text-neutral-300 border-[#3D4454]'
                  }`}
                >
                  {adminOverrides.pixelAutoScrape ? 'AUTO' : 'MANUAL'}
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] mb-1">
                  <span className="text-neutral-400">MAX WEBP SIZE:</span>
                  <span className="text-white font-bold tabular-nums">
                    &lt; {adminOverrides.pixelTargetWebpKb} KB
                  </span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={95}
                  step={5}
                  value={adminOverrides.pixelTargetWebpKb}
                  onChange={(e) => setAdminOverride('pixelTargetWebpKb', Number(e.target.value))}
                  className="w-full accent-[#E2E8F0] h-1 bg-[#3D4454] rounded-none cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-400 text-[10px]">IMGBB CDN STORAGE:</span>
                <button
                  onClick={() => setAdminOverride('pixelImgbbCdn', !adminOverrides.pixelImgbbCdn)}
                  className={`px-2 py-0.5 rounded-none text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                    adminOverrides.pixelImgbbCdn
                      ? 'bg-[#E2E8F0] text-black border-[#E2E8F0]'
                      : 'bg-[#2B303C] text-neutral-300 border-[#3D4454]'
                  }`}
                >
                  {adminOverrides.pixelImgbbCdn ? 'ACTIVE' : 'OFF'}
                </button>
              </div>
            </div>
          )}

          {/* CHRONOS CONTROLS */}
          {agent.id === 'chronos' && (
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-300 text-[10px] uppercase font-bold block mb-1.5">
                  WATERFALL PACING INTERVAL:
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {[30, 45, 60, 90].map((gap) => (
                    <button
                      key={gap}
                      onClick={() => setAdminOverride('chronosWaterfallGapMinutes', gap)}
                      className={`py-1 rounded-none text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                        adminOverrides.chronosWaterfallGapMinutes === gap
                          ? 'bg-[#E2E8F0] text-black border-[#E2E8F0]'
                          : 'bg-[#2B303C] text-neutral-300 border-[#3D4454] hover:text-white hover:border-[#5A6478]'
                      }`}
                    >
                      {gap}M
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-400 text-[10px]">WATERFALL AUTO-QUEUE:</span>
                <button
                  onClick={() => setAdminOverride('chronosAutoQueueActive', !adminOverrides.chronosAutoQueueActive)}
                  className={`px-2 py-0.5 rounded-none text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                    adminOverrides.chronosAutoQueueActive
                      ? 'bg-[#E2E8F0] text-black border-[#E2E8F0]'
                      : 'bg-[#2B303C] text-neutral-300 border-[#3D4454]'
                  }`}
                >
                  {adminOverrides.chronosAutoQueueActive ? 'RUNNING' : 'PAUSED'}
                </button>
              </div>
            </div>
          )}

          {/* HERMES CONTROLS */}
          {agent.id === 'hermes' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-neutral-200 text-[10px] font-bold">TELEGRAM DISPATCH:</div>
                  <div className="text-[9px] text-neutral-400 truncate max-w-[140px]">{adminOverrides.hermesTargetChannel}</div>
                </div>
                <button
                  onClick={() => setAdminOverride('hermesTelegramAlerts', !adminOverrides.hermesTelegramAlerts)}
                  className={`px-2.5 py-0.5 rounded-none text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                    adminOverrides.hermesTelegramAlerts
                      ? 'bg-[#E2E8F0] text-black border-[#E2E8F0]'
                      : 'bg-[#2B303C] text-neutral-300 border-[#3D4454]'
                  }`}
                >
                  {adminOverrides.hermesTelegramAlerts ? 'ACTIVE' : 'MUTE'}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-400 text-[10px]">INLINE APPROVAL:</span>
                <button
                  onClick={() => setAdminOverride('hermesApprovalButtons', !adminOverrides.hermesApprovalButtons)}
                  className={`px-2 py-0.5 rounded-none text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                    adminOverrides.hermesApprovalButtons
                      ? 'bg-[#E2E8F0] text-black border-[#E2E8F0]'
                      : 'bg-[#2B303C] text-neutral-300 border-[#3D4454]'
                  }`}
                >
                  {adminOverrides.hermesApprovalButtons ? 'ENABLED' : 'OFF'}
                </button>
              </div>
            </div>
          )}

          {/* SENTRY CONTROLS */}
          {agent.id === 'sentry' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-neutral-200 text-[10px] font-bold">AUTO-PURGE CRON:</div>
                  <div className="text-[9px] text-neutral-400">24-hour temporary logs cleanup</div>
                </div>
                <button
                  onClick={() => setAdminOverride('sentryAutoPurge', !adminOverrides.sentryAutoPurge)}
                  className={`px-2.5 py-0.5 rounded-none text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                    adminOverrides.sentryAutoPurge
                      ? 'bg-[#E2E8F0] text-black border-[#E2E8F0]'
                      : 'bg-[#2B303C] text-neutral-300 border-[#3D4454]'
                  }`}
                >
                  {adminOverrides.sentryAutoPurge ? 'ACTIVE' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-400 text-[10px]">POOLER WATCHDOG:</span>
                <span className="text-white font-mono text-[10px] font-bold">22MS STABLE</span>
              </div>
            </div>
          )}

          {/* SCOUT CONTROLS */}
          {agent.id === 'scout' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-neutral-200 text-[10px] font-bold">AUTO-INGEST FEED:</div>
                  <div className="text-[9px] text-neutral-400">Antara, Detik, Kompas, BMKG</div>
                </div>
                <button
                  onClick={() => setAdminOverride('scoutAutoIngest', !adminOverrides.scoutAutoIngest)}
                  className={`px-2.5 py-0.5 rounded-none text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                    adminOverrides.scoutAutoIngest
                      ? 'bg-[#E2E8F0] text-black border-[#E2E8F0]'
                      : 'bg-[#2B303C] text-neutral-300 border-[#3D4454]'
                  }`}
                >
                  {adminOverrides.scoutAutoIngest ? 'LIVE' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-400 text-[10px]">DEDUPLICATION:</span>
                <button
                  onClick={() => setAdminOverride('scoutDeduplication', !adminOverrides.scoutDeduplication)}
                  className={`px-2 py-0.5 rounded-none text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                    adminOverrides.scoutDeduplication
                      ? 'bg-[#E2E8F0] text-black border-[#E2E8F0]'
                      : 'bg-[#2B303C] text-neutral-300 border-[#3D4454]'
                  }`}
                >
                  {adminOverrides.scoutDeduplication ? 'ENABLED' : 'OFF'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Activity Display */}
        <div className="mt-3 p-3 bg-[#1E222A] border border-[#3D4454] rounded-none space-y-1.5 font-mono">
          <div className="text-neutral-400 text-[10px] font-bold uppercase">CURRENT EXECUTION:</div>
          <p className="text-xs text-neutral-200 bg-[#262B35] p-2.5 border border-[#3D4454] rounded-none leading-relaxed">
            {agent.currentActivity}
          </p>
          <div className="flex items-center justify-between text-[9px] text-neutral-400 pt-1">
            <span>LAST ACTIVE: {agent.lastActive}</span>
            <span className="tabular-nums">PROGRESS: {agent.progress}%</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 mt-3 border-t border-[#3D4454] space-y-2 font-mono">
        {/* Big Work vs Chill Toggle Button */}
        <button
          onClick={() => toggleAgentWorkChill(agent.id)}
          className={`w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold transition-colors cursor-pointer border rounded-none ${
            isWorking
              ? 'bg-[#E2E8F0] text-black border-[#E2E8F0] hover:bg-white'
              : 'bg-[#313744] text-white border-[#5A6478] hover:bg-[#3D4454]'
          }`}
        >
          {isWorking ? <Coffee className="w-3.5 h-3.5" /> : <Laptop className="w-3.5 h-3.5" />}
          <span>{isWorking ? 'SURUH NYANTAI (BREAKROOM)' : 'TUGASKAN KERJA (MEJA PC)'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => openBriefModal(agent.id)}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#313744] hover:bg-[#3D4454] text-white border border-[#5A6478] text-xs font-bold transition-colors cursor-pointer rounded-none"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>BRIEF AGENT</span>
          </button>

          <button
            onClick={handleTogglePause}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-bold transition-colors cursor-pointer border rounded-none ${
              isPaused
                ? 'bg-[#E2E8F0] text-black border-[#E2E8F0]'
                : 'bg-[#313744] text-neutral-200 border-[#5A6478] hover:text-white hover:bg-[#3D4454]'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>
        </div>

        <button
          onClick={handleTakeControl}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-[#313744] hover:bg-[#3D4454] text-white border border-[#5A6478] font-bold text-xs transition-colors cursor-pointer rounded-none"
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>KENDALIKAN AVATAR (WASD)</span>
        </button>

        <button
          onClick={() => setCameraPreset('FOCUS_AGENT')}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-[#262B35] hover:bg-[#313744] text-neutral-300 hover:text-white text-xs border border-[#3D4454] transition-colors cursor-pointer rounded-none"
        >
          <Focus className="w-3.5 h-3.5" />
          <span>FOKUS KAMERA KE MEJA INI</span>
        </button>
      </div>
    </aside>
    </>
  );
};
