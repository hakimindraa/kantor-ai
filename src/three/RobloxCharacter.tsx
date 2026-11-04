'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { AgentData } from '@/types/agent';
import { useOfficeStore } from '@/store/officeStore';

const AGENT_THOUGHTS: Record<string, { work: string[]; chill: string[] }> = {
  scout: {
    work: [
      '“Scanning 24 feed berita nasional...”',
      '“Tangkap breaking news terbaru!”',
      '“Draf mentah dikirim ke meja Scribe.”',
      '“Memantau trending topik hari ini...”'
    ],
    chill: [
      '“Nyeruput kopi hitam dulu bang...”',
      '“Break bentar, feed berita lagi sepi.”',
      '“Kopi Tarak mantap racikannya.”'
    ]
  },
  scribe: {
    work: [
      '“Menyusun draf 420 kata via Gemini...”',
      '“Bikin judul editorial yang nendang...”',
      '“Cek kaidah jurnalistik 5W+1H...”',
      '“Pasang internal link Baca Juga...”'
    ],
    chill: [
      '“Ngopi bentar cari inspirasi judul...”',
      '“Ngobrol santai bareng Bang Tarak...”',
      '“Istirahatin mata dari ketikan draf...”'
    ]
  },
  pixel: {
    work: [
      '“Cari foto landscape HD tanpa watermark...”',
      '“Kompresi WebP dari 2MB jadi 54 KB!”',
      '“Upload foto cover ke ImgBB CDN...”',
      '“Resolusi 1280x720 siap tayang...”'
    ],
    chill: [
      '“Duduk santai di meja bar Kopi Tarak...”',
      '“Kamera standby, rileks dulu...”',
      '“Espresso Bang Tarak bikin melek.”'
    ]
  },
  chronos: {
    work: [
      '“Atur jeda 45 menit antar berita...”',
      '“Artikel berikutnya rilis tepat waktu!”',
      '“Cek antrean buffer waterfall queue...”',
      '“Ritme tayang berita aman terkendali.”'
    ],
    chill: [
      '“Semua antrean terjadwal rapi...”',
      '“Waktunya break ngopi sore...”',
      '“Kopi Tarak suasananya adem ya.”'
    ]
  },
  radar: {
    work: [
      '“Kirim sinyal Google Indexing API...”',
      '“Bing IndexNow: Status 200 OK!”',
      '“Artikel langsung tembus halaman 1...”',
      '“Update sitemap & feed RSS live...”'
    ],
    chill: [
      '“SEO artikel peringkat 1 aman...”',
      '“Pantau metrik sambil ngopi...”',
      '“Kopi tarik Bang Tarak the best!”'
    ]
  },
  sentry: {
    work: [
      '“Cek latensi Neon DB: 22ms stabil...”',
      '“Auto-purge bersihkan log temp 24 jam...”',
      '“Pooler connection aman & kencang!”',
      '“Monitoring server VPS lancar jaya...”'
    ],
    chill: [
      '“Server dingin, sistem aman terkendali.”',
      '“Ngopi dulu, server zero error...”',
      '“Breakroom Kopi Tarak nyaman banget.”'
    ]
  },
  hermes: {
    work: [
      '“Kirim laporan instan ke Telegram Boss!”',
      '“Menunggu respon approval admin...”',
      '“Broadcast channel terkirim sukses...”',
      '“Notifikasi breaking news delivered.”'
    ],
    chill: [
      '“Admin lagi online di smartphone...”',
      '“Santai dulu bareng tim di bar...”',
      '“Kopi susu gula aren enak nih.”'
    ]
  }
};

function createThoughtBubbleTexture(thought: string, mainColor: string = '#CBD5E1'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 110;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const x = 12;
  const y = 8;
  const w = 488;
  const h = 76;

  // Background Box - Soft Charcoal
  ctx.fillStyle = '#1E222A';
  ctx.fillRect(x, y, w, h);

  // Border - Tinted with agent's signature soft bright color
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = mainColor;
  ctx.strokeRect(x, y, w, h);

  // Downward pointer arrow towards head
  ctx.beginPath();
  ctx.moveTo(244, y + h);
  ctx.lineTo(256, y + h + 18);
  ctx.lineTo(268, y + h);
  ctx.fillStyle = '#1E222A';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(244, y + h);
  ctx.lineTo(256, y + h + 18);
  ctx.lineTo(268, y + h);
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = mainColor;
  ctx.stroke();

  // Quote / Thought Text - Pure White
  ctx.font = 'bold 20px "Courier New", monospace, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(thought, x + w / 2, y + h / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createAgentBadgeTexture(name: string, isWorking: boolean, mainColor: string = '#38BDF8'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const w = 480;
  const h = 88;
  const x = 16;
  const y = 20;

  // Soft Charcoal Base Tag
  ctx.fillStyle = '#1E222A';
  ctx.fillRect(x, y, w, h);

  // Slate Gray Border with subtle tint
  ctx.lineWidth = 4;
  ctx.strokeStyle = isWorking ? mainColor : '#475569';
  ctx.strokeRect(x, y, w, h);

  // Left status pip (square) in agent's signature bright color!
  ctx.fillStyle = isWorking ? mainColor : '#94A3B8';
  ctx.fillRect(x + 24, y + (h - 16) / 2, 16, 16);

  // Agent Name
  ctx.font = '900 32px "Courier New", monospace, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(name.toUpperCase(), x + 56, y + h / 2 + 2);

  // Status Badge on right - Sharp Box
  const badgeText = isWorking ? 'KERJA' : 'NYANTAI';
  ctx.font = '900 22px "Courier New", monospace';
  const badgeTextWidth = ctx.measureText(badgeText).width;
  const badgeW = badgeTextWidth + 30;
  const badgeH = 46;
  const badgeX = x + w - badgeW - 16;
  const badgeY = y + (h - badgeH) / 2;

  if (isWorking) {
    ctx.fillStyle = mainColor;
    ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
    ctx.fillStyle = '#0F172A'; // Crisp dark contrast text on bright color
  } else {
    ctx.fillStyle = '#2B2E37';
    ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#64748B';
    ctx.strokeRect(badgeX, badgeY, badgeW, badgeH);
    ctx.fillStyle = '#CBD5E1';
  }

  ctx.textAlign = 'center';
  ctx.fillText(badgeText, badgeX + badgeW / 2, badgeY + badgeH / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

interface RobloxCharacterProps {
  agent: AgentData;
  isControlled?: boolean;
  manualPosition?: [number, number, number];
  manualRotation?: number;
  isMoving?: boolean;
}

export const RobloxCharacter: React.FC<RobloxCharacterProps> = ({
  agent,
  isControlled = false,
  manualPosition,
  manualRotation,
  isMoving = false
}) => {
  const selectAgent = useOfficeStore((state) => state.selectAgent);
  const selectedAgentId = useOfficeStore((state) => state.selectedAgentId);
  const movementMode = useOfficeStore((state) => state.movementMode);

  const isSelected = selectedAgentId === agent.id;
  const isWorking = agent.status === 'working';
  const isChilling = agent.status === 'idle';

  const rootGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  // Minimalist Art-Toy Warm Vinyl Skin Tone (warm peach/beige, separates from white desk and dark background)
  const skinColor = '#FDE2CA';

  // Soft-Bright Modern Art-Toy Outfits (distinctive, bright yet soft colors)
  const agentStyle = useMemo(() => {
    switch (agent.id) {
      case 'scout':
        return {
          mainColor: '#F59E0B',   // Warm Honey Amber
          torso: '#F59E0B',       // Soft Amber coat
          sleeve: '#F59E0B',
          accent: '#FEF3C7',      // Warm buttery cream vest
          tie: '#1E293B',         // Dark slate tie
          legs: '#334155',        // Slate navy pants
          hatBase: '#D97706',     // Deep amber fedora brim
          hatCrown: '#F59E0B',    // Amber crown
          hatRibbon: '#FEF3C7'    // Cream ribbon
        };
      case 'scribe':
        return {
          mainColor: '#10B981',   // Fresh Sage / Emerald Mint
          torso: '#34D399',       // Soft bright mint green shirt
          sleeve: '#34D399',
          accent: '#065F46',      // Deep emerald tie
          tie: '#065F46',
          legs: '#1E293B',        // Dark slate trousers
          hatBase: '#047857',
          hatCrown: '#059669',
          hatRibbon: '#A7F3D0',
          glasses: '#1E293B'      // Glasses frame
        };
      case 'pixel':
        return {
          mainColor: '#F43F5E',   // Soft Coral Rose
          torso: '#FB7185',       // Vibrant soft coral hoodie
          sleeve: '#FB7185',
          accent: '#FFE4E6',      // Pastel pink kangaroo pocket
          tie: '#FDA4AF',
          legs: '#334155',        // Denim slate chinos
          hatBase: '#F43F5E',     // Coral cap
          hatCrown: '#FB7185',
          hatRibbon: '#FFE4E6'    // Pastel pink brim
        };
      case 'chronos':
        return {
          mainColor: '#0EA5E9',   // Soft Sky Cerulean
          torso: '#38BDF8',       // Luminous sky blue turtleneck
          sleeve: '#38BDF8',
          accent: '#E0F2FE',      // Ice blue tech stripe
          tie: '#0284C7',
          legs: '#1E293B',        // Dark slate pants
          hatBase: '#0284C7',
          hatCrown: '#0369A1',
          hatRibbon: '#BAE6FD',
          visorFrame: '#0369A1',
          visorGlow: '#7DD3FC'    // Glowing sky visor
        };
      case 'radar':
        return {
          mainColor: '#A855F7',   // Soft Lilac / Violet
          torso: '#C084FC',       // Fresh soft lavender crewneck
          sleeve: '#C084FC',
          accent: '#F3E8FF',      // Soft lilac-white telemetry straps
          tie: '#7E22CE',
          legs: '#334155',        // Slate chinos
          hatBase: '#9333EA',
          hatCrown: '#A855F7',
          hatRibbon: '#E9D5FF',
          antenna: '#F3E8FF'
        };
      case 'sentry':
        return {
          mainColor: '#84CC16',   // Soft Cyber Lime
          torso: '#84CC16',       // Soft chartreuse tactical vest
          sleeve: '#3F6212',      // Tactical forest contrast sleeves
          accent: '#ECFCCB',      // Bright lime armor plate
          tie: '#1E293B',
          legs: '#1E293B',        // Tactical dark slate pants
          hatBase: '#365314',     // Stealth helmet
          hatCrown: '#3F6212',
          hatRibbon: '#BEF264',
          visorGlow: '#BEF264'
        };
      case 'hermes':
      default:
        return {
          mainColor: '#F97316',   // Soft Tangerine Orange
          torso: '#FB923C',       // Warm soft tangerine courier jacket
          sleeve: '#FB923C',
          accent: '#7C2D12',      // Rich leather courier cross-harness
          tie: '#7C2D12',
          legs: '#1E293B',        // Dark courier pants
          hatBase: '#EA580C',     // Courier cap
          hatCrown: '#F97316',
          hatRibbon: '#FFEDD5'
        };
    }
  }, [agent.id]);

  // Exact target position and rotation based on live state
  const currentTargetPos = useMemo((): [number, number, number] => {
    return isWorking ? agent.deskPosition : agent.chillPosition;
  }, [isWorking, agent.deskPosition, agent.chillPosition]);

  const currentTargetRot = useMemo((): number => {
    return isWorking ? agent.deskRotation : agent.chillRotation;
  }, [isWorking, agent.deskRotation, agent.chillRotation]);

  const badgeTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createAgentBadgeTexture(agent.name, isWorking, agentStyle.mainColor);
  }, [agent.name, isWorking, agentStyle.mainColor]);

  const [thoughtIndex, setThoughtIndex] = useState(0);

  useEffect(() => {
    const pool = AGENT_THOUGHTS[agent.id];
    if (!pool) return;
    const list = isWorking ? pool.work : pool.chill;
    const offset = (agent.id.charCodeAt(0) % 5) * 800;
    const timer = setInterval(() => {
      setThoughtIndex((prev) => (prev + 1) % list.length);
    }, 6000 + offset);
    return () => clearInterval(timer);
  }, [agent.id, isWorking]);

  const currentThought = useMemo(() => {
    const pool = AGENT_THOUGHTS[agent.id];
    if (!pool) return '...';
    const list = isWorking ? pool.work : pool.chill;
    return list[thoughtIndex % list.length] || list[0];
  }, [agent.id, isWorking, thoughtIndex]);

  const thoughtTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createThoughtBubbleTexture(currentThought, agentStyle.mainColor);
  }, [currentThought, agentStyle.mainColor]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // 1. If manually controlled by player (WASD)
    if (isControlled && movementMode === 'MANUAL') {
      if (manualPosition && rootGroupRef.current) {
        rootGroupRef.current.position.set(manualPosition[0], manualPosition[1], manualPosition[2]);
      }
      if (manualRotation !== undefined && rootGroupRef.current) {
        rootGroupRef.current.rotation.y = manualRotation;
      }

      if (isMoving) {
        const walkSpeed = 10;
        const swing = Math.sin(time * walkSpeed) * 0.6;
        if (leftLegRef.current) {
          leftLegRef.current.position.set(-0.24, 0.55, 0);
          leftLegRef.current.rotation.set(swing, 0, 0);
        }
        if (rightLegRef.current) {
          rightLegRef.current.position.set(0.24, 0.55, 0);
          rightLegRef.current.rotation.set(-swing, 0, 0);
        }
        if (leftArmRef.current) {
          leftArmRef.current.position.set(-0.52, 1.25, 0);
          leftArmRef.current.rotation.set(-swing * 0.8, 0, 0);
        }
        if (rightArmRef.current) {
          rightArmRef.current.position.set(0.52, 1.25, 0);
          rightArmRef.current.rotation.set(swing * 0.8, 0, 0);
        }
        if (torsoRef.current) torsoRef.current.position.set(0, 0.95 + Math.abs(Math.sin(time * walkSpeed)) * 0.05, 0);
        if (headRef.current) {
          headRef.current.position.set(0, 1.58, 0);
          headRef.current.rotation.set(0, 0, 0);
        }
      } else {
        if (leftLegRef.current) {
          leftLegRef.current.position.set(-0.24, 0.55, 0);
          leftLegRef.current.rotation.set(0, 0, 0);
        }
        if (rightLegRef.current) {
          rightLegRef.current.position.set(0.24, 0.55, 0);
          rightLegRef.current.rotation.set(0, 0, 0);
        }
        if (leftArmRef.current) {
          leftArmRef.current.position.set(-0.52, 1.25, 0);
          leftArmRef.current.rotation.set(0, 0, 0);
        }
        if (rightArmRef.current) {
          rightArmRef.current.position.set(0.52, 1.25, 0);
          rightArmRef.current.rotation.set(0, 0, 0);
        }
        if (torsoRef.current) torsoRef.current.position.set(0, 0.95, 0);
        if (headRef.current) {
          headRef.current.position.set(0, 1.58, 0);
          headRef.current.rotation.set(0, 0, 0);
        }
      }
      return;
    }

    if (!rootGroupRef.current) return;

    // Reset base transform to current target
    rootGroupRef.current.position.set(currentTargetPos[0], currentTargetPos[1], currentTargetPos[2]);
    rootGroupRef.current.rotation.y = currentTargetRot;

    // ================= STATE ANIMATION =================
    if (isWorking) {
      // 💻 BEKERJA DI MEJA PC (DUDUK TEGAK DI KURSI KANTOR, MENGETIK KEYBOARD)
      // Top surface of office chair cushion is at Y = 0.46. Torso bottom rests directly on cushion (0.46 + 0.85/2 = 0.885).
      if (torsoRef.current) {
        torsoRef.current.position.set(0, 0.885, 0.02);
      }

      // Legs bent forward resting horizontally on seat cushion
      if (leftLegRef.current) {
        leftLegRef.current.position.set(-0.24, 0.52, 0.08);
        leftLegRef.current.rotation.set(-Math.PI / 2.3, 0, 0);
      }
      if (rightLegRef.current) {
        rightLegRef.current.position.set(0.24, 0.52, 0.08);
        rightLegRef.current.rotation.set(-Math.PI / 2.3, 0, 0);
      }

      // Head sitting on top of torso neck (top of torso is 1.31, head center 1.31 + 0.275 = 1.585)
      // Slight reading glance across monitor
      if (headRef.current) {
        headRef.current.position.set(0, 1.585, 0.02);
        headRef.current.rotation.set(0.08, Math.sin(time * 0.9) * 0.12, 0);
      }

      // Shoulders move down with torso (shoulder Y = 1.21). Hands actively typing on keyboard
      const typeSpeed = 13;
      const leftType = -Math.PI / 3.0 + Math.sin(time * typeSpeed) * 0.1;
      const rightType = -Math.PI / 3.0 + Math.cos(time * typeSpeed + 1) * 0.1;
      if (leftArmRef.current) {
        leftArmRef.current.position.set(-0.52, 1.21, 0.02);
        leftArmRef.current.rotation.set(leftType, 0, 0.12);
      }
      if (rightArmRef.current) {
        rightArmRef.current.position.set(0.52, 1.21, 0.02);
        rightArmRef.current.rotation.set(rightType, 0, -0.12);
      }
    } else {
      // ☕ NYANTAI DI BREAKROOM
      if (agent.id === 'pixel') {
        // Pixel sits on high barstool (seat top is at Y = 0.88)
        if (torsoRef.current) torsoRef.current.position.set(0, 1.305, 0);
        if (headRef.current) {
          headRef.current.position.set(0, 2.005, 0);
          headRef.current.rotation.set(0, Math.sin(time * 0.6) * 0.25, 0);
        }
        if (leftLegRef.current) {
          leftLegRef.current.position.set(-0.24, 0.95, 0.06);
          leftLegRef.current.rotation.set(-0.28, 0, 0);
        }
        if (rightLegRef.current) {
          rightLegRef.current.position.set(0.24, 0.95, 0.06);
          rightLegRef.current.rotation.set(-0.28, 0, 0);
        }
        if (leftArmRef.current) {
          leftArmRef.current.position.set(-0.52, 1.63, 0);
          leftArmRef.current.rotation.set(-Math.PI / 3.5, 0, 0.15);
        }
        if (rightArmRef.current) {
          rightArmRef.current.position.set(0.52, 1.63, 0);
          const sip = Math.sin(time * 1.3);
          rightArmRef.current.rotation.set(-Math.PI / 2.5 + sip * 0.2, 0, -0.2);
        }
      } else if (['scout', 'scribe', 'chronos', 'radar'].includes(agent.id)) {
        // Sitting on cafe dining chair (seat cushion top is at Y = 0.48)
        if (torsoRef.current) torsoRef.current.position.set(0, 0.905, 0.02);
        if (headRef.current) {
          headRef.current.position.set(0, 1.605, 0.02);
          headRef.current.rotation.set(0, Math.sin(time * 0.5) * 0.25, 0);
        }
        if (leftLegRef.current) {
          leftLegRef.current.position.set(-0.24, 0.54, 0.08);
          leftLegRef.current.rotation.set(-Math.PI / 2.3, 0, 0);
        }
        if (rightLegRef.current) {
          rightLegRef.current.position.set(0.24, 0.54, 0.08);
          rightLegRef.current.rotation.set(-Math.PI / 2.3, 0, 0);
        }
        if (leftArmRef.current) {
          leftArmRef.current.position.set(-0.52, 1.23, 0.02);
          leftArmRef.current.rotation.set(-Math.PI / 4, 0, 0.15);
        }
        if (rightArmRef.current) {
          rightArmRef.current.position.set(0.52, 1.23, 0.02);
          const sip = Math.sin(time * 1.4);
          rightArmRef.current.rotation.set(-Math.PI / 2.5 + sip * 0.22, 0, -0.2);
        }
      } else {
        // Standing relaxing near fridge (Sentry) / coffee machine (Hermes)
        if (torsoRef.current) torsoRef.current.position.set(0, 0.95, 0);
        if (headRef.current) {
          headRef.current.position.set(0, 1.58, 0);
          headRef.current.rotation.set(0, Math.sin(time * 0.4) * 0.3, 0);
        }
        if (leftLegRef.current) {
          leftLegRef.current.position.set(-0.24, 0.55, 0);
          leftLegRef.current.rotation.set(0, 0, 0);
        }
        if (rightLegRef.current) {
          rightLegRef.current.position.set(0.24, 0.55, 0);
          rightLegRef.current.rotation.set(0, 0, 0);
        }
        if (leftArmRef.current) {
          leftArmRef.current.position.set(-0.52, 1.25, 0);
          leftArmRef.current.rotation.set(-0.2, 0, 0.1);
        }
        if (rightArmRef.current) {
          rightArmRef.current.position.set(0.52, 1.25, 0);
          rightArmRef.current.rotation.set(-Math.PI / 2.6 + Math.sin(time * 0.8) * 0.1, 0, -0.15);
        }
      }
    }
  });

  return (
    <group
      ref={rootGroupRef}
      onClick={(e) => {
        e.stopPropagation();
        selectAgent(agent.id);
      }}
    >
      {/* Selected Indicator Hologram Ring - Signature Agent Color */}
      {isSelected && (
        <group position={[0, 0.05, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.78, 0.88, 32]} />
            <meshBasicMaterial color={agentStyle.mainColor} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.66, 0.70, 32]} />
            <meshBasicMaterial color="#FFFFFF" side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* Floating Status Pill: KERJA vs NYANTAI */}
      {badgeTexture && (
        <Billboard
          position={[0, isWorking ? 2.25 : (agent.id === 'pixel' && isChilling ? 2.70 : 2.55), 0]}
          follow={true}
        >
          <mesh
            renderOrder={998}
            onClick={(e) => {
              e.stopPropagation();
              selectAgent(agent.id);
            }}
          >
            <planeGeometry args={[1.8, 0.45]} />
            <meshBasicMaterial
              map={badgeTexture}
              transparent={true}
              depthTest={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Billboard>
      )}

      {/* Floating Live Thought Bubble */}
      {thoughtTexture && (
        <Billboard
          position={[0, isWorking ? 2.80 : (agent.id === 'pixel' && isChilling ? 3.25 : 3.10), 0]}
          follow={true}
        >
          <mesh
            renderOrder={999}
            onClick={(e) => {
              e.stopPropagation();
              selectAgent(agent.id);
            }}
          >
            <planeGeometry args={[2.5, 0.55]} />
            <meshBasicMaterial
              map={thoughtTexture}
              transparent={true}
              depthTest={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Billboard>
      )}

      {/* ================= ROBLOX BLOCKY RIG - MINIMALIST INDUSTRIAL ================= */}

      {/* 1. TORSO */}
      <group ref={torsoRef} position={[0, 0.95, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.75, 0.85, 0.44]} />
          <meshStandardMaterial color={agentStyle.torso} roughness={0.4} metalness={0.05} />
        </mesh>

        {/* Minimalist Front Chest Detail */}
        {agent.id === 'scout' && (
          <group position={[0, 0.08, 0.23]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.22, 0.52, 0.02]} />
              <meshStandardMaterial color={agentStyle.accent} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.04, 0.015]}>
              <boxGeometry args={[0.08, 0.38, 0.02]} />
              <meshStandardMaterial color={agentStyle.tie} roughness={0.3} />
            </mesh>
          </group>
        )}
        {agent.id === 'scribe' && (
          <group position={[0, 0.06, 0.23]}>
            <mesh>
              <boxGeometry args={[0.1, 0.52, 0.02]} />
              <meshStandardMaterial color={agentStyle.accent} roughness={0.3} />
            </mesh>
          </group>
        )}
        {agent.id === 'pixel' && (
          <mesh position={[0, -0.15, 0.23]}>
            <boxGeometry args={[0.42, 0.22, 0.03]} />
            <meshStandardMaterial color={agentStyle.accent} roughness={0.6} />
          </mesh>
        )}
        {agent.id === 'chronos' && (
          <mesh position={[0, 0.08, 0.23]}>
            <boxGeometry args={[0.55, 0.1, 0.02]} />
            <meshStandardMaterial color={agentStyle.accent} roughness={0.4} />
          </mesh>
        )}
        {agent.id === 'radar' && (
          <group position={[0, 0.08, 0.23]}>
            <mesh position={[-0.14, 0, 0]}>
              <boxGeometry args={[0.06, 0.48, 0.02]} />
              <meshStandardMaterial color={agentStyle.accent} />
            </mesh>
            <mesh position={[0.14, 0, 0]}>
              <boxGeometry args={[0.06, 0.48, 0.02]} />
              <meshStandardMaterial color={agentStyle.accent} />
            </mesh>
          </group>
        )}
        {agent.id === 'sentry' && (
          <mesh position={[0, 0.05, 0.23]}>
            <boxGeometry args={[0.55, 0.58, 0.03]} />
            <meshStandardMaterial color={agentStyle.accent} roughness={0.4} />
          </mesh>
        )}
        {agent.id === 'hermes' && (
          <group position={[0, 0, 0.23]}>
            <mesh position={[-0.18, 0, 0]} rotation={[0, 0, 0.2]}>
              <boxGeometry args={[0.08, 0.86, 0.02]} />
              <meshStandardMaterial color={agentStyle.accent} />
            </mesh>
            <mesh position={[0.18, 0, 0]} rotation={[0, 0, -0.2]}>
              <boxGeometry args={[0.08, 0.86, 0.02]} />
              <meshStandardMaterial color={agentStyle.accent} />
            </mesh>
          </group>
        )}
      </group>

      {/* 2. HEAD */}
      <group ref={headRef} position={[0, 1.58, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshStandardMaterial color={skinColor} roughness={0.4} />
        </mesh>

        {/* Eyes (Local +Z face) - Soft Charcoal */}
        <mesh position={[-0.14, 0.05, 0.28]}>
          <boxGeometry args={[0.08, 0.09, 0.02]} />
          <meshBasicMaterial color="#1E222A" />
        </mesh>
        <mesh position={[0.14, 0.05, 0.28]}>
          <boxGeometry args={[0.08, 0.09, 0.02]} />
          <meshBasicMaterial color="#1E222A" />
        </mesh>
        {/* Smile */}
        <mesh position={[0, -0.12, 0.28]}>
          <boxGeometry args={[0.22, 0.04, 0.02]} />
          <meshBasicMaterial color="#64748B" />
        </mesh>

        {/* ================= AGENT SPECIFIC HEADWEAR ================= */}
        {/* SCOUT: Honey Amber Fedora Hat */}
        {agent.id === 'scout' && (
          <group position={[0, 0.3, 0]}>
            <mesh>
              <boxGeometry args={[0.85, 0.06, 0.85]} />
              <meshStandardMaterial color={agentStyle.hatBase} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.16, 0]}>
              <boxGeometry args={[0.55, 0.26, 0.55]} />
              <meshStandardMaterial color={agentStyle.hatCrown} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.07, 0]}>
              <boxGeometry args={[0.57, 0.06, 0.57]} />
              <meshStandardMaterial color={agentStyle.hatRibbon} roughness={0.3} />
            </mesh>
          </group>
        )}

        {/* SCRIBE: Minimalist Architect Glasses */}
        {agent.id === 'scribe' && (
          <group position={[0, 0.05, 0.3]}>
            <mesh>
              <boxGeometry args={[0.48, 0.12, 0.03]} />
              <meshStandardMaterial color={agentStyle.glasses || '#1E293B'} metalness={0.7} roughness={0.2} />
            </mesh>
          </group>
        )}

        {/* PIXEL: Streetwear Coral Cap */}
        {agent.id === 'pixel' && (
          <group position={[0, 0.28, 0]}>
            <mesh>
              <boxGeometry args={[0.58, 0.16, 0.58]} />
              <meshStandardMaterial color={agentStyle.hatBase} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.05, 0.36]} rotation={[-0.2, 0, 0]}>
              <boxGeometry args={[0.45, 0.04, 0.22]} />
              <meshStandardMaterial color={agentStyle.hatRibbon} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.08, 0.29]}>
              <boxGeometry args={[0.12, 0.06, 0.02]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
          </group>
        )}

        {/* CHRONOS: Luminous Sky Blue Cyber Visor */}
        {agent.id === 'chronos' && (
          <group position={[0, 0.05, 0.29]}>
            <mesh>
              <boxGeometry args={[0.58, 0.14, 0.04]} />
              <meshStandardMaterial color={agentStyle.visorFrame || '#0369A1'} metalness={0.6} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <boxGeometry args={[0.52, 0.08, 0.02]} />
              <meshBasicMaterial color={agentStyle.visorGlow || '#7DD3FC'} />
            </mesh>
          </group>
        )}

        {/* RADAR: Brushed Antenna Headset */}
        {agent.id === 'radar' && (
          <group position={[0, 0.28, 0]}>
            <mesh position={[0.28, 0, 0]}>
              <boxGeometry args={[0.06, 0.2, 0.2]} />
              <meshStandardMaterial color={agentStyle.hatBase} metalness={0.6} />
            </mesh>
            <mesh position={[0.3, 0.25, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
              <meshStandardMaterial color={agentStyle.antenna || '#F3E8FF'} metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        )}

        {/* SENTRY: Stealth Lime Cyber Helmet */}
        {agent.id === 'sentry' && (
          <group>
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[0.62, 0.65, 0.62]} />
              <meshStandardMaterial color={agentStyle.hatBase} metalness={0.5} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.05, 0.31]}>
              <boxGeometry args={[0.52, 0.12, 0.03]} />
              <meshBasicMaterial color={agentStyle.visorGlow || '#BEF264'} />
            </mesh>
          </group>
        )}

        {/* HERMES: Dispatch Envoy Cap */}
        {agent.id === 'hermes' && (
          <group position={[0, 0.28, 0]}>
            <mesh>
              <boxGeometry args={[0.58, 0.16, 0.58]} />
              <meshStandardMaterial color={agentStyle.hatBase} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.05, 0.36]} rotation={[-0.2, 0, 0]}>
              <boxGeometry args={[0.45, 0.04, 0.22]} />
              <meshStandardMaterial color={agentStyle.hatRibbon} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.08, 0.29]}>
              <boxGeometry args={[0.24, 0.02, 0.02]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
          </group>
        )}
      </group>

      {/* 3. ARMS */}
      <group ref={leftArmRef} position={[-0.52, 1.25, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <boxGeometry args={[0.26, 0.75, 0.3]} />
          <meshStandardMaterial color={agentStyle.sleeve} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.78, 0]}>
          <boxGeometry args={[0.22, 0.16, 0.26]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.52, 1.25, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <boxGeometry args={[0.26, 0.75, 0.3]} />
          <meshStandardMaterial color={agentStyle.sleeve} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.78, 0]}>
          <boxGeometry args={[0.22, 0.16, 0.26]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>

        {/* Coffee Mug in Hand when Chilling / Nyantai! */}
        {isChilling && (
          <group position={[0, -0.85, 0.18]} rotation={[0.4, 0, 0]}>
            {/* Ceramic Mug - Signature Agent Color */}
            <mesh>
              <cylinderGeometry args={[0.08, 0.08, 0.16, 12]} />
              <meshStandardMaterial color={agentStyle.mainColor} roughness={0.3} />
            </mesh>
            {/* Dark Espresso Liquid inside */}
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.075, 0.075, 0.02, 12]} />
              <meshStandardMaterial color="#22252C" roughness={0.1} />
            </mesh>
            {/* Mug Handle */}
            <mesh position={[0.1, 0, 0]}>
              <boxGeometry args={[0.04, 0.09, 0.04]} />
              <meshStandardMaterial color={agentStyle.mainColor} />
            </mesh>
          </group>
        )}
      </group>

      {/* 4. LEGS */}
      <group ref={leftLegRef} position={[-0.24, 0.55, 0]}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <boxGeometry args={[0.3, 0.65, 0.35]} />
          <meshStandardMaterial color={agentStyle.legs} roughness={0.7} />
        </mesh>
      </group>

      <group ref={rightLegRef} position={[0.24, 0.55, 0]}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <boxGeometry args={[0.3, 0.65, 0.35]} />
          <meshStandardMaterial color={agentStyle.legs} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
};
