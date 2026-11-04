'use client';

import React, { useState } from 'react';
import { BACKEND_MODULES } from '@/services/mock/mockBackendModules';
import { BackendModuleDef } from '@/types/backend';
import { useOfficeStore } from '@/store/officeStore';
import {
  Terminal,
  Play,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';

export const BackendIntegrationView: React.FC = () => {
  const [modules] = useState<BackendModuleDef[]>(BACKEND_MODULES);
  const [selectedModule, setSelectedModule] = useState<BackendModuleDef>(BACKEND_MODULES[0]);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'modules' | 'inspector'>('modules');

  const addActivityLog = useOfficeStore((state) => state.addActivityLog);

  const handleTestModule = (mod: BackendModuleDef) => {
    setTestingId(mod.id);
    setTestResult('Connecting to adapter endpoint...');

    setTimeout(() => {
      setTestingId(null);
      const simulatedResponse = {
        status: 200,
        ok: true,
        endpoint: mod.pathOrIdentifier,
        executionTime: `${mod.latencyMs}ms`,
        adapterMode: 'PRODUCTION ADAPTER INTERFACE READY',
        timestamp: new Date().toISOString(),
        payloadResponse: mod.samplePayload || {
          message: 'Handler executed successfully via backend adapter.',
          registeredAgent: mod.associatedAgent
        }
      };

      setTestResult(JSON.stringify(simulatedResponse, null, 2));

      addActivityLog({
        agentId: 'sentry',
        agentName: 'SENTRY',
        agentColor: '#FAFAFA',
        category: 'infrastructure',
        level: 'success',
        message: `Endpoint test berhasil: ${mod.name} (${mod.pathOrIdentifier}) merespon dalam ${mod.latencyMs}ms.`
      });
    }, 600);
  };

  return (
    <div className="w-full h-full flex flex-col p-3 sm:p-6 overflow-hidden select-none bg-[#0A0A0A] font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-white uppercase tracking-wider">
              BACKEND INTEGRATION ARCHITECTURE
            </h1>
            <span className="px-2 py-0.5 rounded-none text-[10px] bg-white text-black font-bold">
              15 MODULES
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Peta integrasi resmi dengan backend portal berita eksisting (API Routes, Server Actions, Library Services, Cron Jobs & Database).
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#121212] border border-[#262626] text-neutral-300">
            <span className="w-1.5 h-1.5 bg-white" />
            <span>ADAPTER READY</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-[#121212] border border-[#262626] text-neutral-500">
            <span className="w-1.5 h-1.5 bg-neutral-600" />
            <span>REAL BACKEND (ENV REQUIRED)</span>
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex items-center gap-1 pt-3 pb-1 lg:hidden">
        <button
          onClick={() => setMobileTab('modules')}
          className={`flex-1 py-1.5 text-xs font-bold border rounded-none transition-colors cursor-pointer ${
            mobileTab === 'modules'
              ? 'bg-white text-black border-white'
              : 'bg-[#121212] text-neutral-400 border-[#262626]'
          }`}
        >
          LIST MODUL ({modules.length})
        </button>
        <button
          onClick={() => setMobileTab('inspector')}
          className={`flex-1 py-1.5 text-xs font-bold border rounded-none transition-colors cursor-pointer ${
            mobileTab === 'inspector'
              ? 'bg-white text-black border-white'
              : 'bg-[#121212] text-neutral-400 border-[#262626]'
          }`}
        >
          INSPECTOR & TEST
        </button>
      </div>

      {/* Main Grid: Modules List (Col 6) & Interactive Inspector (Col 6) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 pt-2 lg:pt-4 overflow-hidden min-h-0">
        
        {/* Module Cards List */}
        <div className={`lg:col-span-6 overflow-y-auto space-y-2 pr-1 ${mobileTab === 'modules' ? 'block' : 'hidden lg:block'}`}>
          {modules.map((mod) => {
            const isSelected = selectedModule.id === mod.id;

            return (
              <div
                key={mod.id}
                onClick={() => {
                  setSelectedModule(mod);
                  setTestResult(null);
                  setMobileTab('inspector');
                }}
                className={`p-3 rounded-none border transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#181818] border-white text-white'
                    : 'bg-[#121212] border-[#262626] hover:border-[#404040]'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-1.5 py-0.2 text-[9px] uppercase bg-[#0A0A0A] border border-[#333333] text-neutral-300 font-bold">
                      {mod.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-neutral-500">
                      AGENT: {mod.associatedAgent.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white truncate">{mod.name}</h3>
                  <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {mod.pathOrIdentifier}
                  </p>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1 leading-relaxed font-sans">
                    {mod.description}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between shrink-0 h-full">
                  <span className="text-[9px] px-1.5 py-0.2 bg-white text-black font-bold">
                    {mod.status.toUpperCase()}
                  </span>
                  {mod.latencyMs && (
                    <span className="text-[10px] text-neutral-500 mt-2 tabular-nums">
                      {mod.latencyMs}ms
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Inspector & Test Runner Panel */}
        <div className={`lg:col-span-6 bg-[#121212] border border-[#262626] rounded-none p-3 sm:p-4 flex flex-col justify-between overflow-y-auto ${mobileTab === 'inspector' ? 'block' : 'hidden lg:flex'}`}>
          <div>
            {/* Back button for mobile */}
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileTab('modules')}
                  className="p-1 border border-[#262626] hover:border-white text-neutral-400 hover:text-white lg:hidden cursor-pointer"
                  title="Kembali ke List Modul"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
                    {selectedModule.type.replace('_', ' ')} TELEMETRY
                  </span>
                  <h2 className="text-sm font-black text-white mt-0.5">{selectedModule.name}</h2>
                </div>
              </div>

              <button
                onClick={() => handleTestModule(selectedModule)}
                disabled={testingId === selectedModule.id}
                className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-neutral-200 disabled:opacity-50 text-black rounded-none text-xs font-bold transition-colors cursor-pointer border border-white shrink-0"
              >
                {testingId === selectedModule.id ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
                <span>TEST ADAPTER</span>
              </button>
            </div>

            {/* Spec info */}
            <div className="mt-3 space-y-2">
              <div className="p-2.5 bg-[#0A0A0A] border border-[#262626]">
                <div className="text-[9px] text-neutral-500 uppercase">IDENTIFIER / ROUTE</div>
                <div className="text-xs font-bold text-white mt-0.5 break-all">
                  {selectedModule.pathOrIdentifier}
                </div>
              </div>

              <div className="p-2.5 bg-[#0A0A0A] border border-[#262626]">
                <div className="text-[9px] text-neutral-500 uppercase">FUNGSIONALITAS</div>
                <div className="text-xs text-neutral-300 mt-0.5 leading-relaxed font-sans">
                  {selectedModule.description}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2.5 bg-[#0A0A0A] border border-[#262626]">
                  <div className="text-[9px] text-neutral-500 uppercase">ASSOCIATED AGENT</div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    {selectedModule.associatedAgent.toUpperCase()}
                  </div>
                </div>

                <div className="p-2.5 bg-[#0A0A0A] border border-[#262626]">
                  <div className="text-[9px] text-neutral-500 uppercase">ENV VARIABLE</div>
                  <div className="text-xs text-neutral-300 mt-0.5 truncate">
                    {selectedModule.environmentVar || 'Internal / Serverless'}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Terminal / Response Payload Viewer */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1">
                <span className="flex items-center gap-1.5 text-neutral-300">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>ADAPTER JSON RESPONSE</span>
                </span>
                <span>application/json</span>
              </div>

              <pre className="p-3 bg-[#0A0A0A] border border-[#262626] font-mono text-[11px] text-neutral-200 max-h-52 overflow-y-auto">
                {testResult ||
                  JSON.stringify(
                    {
                      status: 'STANDBY',
                      info: 'Klik "TEST ADAPTER" untuk mensimulasikan handshake endpoint.',
                      target: selectedModule.pathOrIdentifier,
                      configuredAgent: selectedModule.associatedAgent
                    },
                    null,
                    2
                  )}
              </pre>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#262626] flex items-center justify-between text-[10px] text-neutral-600">
            <span>Production Adapter Layer</span>
            <span>Zero Frontend Secret Storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
