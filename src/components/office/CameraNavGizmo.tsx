'use client';

import React, { useRef, useCallback } from 'react';
import { useOfficeStore } from '@/store/officeStore';
import { CameraActionType } from '@/types/office';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Plus,
  Minus,
  Hand,
  RotateCw
} from 'lucide-react';

export const CameraNavGizmo: React.FC = () => {
  const cameraInteractionMode = useOfficeStore((state) => state.cameraInteractionMode);
  const setCameraInteractionMode = useOfficeStore((state) => state.setCameraInteractionMode);
  const triggerCameraAction = useOfficeStore((state) => state.triggerCameraAction);
  const setCameraPreset = useOfficeStore((state) => state.setCameraPreset);

  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startContinuousAction = useCallback((action: CameraActionType) => {
    // Immediate first step
    triggerCameraAction(action);

    // Continuous hold
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    holdIntervalRef.current = setInterval(() => {
      triggerCameraAction(action);
    }, 70);
  }, [triggerCameraAction]);

  const stopContinuousAction = useCallback(() => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  }, []);

  return (
    <div className="flex flex-col items-end gap-1.5 font-mono select-none pointer-events-auto">
      {/* 1. Mode Switcher: PUTAR (Orbit) vs GESER (Pan) */}
      <div className="flex items-center bg-[#262B35]/95 border border-[#3D4454] p-0.5 shadow-xl">
        <button
          onClick={() => setCameraInteractionMode('PAN')}
          className={`px-2 py-1 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
            cameraInteractionMode === 'PAN'
              ? 'bg-[#475569] text-white border border-[#64748B]'
              : 'text-slate-300 hover:text-white hover:bg-[#313744] border border-transparent'
          }`}
          title="Mode Geser (Pan): Klik & seret mouse atau usap layar untuk menggeser kantor"
        >
          <Hand className="w-3.5 h-3.5" />
          <span>GESER</span>
        </button>

        <button
          onClick={() => setCameraInteractionMode('ORBIT')}
          className={`px-2 py-1 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
            cameraInteractionMode === 'ORBIT'
              ? 'bg-[#475569] text-white border border-[#64748B]'
              : 'text-slate-300 hover:text-white hover:bg-[#313744] border border-transparent'
          }`}
          title="Mode Putar (Orbit): Klik & seret mouse untuk memutar sudut kamera 3D"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>PUTAR</span>
        </button>
      </div>

      {/* 2. D-Pad & Zoom Controls Box */}
      <div className="flex items-center gap-2 bg-[#262B35]/95 border border-[#3D4454] p-2 shadow-xl">
        {/* Directional Cross D-Pad */}
        <div className="grid grid-cols-3 grid-rows-3 gap-1 w-24 h-24">
          {/* Row 1: Top */}
          <div />
          <button
            onPointerDown={() => startContinuousAction('PAN_UP')}
            onPointerUp={stopContinuousAction}
            onPointerLeave={stopContinuousAction}
            className="flex items-center justify-center bg-[#313744] border border-[#475569] text-slate-200 hover:text-white hover:bg-[#475569] active:bg-[#64748B] transition-colors cursor-pointer"
            title="Geser Kamera Ke Atas (Pan Up)"
            aria-label="Geser Atas"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <div />

          {/* Row 2: Left, Center (Reset), Right */}
          <button
            onPointerDown={() => startContinuousAction('PAN_LEFT')}
            onPointerUp={stopContinuousAction}
            onPointerLeave={stopContinuousAction}
            className="flex items-center justify-center bg-[#313744] border border-[#475569] text-slate-200 hover:text-white hover:bg-[#475569] active:bg-[#64748B] transition-colors cursor-pointer"
            title="Geser Kamera Ke Kiri (Pan Left)"
            aria-label="Geser Kiri"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCameraPreset('ISOMETRIC')}
            className="flex items-center justify-center bg-[#282C37] border border-[#3D4454] text-slate-400 hover:text-white hover:bg-[#3D4454] transition-colors cursor-pointer"
            title="Reset Sudut & Posisi Kamera (Default Isometric)"
            aria-label="Reset Kamera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onPointerDown={() => startContinuousAction('PAN_RIGHT')}
            onPointerUp={stopContinuousAction}
            onPointerLeave={stopContinuousAction}
            className="flex items-center justify-center bg-[#313744] border border-[#475569] text-slate-200 hover:text-white hover:bg-[#475569] active:bg-[#64748B] transition-colors cursor-pointer"
            title="Geser Kamera Ke Kanan (Pan Right)"
            aria-label="Geser Kanan"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Row 3: Bottom */}
          <div />
          <button
            onPointerDown={() => startContinuousAction('PAN_DOWN')}
            onPointerUp={stopContinuousAction}
            onPointerLeave={stopContinuousAction}
            className="flex items-center justify-center bg-[#313744] border border-[#475569] text-slate-200 hover:text-white hover:bg-[#475569] active:bg-[#64748B] transition-colors cursor-pointer"
            title="Geser Kamera Ke Bawah (Pan Down)"
            aria-label="Geser Bawah"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <div />
        </div>

        {/* Divider */}
        <div className="w-[1px] h-20 bg-[#3D4454]" />

        {/* Zoom In & Zoom Out Buttons */}
        <div className="flex flex-col gap-1 w-8 h-24 justify-between">
          <button
            onPointerDown={() => startContinuousAction('ZOOM_IN')}
            onPointerUp={stopContinuousAction}
            onPointerLeave={stopContinuousAction}
            className="flex-1 flex items-center justify-center bg-[#313744] border border-[#475569] text-slate-200 hover:text-white hover:bg-[#475569] active:bg-[#64748B] transition-colors cursor-pointer"
            title="Zoom In (Perbesar Tampilan)"
            aria-label="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onPointerDown={() => startContinuousAction('ZOOM_OUT')}
            onPointerUp={stopContinuousAction}
            onPointerLeave={stopContinuousAction}
            className="flex-1 flex items-center justify-center bg-[#313744] border border-[#475569] text-slate-200 hover:text-white hover:bg-[#475569] active:bg-[#64748B] transition-colors cursor-pointer"
            title="Zoom Out (Perkecil Tampilan)"
            aria-label="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Small Keyboard Hint */}
      <div className="text-[9px] text-slate-400 bg-[#1E222A]/90 px-1.5 py-0.5 border border-[#3D4454]/60 tracking-wider">
        PANAH <span className="text-white font-bold">↑↓←→</span> ATAU DRAG
      </div>
    </div>
  );
};

