'use client';

import React from 'react';
import { useOfficeStore } from '@/store/officeStore';
import { Volume2, Gamepad2, Eye, RotateCcw } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const soundEnabled = useOfficeStore((state) => state.soundEnabled);
  const toggleSound = useOfficeStore((state) => state.toggleSound);
  const movementMode = useOfficeStore((state) => state.movementMode);
  const setMovementMode = useOfficeStore((state) => state.setMovementMode);
  const cameraFollowPlayer = useOfficeStore((state) => state.cameraFollowPlayer);
  const setCameraFollowPlayer = useOfficeStore((state) => state.setCameraFollowPlayer);
  const setCameraPreset = useOfficeStore((state) => state.setCameraPreset);

  return (
    <div className="w-full h-full flex flex-col p-3 sm:p-6 overflow-y-auto select-none bg-[#0A0A0A] font-mono">
      <div className="pb-3 sm:pb-4 border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-black text-white uppercase tracking-wider">
            SYSTEM & TELEMETRY SETTINGS
          </h1>
          <span className="px-2 py-0.5 rounded-none text-[10px] bg-white text-black font-bold">
            CONFIG
          </span>
        </div>
        <p className="text-xs text-neutral-400 mt-1 font-sans">
          Parameter navigasi visual 3D, kontrol avatar karakter, audio status, dan kamera preset.
        </p>
      </div>

      <div className="max-w-2xl space-y-3 pt-3 sm:pt-4">
        {/* Movement Mode */}
        <div className="p-3 sm:p-3.5 bg-[#121212] border border-[#262626] rounded-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase">
              <Gamepad2 className="w-4 h-4 text-neutral-400" />
              <span>Default Character Movement Mode</span>
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5 font-sans">
              Pilih apakah avatar Roblox beraktivitas otomatis atau siap dikendalikan WASD.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-[#0A0A0A] p-0.5 border border-[#262626] rounded-none shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setMovementMode('AUTOMATIC')}
              className={`flex-1 sm:flex-initial px-3 py-1 text-xs font-bold rounded-none transition-colors border cursor-pointer ${
                movementMode === 'AUTOMATIC'
                  ? 'bg-white text-black border-white'
                  : 'text-neutral-400 border-transparent hover:text-white'
              }`}
            >
              AUTOMATIC
            </button>
            <button
              onClick={() => setMovementMode('MANUAL')}
              className={`flex-1 sm:flex-initial px-3 py-1 text-xs font-bold rounded-none transition-colors border cursor-pointer ${
                movementMode === 'MANUAL'
                  ? 'bg-white text-black border-white'
                  : 'text-neutral-400 border-transparent hover:text-white'
              }`}
            >
              MANUAL WASD
            </button>
          </div>
        </div>

        {/* Camera Follow */}
        <div className="p-3 sm:p-3.5 bg-[#121212] border border-[#262626] rounded-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase">
              <Eye className="w-4 h-4 text-neutral-400" />
              <span>Camera Chase / Follow Player</span>
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5 font-sans">
              Kamera 3D secara otomatis mengikuti posisi karakter yang Anda kendalikan.
            </p>
          </div>
          <button
            onClick={() => setCameraFollowPlayer(!cameraFollowPlayer)}
            className={`px-3 py-1 text-xs font-bold rounded-none transition-colors border cursor-pointer shrink-0 w-full sm:w-auto ${
              cameraFollowPlayer
                ? 'bg-white text-black border-white'
                : 'bg-[#181818] text-neutral-400 border-[#333333] hover:text-white'
            }`}
          >
            {cameraFollowPlayer ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>

        {/* Audio Sound FX */}
        <div className="p-3 sm:p-3.5 bg-[#121212] border border-[#262626] rounded-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase">
              <Volume2 className="w-4 h-4 text-neutral-400" />
              <span>Ambient Sound & Interface Audio</span>
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5 font-sans">
              Efek audio feedback saat perpindahan workstation dan interaksi UI.
            </p>
          </div>
          <button
            onClick={toggleSound}
            className={`px-3 py-1 text-xs font-bold rounded-none transition-colors border cursor-pointer shrink-0 w-full sm:w-auto ${
              soundEnabled
                ? 'bg-white text-black border-white'
                : 'bg-[#181818] text-neutral-400 border-[#333333] hover:text-white'
            }`}
          >
            {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Reset Camera */}
        <div className="p-3 sm:p-3.5 bg-[#121212] border border-[#262626] rounded-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase">
              <RotateCcw className="w-4 h-4 text-neutral-400" />
              <span>Reset Posisi Kamera 3D</span>
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5 font-sans">
              Kembalikan sudut kamera ke posisi default Isometric Newsroom HQ.
            </p>
          </div>
          <button
            onClick={() => setCameraPreset('ISOMETRIC')}
            className="px-3 py-1 bg-white hover:bg-neutral-200 text-black text-xs font-bold border border-white transition-colors cursor-pointer rounded-none shrink-0 w-full sm:w-auto"
          >
            RESET DEFAULT
          </button>
        </div>
      </div>
    </div>
  );
};
