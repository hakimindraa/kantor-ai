'use client';

import React from 'react';
import { OfficeFloor } from './OfficeFloor';
import { OfficeWallsAndRooms } from './OfficeWallsAndRooms';
import {
  OpenOfficeWorkstations,
  BreakroomKitchenLounge
} from './FurnitureSet';
import { RobloxCharacter } from './RobloxCharacter';
import { BaristaCharacter } from './BaristaCharacter';
import { CharacterController } from './CharacterController';
import { CameraController } from './CameraController';
import { useOfficeStore } from '@/store/officeStore';

export const OfficeScene: React.FC = () => {
  const agents = useOfficeStore((state) => state.agents);
  const movementMode = useOfficeStore((state) => state.movementMode);
  const controlledAgentId = useOfficeStore((state) => state.controlledAgentId);
  const playerPosition = useOfficeStore((state) => state.playerPosition);
  const playerRotation = useOfficeStore((state) => state.playerRotation);

  return (
    <>
      {/* ================= ARCHITECTURAL STUDIO FOG - FRESH LUMINOUS CHARCOAL ================= */}
      <fog attach="fog" args={['#2A2E38', 38, 90]} />

      {/* ================= CRISP DAYLIGHT & SOFT INDUSTRIAL CHARCOAL LIGHTING ================= */}
      {/* 1. Neutral Ambient Fill - Boosted for high visibility so agents are sharply illuminated */}
      <ambientLight color="#F8FAFC" intensity={0.85} />

      {/* 2. Soft Sky & Ground Bounce (Crisp Daylight Sky & Fresh Slate Ground) */}
      <hemisphereLight
        color="#FFFFFF"
        groundColor="#64748B"
        intensity={0.55}
      />

      {/* 3. Primary Key Daylight with Crisp Architectural Shadows */}
      <directionalLight
        position={[22, 28, 20]}
        intensity={1.4}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-bias={-0.0003}
      />

      {/* 4. Soft Window Daylight Fill from the Left (Fresh Slate Gray Fill) */}
      <directionalLight
        position={[-20, 16, -10]}
        intensity={0.65}
        color="#CBD5E1"
      />

      {/* 5. INDUSTRIAL STUDIO ACCENT LIGHTS */}
      {/* Workstation Monitors Pure White Daylight Fill */}
      <pointLight position={[-7.0, 3.2, 0]} color="#FFFFFF" intensity={1.0} distance={14} />

      {/* Breakroom Gallery Soft Neutral Daylight Fill */}
      <pointLight position={[6.5, 3.0, -1.8]} color="#FFFFFF" intensity={1.0} distance={14} />

      {/* Server Rack DevOps Clean Light */}
      <pointLight position={[-7.0, 2.2, -6.0]} color="#E2E8F0" intensity={0.8} distance={10} />

      {/* ================= 1. ARCHITECTURAL FLOOR & ZONES ================= */}
      <OfficeFloor />

      {/* ================= 2. DIORAMA WALLS ================= */}
      <OfficeWallsAndRooms />

      {/* ================= 3. ACTIVE OFFICE FURNITURE ================= */}
      {/* Dedicated Meja PC & DevOps Server Rack (Redaksi AI) */}
      <OpenOfficeWorkstations />

      {/* Dapur & Breakroom Lounge (Tempat Nyantai saat tidak ada kerjaan) */}
      <BreakroomKitchenLounge />

      {/* ================= 4. ROBLOX AI AGENT AVATARS ================= */}
      {agents.map((agent) => {
        const isThisControlled = movementMode === 'MANUAL' && controlledAgentId === agent.id;
        return (
          <RobloxCharacter
            key={agent.id}
            agent={agent}
            isControlled={isThisControlled}
            manualPosition={isThisControlled ? playerPosition : undefined}
            manualRotation={isThisControlled ? playerRotation : undefined}
            isMoving={isThisControlled}
          />
        );
      })}

      {/* ================= 4b. BARTENDER "KOPI TARAK" ================= */}
      <BaristaCharacter position={[6.5, 0, -3.2]} rotation={0} />

      {/* ================= 5. CONTROLLERS ================= */}
      <CharacterController />
      <CameraController />
    </>
  );
};
