'use client';

import React, { useEffect } from 'react';
import { useOfficeStore } from '@/store/officeStore';
import { AgentId } from '@/types/agent';
import { SIMULATION_TEMPLATES } from '@/services/mock/mockActivities';
import {
  Play,
  Pause,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';

export const LiveActivityView: React.FC = () => {
  const activityLogs = useOfficeStore((state) => state.activityLogs);
  const logFilter = useOfficeStore((state) => state.logFilter);
  const setLogFilter = useOfficeStore((state) => state.setLogFilter);
  const isStreamPaused = useOfficeStore((state) => state.isStreamPaused);
  const toggleStreamPaused = useOfficeStore((state) => state.toggleStreamPaused);
  const addActivityLog = useOfficeStore((state) => state.addActivityLog);
  const selectAgent = useOfficeStore((state) => state.selectAgent);
  const setActiveTab = useOfficeStore((state) => state.setActiveTab);
  const agents = useOfficeStore((state) => state.agents);

  // Background simulation tick (generates dynamic log every 4-6 seconds if not paused)
  useEffect(() => {
    if (isStreamPaused) return;

    const interval = setInterval(() => {
      const activeAgents = [
        'scout',
        'scribe',
        'pixel',
        'chronos',
        'hermes',
        'radar',
        'sentry',
        'veritas',
        'telebot',
        'cipher',
        'gentra',
        'gaia',
        'artha',
        'scout_west',
        'sadur',
        'nova',
        'hrd',
        'robosweep'
      ] as AgentId[];
      const pickedAgentId = activeAgents[Math.floor(Math.random() * activeAgents.length)];
      const templates = SIMULATION_TEMPLATES[pickedAgentId];
      if (!templates) return;

      const randomMsg = templates[Math.floor(Math.random() * templates.length)];
      const agent = agents.find((a) => a.id === pickedAgentId);

      const categories: Record<AgentId, any> = {
        scout: 'fetch',
        scribe: 'editorial',
        pixel: 'multimedia',
        chronos: 'publishing',
        hermes: 'distribution',
        radar: 'seo',
        sentry: 'infrastructure',
        receptionist: 'editorial',
        chief: 'editorial',
        veritas: 'editorial',
        telebot: 'distribution',
        cipher: 'editorial',
        gentra: 'editorial',
        gaia: 'editorial',
        artha: 'editorial',
        scout_west: 'fetch',
        sadur: 'editorial',
        nova: 'editorial',
        hrd: 'editorial',
        robosweep: 'infrastructure'
      };

      addActivityLog({
        agentId: pickedAgentId,
        agentName: agent ? agent.name : pickedAgentId.toUpperCase(),
        agentColor: '#FAFAFA',
        category: categories[pickedAgentId] || 'editorial',
        level: Math.random() > 0.8 ? 'success' : 'info',
        message: randomMsg
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isStreamPaused, agents, addActivityLog]);

  const filteredLogs = activityLogs.filter((log) => {
    if (logFilter === 'all') return true;
    return log.agentId === logFilter;
  });

  return (
    <div className="w-full h-full flex flex-col p-3 sm:p-6 overflow-hidden select-none bg-[#0A0A0A] font-mono">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-white uppercase tracking-wider">
              LIVE ACTIVITY STREAM
            </h1>
            <span className="px-2 py-0.5 rounded-none text-[10px] bg-white text-black font-bold">
              TELEMETRY LOGS
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Log telemetri aktivitas real-time dari ketujuh AI Agents di Virtual AI Newsroom HQ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Stream Pause / Play Toggle */}
          <button
            onClick={toggleStreamPaused}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-bold transition-colors cursor-pointer border ${
              isStreamPaused
                ? 'bg-white text-black border-white'
                : 'bg-[#181818] text-white border-[#333333] hover:bg-[#222222]'
            }`}
          >
            {isStreamPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isStreamPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs by Agent */}
      <div className="flex items-center gap-1 py-2 sm:py-3 border-b border-[#262626] overflow-x-auto shrink-0">
        <button
          onClick={() => setLogFilter('all')}
          className={`px-2.5 py-1 text-xs font-bold rounded-none transition-colors border cursor-pointer shrink-0 ${
            logFilter === 'all'
              ? 'bg-white text-black border-white'
              : 'bg-[#121212] text-neutral-400 border-[#262626] hover:text-white'
          }`}
        >
          ALL ({activityLogs.length})
        </button>

        {agents
          .filter((a) => a.id !== 'receptionist' && a.id !== 'chief')
          .map((agent) => (
            <button
              key={agent.id}
              onClick={() => setLogFilter(agent.id)}
              className={`px-2 py-1 text-xs font-bold rounded-none transition-colors border cursor-pointer shrink-0 ${
                logFilter === agent.id
                  ? 'bg-white text-black border-white'
                  : 'bg-[#121212] text-neutral-400 border-[#262626] hover:text-white'
              }`}
            >
              <span>{agent.name}</span>
            </button>
          ))}
      </div>

      {/* Main Logs List */}
      <div className="flex-1 overflow-y-auto py-3 space-y-1.5 pr-2">
        {filteredLogs.map((log) => {
          return (
            <div
              key={log.id}
              onClick={() => {
                selectAgent(log.agentId);
                setActiveTab('office');
              }}
              className="p-2.5 rounded-none bg-[#121212] border border-[#262626] hover:border-[#52525B] transition-colors cursor-pointer group flex items-start gap-3"
            >
              {/* Timestamp & Level */}
              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                <span className="text-[11px] text-neutral-500 tabular-nums">
                  [{log.timestamp}]
                </span>
                {log.level === 'success' && (
                  <Check className="w-3.5 h-3.5 text-white" />
                )}
                {log.level === 'warning' && (
                  <AlertTriangle className="w-3.5 h-3.5 text-neutral-400" />
                )}
                {log.level === 'info' && (
                  <Info className="w-3.5 h-3.5 text-neutral-500" />
                )}
              </div>

              {/* Agent Pill */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black tracking-wider px-1.5 py-0.2 rounded-none bg-white text-black">
                    {log.agentName}
                  </span>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                    // {log.category}
                  </span>
                  <span className="text-[9px] text-neutral-600 ml-auto group-hover:text-white transition-colors">
                    INSPECT 3D →
                  </span>
                </div>

                <p className="text-xs text-neutral-200 leading-relaxed font-sans">
                  {log.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
