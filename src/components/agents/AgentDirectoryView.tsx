'use client';

import React, { useState } from 'react';
import { useOfficeStore } from '@/store/officeStore';
import { AgentId, AgentStatus } from '@/types/agent';
import {
  Search,
  Eye,
  Gamepad2,
  MessageSquare
} from 'lucide-react';

export const AgentDirectoryView: React.FC = () => {
  const agents = useOfficeStore((state) => state.agents);
  const selectAgent = useOfficeStore((state) => state.selectAgent);
  const setActiveTab = useOfficeStore((state) => state.setActiveTab);
  const setMovementMode = useOfficeStore((state) => state.setMovementMode);
  const setControlledAgentId = useOfficeStore((state) => state.setControlledAgentId);
  const openBriefModal = useOfficeStore((state) => state.openBriefModal);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgentStatus | 'all'>('all');

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.assignedTask.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.specialization.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleInspectIn3D = (id: AgentId) => {
    selectAgent(id);
    setActiveTab('office');
  };

  const handleDriveCharacter = (id: AgentId) => {
    setControlledAgentId(id);
    setMovementMode('MANUAL');
    selectAgent(id);
    setActiveTab('office');
  };

  return (
    <div className="w-full h-full flex flex-col p-3 sm:p-6 overflow-y-auto select-none bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#262626]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-black text-white font-mono uppercase tracking-wider">
              AGENT DIRECTORY
            </h1>
            <span className="px-2 py-0.5 rounded-none text-[10px] font-mono bg-white text-black font-bold">
              {agents.length} UNITS
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Daftar unit AI otomasi redaksi, profil peran, workstation 3D, dan spesialisasi sistem.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2 font-mono w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari agent / role..."
              className="pl-8 pr-3 py-1.5 bg-[#121212] border border-[#262626] rounded-none text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white w-full sm:w-56 transition-colors"
            />
          </div>

          <div className="flex items-center bg-[#121212] border border-[#262626] p-0.5 rounded-none overflow-x-auto">
            {(['all', 'working', 'idle', 'paused'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 sm:px-2.5 py-1 text-[10px] font-mono uppercase font-bold transition-colors cursor-pointer rounded-none border shrink-0 ${
                  statusFilter === st
                    ? 'bg-white text-black border-white'
                    : 'text-neutral-400 border-transparent hover:text-white'
                }`}
              >
                {st === 'working' ? 'Kerja' : st === 'idle' ? 'Nyantai' : st === 'paused' ? 'Paused' : 'Semua'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pt-4">
        {filteredAgents.map((agent) => {
          const isWorking = agent.status === 'working';

          return (
            <div
              key={agent.id}
              className="p-4 rounded-none bg-[#121212] border border-[#262626] hover:border-[#52525B] transition-colors flex flex-col justify-between group font-mono"
            >
              <div>
                {/* Header with Avatar and Basic Info */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-none bg-[#181818] border border-[#333333] flex items-center justify-center text-white font-mono font-black text-sm shrink-0">
                    {agent.name.substring(0, 2)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-sm font-black text-white tracking-wider truncate">
                        {agent.name}
                      </h3>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 rounded-none font-bold ${
                          isWorking
                            ? 'bg-white text-black'
                            : 'border border-neutral-600 text-neutral-400'
                        }`}
                      >
                        {isWorking ? 'KERJA' : 'NYANTAI'}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-300 font-semibold truncate mt-0.5">
                      {agent.role}
                    </p>
                    <p className="text-[10px] text-neutral-500 truncate">{agent.department}</p>
                  </div>
                </div>

                {/* Workstation Location */}
                <div className="mt-3 p-2 bg-[#0A0A0A] border border-[#262626] flex items-center justify-between text-[10px]">
                  <span className="text-neutral-500">WORKSTATION:</span>
                  <span className="text-neutral-200 font-bold truncate max-w-[180px]">{agent.workstation}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-300 mt-2.5 line-clamp-2 leading-relaxed font-sans">
                  {agent.description}
                </p>

                {/* Current live task */}
                <div className="mt-3 pt-2.5 border-t border-[#262626]">
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-neutral-400">ASSIGNED TASK:</span>
                    <span className="text-white font-bold tabular-nums">{agent.progress}%</span>
                  </div>
                  <p className="text-xs text-neutral-200 line-clamp-1 font-sans">
                    {agent.assignedTask}
                  </p>
                  <div className="w-full h-1 bg-[#262626] mt-2 rounded-none overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${agent.progress}%` }}
                    />
                  </div>
                </div>

                {/* Specialization tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {agent.specialization.slice(0, 3).map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-1.5 py-0.5 text-[9px] font-mono bg-[#181818] border border-[#262626] text-neutral-400"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-[#262626] flex items-center gap-1.5">
                <button
                  onClick={() => handleInspectIn3D(agent.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white text-black hover:bg-neutral-200 border border-white text-xs font-bold transition-colors cursor-pointer rounded-none"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>LIHAT 3D</span>
                </button>

                <button
                  onClick={() => openBriefModal(agent.id)}
                  className="p-1.5 bg-[#181818] hover:bg-[#222222] border border-[#333333] text-neutral-300 hover:text-white transition-colors cursor-pointer rounded-none"
                  title="Brief Agent Ini"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDriveCharacter(agent.id)}
                  className="p-1.5 bg-[#181818] hover:bg-[#222222] border border-[#333333] text-neutral-300 hover:text-white transition-colors cursor-pointer rounded-none"
                  title="Kendalikan Karakter (WASD)"
                >
                  <Gamepad2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
