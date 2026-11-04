'use client';

import React from 'react';
import { useOfficeStore, ActiveTab } from '@/store/officeStore';
import {
  Building2,
  Users,
  Activity,
  GitPullRequest,
  BarChart3,
  Server,
  X
} from 'lucide-react';

const NAV_ITEMS: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'office', label: 'Virtual Office 3D', icon: Building2 },
  { id: 'agents', label: 'Agent Directory', icon: Users },
  { id: 'activity', label: 'Live Activity Stream', icon: Activity },
  { id: 'pipeline', label: 'Article Pipeline', icon: GitPullRequest },
  { id: 'analytics', label: 'Office Analytics', icon: BarChart3 },
  { id: 'backend', label: 'Backend Integration', icon: Server }
];

export const Sidebar: React.FC = () => {
  const activeTab = useOfficeStore((state) => state.activeTab);
  const setActiveTab = useOfficeStore((state) => state.setActiveTab);
  const agents = useOfficeStore((state) => state.agents);
  const selectedAgentId = useOfficeStore((state) => state.selectedAgentId);
  const selectAgent = useOfficeStore((state) => state.selectAgent);
  const isMobileSidebarOpen = useOfficeStore((state) => state.isMobileSidebarOpen);
  const setMobileSidebarOpen = useOfficeStore((state) => state.setMobileSidebarOpen);

  const mainAgents = agents.filter((a) => a.id !== 'receptionist' && a.id !== 'chief');

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 md:hidden animate-in fade-in duration-150"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 md:relative md:w-64 md:inset-auto md:z-20 h-full bg-[#262B35] border-r border-[#3D4454] flex flex-col justify-between shrink-0 select-none transition-transform duration-200 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Branding Section */}
        <div>
          <div className="p-4 border-b border-[#3D4454] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-none bg-[#313744] border border-[#5A6478] text-white flex items-center justify-center font-mono font-black text-xs shrink-0 tracking-wider">
                HQ
              </div>
              <div>
                <h1 className="text-xs font-black tracking-widest text-white uppercase font-mono">
                  NEWSROOM // 01
                </h1>
                <p className="text-[10px] text-neutral-300 font-mono tracking-wider">
                  Autonomous AI Newsroom
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="p-1 text-neutral-400 hover:text-white md:hidden border border-[#3D4454] hover:border-[#5A6478] rounded-none cursor-pointer"
              title="Tutup Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Navigation Menu */}
          <nav className="p-2 space-y-1">
            <div className="px-3 py-1.5 text-[9px] font-mono font-bold text-neutral-400 tracking-widest uppercase">
              Workspace
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-none text-xs font-medium transition-colors border cursor-pointer ${
                    isActive
                      ? 'bg-[#313744] text-white font-bold border-[#5A6478]'
                      : 'text-neutral-300 border-transparent hover:text-white hover:bg-[#313744] hover:border-[#3D4454]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Seven AI Agents Live Roster */}
          <div className="px-2 pt-3 border-t border-[#3D4454] mt-2">
            <div className="flex items-center justify-between px-3 py-1 text-[9px] font-mono font-bold text-neutral-400 tracking-widest uppercase">
              <span>AI Agents [7]</span>
              <span className="text-neutral-300 font-mono flex items-center gap-1.5 text-[9px]">
                <span className="w-1.5 h-1.5 rounded-none bg-neutral-300" />
                <span>ACTIVE</span>
              </span>
            </div>

            <div className="mt-1 space-y-0.5 max-h-[220px] overflow-y-auto pr-1">
              {mainAgents.map((agent) => {
                const isSelected = selectedAgentId === agent.id;
                const isWorking = agent.status === 'working';
                return (
                  <button
                    key={agent.id}
                    onClick={() => {
                      selectAgent(agent.id);
                      if (activeTab !== 'office') setActiveTab('office');
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-none text-xs font-mono transition-colors border cursor-pointer ${
                      isSelected
                        ? 'bg-[#313744] border-[#5A6478] text-white'
                        : 'text-neutral-300 border-transparent hover:text-white hover:bg-[#313744]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-none shrink-0" style={{ backgroundColor: agent.color }} />
                      <span className="font-bold tracking-wider">{agent.name}</span>
                    </div>

                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-none font-mono ${
                        isWorking
                          ? 'bg-[#475569] text-white border border-[#64748B] font-bold'
                          : 'bg-[#262B35] border border-[#3D4454] text-neutral-300'
                      }`}
                    >
                      {isWorking ? 'KERJA' : 'NYANTAI'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom System Telemetry */}
        <div className="p-3 border-t border-[#3D4454] text-[10px] font-mono text-neutral-300 space-y-1">
          <div className="flex justify-between items-center text-neutral-200">
            <span>SYS STATUS</span>
            <span className="text-white font-bold">OPERATIONAL</span>
          </div>
          <div className="text-[9px] text-neutral-400">
            Connected to Neon Postgres
          </div>
        </div>
      </aside>
    </>
  );
};
