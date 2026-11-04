'use client';

import React from 'react';
import { Html } from '@react-three/drei';
import { useOfficeStore } from '@/store/officeStore';
import { AgentId } from '@/types/agent';

interface SignboardProps {
  position: [number, number, number];
  agentId: AgentId;
  icon: string;
  name: string;
  role: string;
  bgColor: string;
  borderColor: string;
  textColor?: string;
}

const DioramaSignboard: React.FC<SignboardProps> = ({
  position,
  agentId,
  icon,
  name,
  role,
  bgColor,
  borderColor,
  textColor = 'text-white'
}) => {
  const selectAgent = useOfficeStore((state) => state.selectAgent);
  const selectedAgentId = useOfficeStore((state) => state.selectedAgentId);
  const isSelected = selectedAgentId === agentId;

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        selectAgent(agentId);
      }}
    >
      <Html center distanceFactor={14} zIndexRange={[100, 0]}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            selectAgent(agentId);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 shadow-2xl select-none cursor-pointer transition-all duration-300 font-sans ${
            isSelected
              ? 'scale-115 ring-4 ring-white shadow-[0_0_20px_rgba(255,255,255,0.8)]'
              : 'hover:scale-105 hover:brightness-110'
          }`}
          style={{
            backgroundColor: bgColor,
            borderColor: borderColor,
            boxShadow: `0 8px 24px rgba(0,0,0,0.4)`
          }}
        >
          <span className="text-base drop-shadow">{icon}</span>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-xs font-black tracking-wider text-white uppercase drop-shadow">
              {name}
            </span>
            <span className="text-[10px] font-semibold text-slate-200">
              ({role})
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
};

export const DioramaSignboards: React.FC = () => {
  return (
    <group>
      {/* 1. TOP LEFT WALL: SCOUT (News Hunter) */}
      <DioramaSignboard
        position={[-8.5, 4.8, -4.5]}
        agentId="scout"
        icon="🕵️"
        name="SCOUT"
        role="News Hunter"
        bgColor="#0369A1"
        borderColor="#38BDF8"
      />

      {/* 2. TOP BACK LEFT: PIXEL (Redaktur Foto) */}
      <DioramaSignboard
        position={[-2.2, 5.2, -8.3]}
        agentId="pixel"
        icon="📷"
        name="PIXEL"
        role="Redaktur Foto"
        bgColor="#831843"
        borderColor="#F43F5E"
      />

      {/* 3. TOP BACK RIGHT: CHRONOS (Scheduler) */}
      <DioramaSignboard
        position={[4.2, 5.2, -8.3]}
        agentId="chronos"
        icon="⏰"
        name="CHRONOS"
        role="Scheduler"
        bgColor="#0E7490"
        borderColor="#22D3EE"
      />

      {/* 4. TOP RIGHT: SENTRY (DevOps IT) */}
      <DioramaSignboard
        position={[8.2, 4.8, -4.5]}
        agentId="sentry"
        icon="🛡️"
        name="SENTRY"
        role="DevOps IT"
        bgColor="#4338CA"
        borderColor="#818CF8"
      />

      {/* 5. BOTTOM LEFT CORNER: SCOUT (News Hunter) */}
      <DioramaSignboard
        position={[-8.8, 1.2, 6.2]}
        agentId="scout"
        icon="🕵️"
        name="SCOUT"
        role="News Hunter"
        bgColor="#075985"
        borderColor="#38BDF8"
      />

      {/* 6. BOTTOM CENTER-LEFT: SCRIBE (Jurnalis AI) */}
      <DioramaSignboard
        position={[-3.8, 1.2, 7.2]}
        agentId="scribe"
        icon="✍️"
        name="SCRIBE"
        role="Jurnalis AI"
        bgColor="#581C87"
        borderColor="#C084FC"
      />

      {/* 7. BOTTOM RIGHT: HERMES (Telegram Envoy) */}
      <DioramaSignboard
        position={[7.8, 1.2, 6.2]}
        agentId="hermes"
        icon="📱"
        name="HERMES"
        role="Telegram Envoy"
        bgColor="#1E40AF"
        borderColor="#60A5FA"
      />
    </group>
  );
};

