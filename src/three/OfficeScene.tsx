'use client';

import React from 'react';
import { OfficeFloor } from './OfficeFloor';
import { OfficeWallsAndRooms } from './OfficeWallsAndRooms';
import {
  OpenOfficeWorkstations,
  BreakroomKitchenLounge,
  RadarIntelWorkstations
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
  const timeOfDay = useOfficeStore((state) => state.timeOfDay);

  const lighting = React.useMemo(() => {
    switch (timeOfDay) {
      case 'SUNSET':
        return {
          fogColor: '#382229',
          ambientColor: '#FED7AA',
          ambientIntensity: 0.7,
          hemiSky: '#FDBA74',
          hemiGround: '#7C2D12',
          hemiIntensity: 0.55,
          keyColor: '#FB923C',
          keyIntensity: 1.5,
          windowColor: '#F97316',
          windowIntensity: 0.8,
          workstationLightColor: '#FFEDD5',
          workstationLightIntensity: 0.9,
          breakroomLightColor: '#FDBA74',
          breakroomLightIntensity: 1.1,
          serverLightColor: '#CBD5E1',
          serverLightIntensity: 0.8
        };
      case 'NIGHT':
        return {
          fogColor: '#090D16',
          ambientColor: '#1E293B',
          ambientIntensity: 0.35,
          hemiSky: '#38BDF8',
          hemiGround: '#020617',
          hemiIntensity: 0.25,
          keyColor: '#60A5FA',
          keyIntensity: 0.45,
          windowColor: '#3B82F6',
          windowIntensity: 0.35,
          workstationLightColor: '#38BDF8',
          workstationLightIntensity: 1.8,
          breakroomLightColor: '#F59E0B',
          breakroomLightIntensity: 1.6,
          serverLightColor: '#4ADE80',
          serverLightIntensity: 1.2
        };
      case 'DAY':
      default:
        return {
          fogColor: '#2A2E38',
          ambientColor: '#F8FAFC',
          ambientIntensity: 0.85,
          hemiSky: '#FFFFFF',
          hemiGround: '#64748B',
          hemiIntensity: 0.55,
          keyColor: '#FFFFFF',
          keyIntensity: 1.4,
          windowColor: '#CBD5E1',
          windowIntensity: 0.65,
          workstationLightColor: '#FFFFFF',
          workstationLightIntensity: 1.0,
          breakroomLightColor: '#FFFFFF',
          breakroomLightIntensity: 1.0,
          serverLightColor: '#E2E8F0',
          serverLightIntensity: 0.8
        };
    }
  }, [timeOfDay]);

  return (
    <>
      {/* ================= ARCHITECTURAL STUDIO FOG ================= */}
      <fog attach="fog" args={[lighting.fogColor, 38, 90]} />

      {/* ================= DYNAMIC TIME-OF-DAY STUDIO LIGHTING ================= */}
      {/* 1. Neutral Ambient Fill */}
      <ambientLight color={lighting.ambientColor} intensity={lighting.ambientIntensity} />

      {/* 2. Soft Sky & Ground Bounce */}
      <hemisphereLight
        color={lighting.hemiSky}
        groundColor={lighting.hemiGround}
        intensity={lighting.hemiIntensity}
      />

      {/* 3. Primary Key Sunlight / Sunset / Moon with Crisp Shadows */}
      <directionalLight
        position={[22, 28, 20]}
        intensity={lighting.keyIntensity}
        color={lighting.keyColor}
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

      {/* 4. Soft Window Daylight Fill from the Left */}
      <directionalLight
        position={[-20, 16, -10]}
        intensity={lighting.windowIntensity}
        color={lighting.windowColor}
      />

      {/* 5. INDUSTRIAL STUDIO ACCENT LIGHTS (DUAL-WING EXPANSION) */}
      {/* Sayap Barat: Redaksi AdaFakta Monitors Illumination Fill */}
      <pointLight position={[-13.5, 3.2, 0]} color={lighting.workstationLightColor} intensity={lighting.workstationLightIntensity} distance={18} />

      {/* Central Hub: Kopi Tarak Cafe & Lounge Illumination Fill */}
      <pointLight position={[0.0, 3.0, -2.5]} color={lighting.breakroomLightColor} intensity={lighting.breakroomLightIntensity} distance={16} />

      {/* Sayap Timur: Radar Intel & Bot Jurnalis Cyber Illumination Fill */}
      <pointLight position={[13.5, 3.2, 0]} color="#0284C7" intensity={lighting.workstationLightIntensity * 1.1} distance={18} />

      {/* Sentry Server DevOps Clean Light */}
      <pointLight position={[-18.5, 2.2, -6.0]} color={lighting.serverLightColor} intensity={lighting.serverLightIntensity} distance={10} />

      {/* ================= 1. ARCHITECTURAL FLOOR & ZONES ================= */}
      <OfficeFloor />

      {/* ================= 2. DIORAMA WALLS ================= */}
      <OfficeWallsAndRooms />

      {/* ================= 3. ACTIVE OFFICE FURNITURE ================= */}
      {/* Sayap Barat: Meja Redaksi AI AdaFakta */}
      <OpenOfficeWorkstations />

      {/* Area Tengah: Kedai Kopi Tarak & Breakroom Lounge */}
      <BreakroomKitchenLounge />

      {/* Sayap Timur: Meja Radar Intelijen & Bot Jurnalis (bottelejurnalis.vercel.app) */}
      <RadarIntelWorkstations />

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

      {/* ================= 4b. BARTENDER "KOPI TARAK" (BANG TARAK) ================= */}
      <BaristaCharacter position={[0.0, 0, -5.2]} rotation={0} />

      {/* ================= 5. CONTROLLERS ================= */}
      <CharacterController />
      <CameraController />
    </>
  );
};
