'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { AgentInfoPanel } from '@/components/dashboard/AgentInfoPanel';
import { BriefAgentModal } from '@/components/dashboard/BriefAgentModal';
import { AgentDirectoryView } from '@/components/agents/AgentDirectoryView';
import { LiveActivityView } from '@/components/activity/LiveActivityView';
import { ArticlePipelineView } from '@/components/pipeline/ArticlePipelineView';
import { OfficeAnalyticsView } from '@/components/analytics/OfficeAnalyticsView';
import { BackendIntegrationView } from '@/components/backend/BackendIntegrationView';
import { SettingsView } from '@/components/settings/SettingsView';
import { useOfficeStore } from '@/store/officeStore';
import { eventBridge } from '@/services/live/eventBridge';

// Dynamically import 3D canvas with SSR disabled to ensure smooth WebGL initialization
const Office3DCanvas = dynamic(
  () => import('@/components/office/Office3DCanvas').then((mod) => mod.Office3DCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0A0A0A] text-white">
        <div className="w-8 h-8 rounded-none bg-white text-black flex items-center justify-center font-mono font-black text-xs mb-3">
          HQ
        </div>
        <p className="text-xs font-mono text-neutral-400">MEMUAT 3D ARCHITECTURAL DIORAMA...</p>
      </div>
    )
  }
);

export default function HomePage() {
  const activeTab = useOfficeStore((state) => state.activeTab);
  const selectedAgentId = useOfficeStore((state) => state.selectedAgentId);
  const syncLiveDbStats = useOfficeStore((state) => state.syncLiveDbStats);

  React.useEffect(() => {
    // 1. Initial live stats fetch (instant 0-load fallback if DATABASE_URL is not set)
    const loadStats = async () => {
      try {
        const res = await fetch('/api/live-status');
        const json = await res.json();
        if (json?.data) {
          syncLiveDbStats(json.data);
        }
      } catch {
        // Silently tolerate
      }
    };
    loadStats();

    // 2. Start secure real-time webhook listener (<2ms local in-memory event bus)
    eventBridge.startWebhookListener();
    eventBridge.initCountdownTicker();

    return () => {
      eventBridge.stopWebhookListener();
    };
  }, [syncLiveDbStats]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0A] text-neutral-100 font-sans">
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Top Navigation Bar */}
        <TopNav />

        {/* View Switcher based on activeTab */}
        <main className="flex-1 flex overflow-hidden relative">
          {activeTab === 'office' && (
            <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0A0A0A]">
              {/* 3D Virtual Office Canvas (With Unified Architectural Floating HUD) */}
              <div className="w-full h-full">
                <Office3DCanvas />
              </div>

              {/* Right Telemetry Panel (When Agent is clicked) */}
              {selectedAgentId && <AgentInfoPanel />}
            </div>
          )}

          {activeTab === 'agents' && <AgentDirectoryView />}
          {activeTab === 'activity' && <LiveActivityView />}
          {activeTab === 'pipeline' && <ArticlePipelineView />}
          {activeTab === 'analytics' && <OfficeAnalyticsView />}
          {activeTab === 'backend' && <BackendIntegrationView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Brief Agent Modal Dialog */}
      <BriefAgentModal />
    </div>
  );
}
