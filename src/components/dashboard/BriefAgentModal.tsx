'use client';

import React, { useState } from 'react';
import { useOfficeStore } from '@/store/officeStore';
import { X, Send } from 'lucide-react';

export const BriefAgentModal: React.FC = () => {
  const isBriefModalOpen = useOfficeStore((state) => state.isBriefModalOpen);
  const briefingAgentId = useOfficeStore((state) => state.briefingAgentId);
  const closeBriefModal = useOfficeStore((state) => state.closeBriefModal);
  const agents = useOfficeStore((state) => state.agents);
  const updateAgentTask = useOfficeStore((state) => state.updateAgentTask);
  const addActivityLog = useOfficeStore((state) => state.addActivityLog);

  const [taskDirective, setTaskDirective] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('high');

  if (!isBriefModalOpen || !briefingAgentId) return null;

  const agent = agents.find((a) => a.id === briefingAgentId);
  if (!agent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskDirective.trim()) return;

    updateAgentTask(
      agent.id,
      taskDirective,
      `Mengeksekusi instruksi khusus: "${taskDirective.substring(0, 35)}..."`
    );

    addActivityLog({
      agentId: agent.id,
      agentName: agent.name,
      agentColor: '#FAFAFA',
      category: 'editorial',
      level: priority === 'urgent' ? 'alert' : 'info',
      message: `Instruksi baru ditugaskan ke ${agent.name}: "${taskDirective}" (Prioritas: ${priority.toUpperCase()})`
    });

    setTaskDirective('');
    closeBriefModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#121212] border border-[#333333] rounded-none p-4 sm:p-5 text-white shadow-2xl relative font-mono max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeBriefModal}
          className="absolute top-4 right-4 p-1 rounded-none hover:bg-[#202020] text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#262626]">
          <div className="w-10 h-10 rounded-none bg-white text-black font-black text-xs flex items-center justify-center border border-white tracking-wider">
            {agent.name.substring(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">BRIEF // {agent.name}</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 border border-[#404040] text-neutral-300">
                {agent.role}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
              Kirimkan instruksi kerja atau arahan prompt langsung ke AI Agent.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1.5 tracking-wider">
              Instruksi / Prompt Tugas:
            </label>
            <textarea
              value={taskDirective}
              onChange={(e) => setTaskDirective(e.target.value)}
              placeholder="Contoh: Segera verifikasi sumber berita terkait peluncuran satelit dan susun 3 opsi sudut pandang berita..."
              rows={4}
              required
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-none p-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-sans resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Tingkat Prioritas:</span>
            <div className="flex items-center gap-1">
              {(['normal', 'high', 'urgent'] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1 text-xs rounded-none font-bold uppercase transition-colors border cursor-pointer ${
                    priority === p
                      ? 'bg-white text-black border-white'
                      : 'bg-[#181818] text-neutral-400 border-[#262626] hover:text-white hover:border-[#404040]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#262626] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeBriefModal}
              className="px-4 py-1.5 rounded-none text-xs font-bold text-neutral-400 hover:text-white bg-[#181818] hover:bg-[#222222] border border-[#262626] transition-colors cursor-pointer"
            >
              BATAL
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-none text-xs font-bold text-black bg-white hover:bg-neutral-200 border border-white transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>TUGASKAN</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
