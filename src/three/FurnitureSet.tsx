'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useOfficeStore } from '@/store/officeStore';
import { AgentId } from '@/types/agent';

// Helper function to create the glowing "KOPI TARAK" signboard texture - Soft Charcoal & Fresh Silver Slate
function createKopiTarakSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Soft charcoal background
  ctx.fillStyle = '#24272E';
  ctx.fillRect(0, 0, 1024, 320);

  // Bright silver slate border
  ctx.save();
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 8;
  ctx.strokeRect(18, 18, 988, 284);
  ctx.restore();

  // Top sub-header
  ctx.font = 'bold 22px monospace';
  ctx.fillStyle = '#94A3B8';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '4px';
  ctx.fillText('KEDAI KOPI REDAKSI VIRTUAL AI', 512, 68);

  // Main Brand Name: ☕ KOPI TARAK
  ctx.font = '900 88px "Courier New", monospace, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('☕ KOPI TARAK', 512, 172);

  // Tagline
  ctx.font = 'bold 24px monospace';
  ctx.fillStyle = '#CBD5E1';
  ctx.fillText('Spesialis Kopi Tarik // Teh Tarik // Kopi Susu', 512, 245);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// ================= DYNAMIC PC MONITOR SCREEN TEXTURE GENERATOR =================
function createMonitorScreenTexture(
  agentId?: string,
  isWorking: boolean = true,
  label?: string,
  hologramText?: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  if (!isWorking) {
    // Standby Screensaver when agent is chilling at Kopi Tarak
    ctx.fillStyle = '#1E2128';
    ctx.fillRect(0, 0, 512, 300);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 492, 280);

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('STANDBY // BREAKROOM MODE', 256, 115);

    ctx.font = '900 34px "Courier New", monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('KOPI TARAK', 256, 165);

    ctx.font = '14px monospace';
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText('Agent is chilling • PC Idle', 256, 205);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }

  // Active Working Monitor
  ctx.fillStyle = '#1E2128';
  ctx.fillRect(0, 0, 512, 300);

  // Top Window Title Bar
  ctx.fillStyle = '#2D323E';
  ctx.fillRect(0, 0, 512, 36);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 512, 36);

  // Square Industrial Window Pips
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(14, 12, 10, 10);
  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(30, 12, 10, 10);
  ctx.fillStyle = '#94A3B8';
  ctx.fillRect(46, 12, 10, 10);

  // Title
  ctx.font = 'bold 14px "Courier New", monospace';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  const title = label ? `${label.toUpperCase()} // WORKSTATION` : 'NEWSROOM // TERMINAL';
  ctx.fillText(title, 70, 24);

  // Right Status
  ctx.textAlign = 'right';
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.fillStyle = '#CBD5E1';
  ctx.fillText('● RUNNING', 496, 24);

  // Directive banner if active
  if (hologramText) {
    ctx.fillStyle = '#0F766E';
    ctx.fillRect(10, 40, 492, 24);
    ctx.fillStyle = '#F0FDFA';
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`⚡ DIRECTIVE: ${hologramText.slice(0, 40)}`, 16, 56);
  }

  // Body content by Agent Role
  ctx.textAlign = 'left';
  ctx.font = '13px "Courier New", monospace';

  if (agentId === 'scout') {
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText('$ ingest --live-feed --sources=antara,detik', 20, 68);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('[ANTARA] BMKG: Cuaca Ekstrem Sepekan Kedepan', 20, 102);
    ctx.fillText('[DETIK]  Akselerasi Ekonomi Digital Q3 2026', 20, 132);
    ctx.fillText('[KOMPAS] Peluncuran Satelit Telekomunikasi Baru', 20, 162);
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText('-> Ingesting raw wire to Scribe queue...', 20, 202);
    ctx.fillStyle = '#2D323E';
    ctx.fillRect(20, 226, 472, 12);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(20, 226, 360, 12);
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Wire Buffer: 14 feeds parsed | Latency 14ms', 20, 268);
  } else if (agentId === 'scribe') {
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText('ENGINE: Gemini 3.8 Flash // 5W+1H DRAFTING', 20, 68);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('# Judul: Terobosan Ekosistem AI Nasional 2026', 20, 102);
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText('Pemerintah resmi merilis cetak biru automasi...', 20, 132);
    ctx.fillText('Naskah: 412 kata (Target: 420 kata) [98%]', 20, 162);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('SEO Score: 94/100 | Keywords: "AI, Digital, 2026"', 20, 192);
    ctx.fillStyle = '#2D323E';
    ctx.fillRect(20, 218, 472, 2);
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText('> Auto-linking "Baca Juga" inserted into draft', 20, 256);
  } else if (agentId === 'pixel') {
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText('IMAGE PIPELINE // SCRAPER + WEBP OPTIMIZER', 20, 68);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Input : cover_hd_source.jpg (2,140 KB)', 20, 102);
    ctx.fillText('Output: cover_opt.webp (54 KB) [-97.5%]', 20, 132);
    ctx.fillText('Dimensions: 1280 x 720 px [Landscape 16:9]', 20, 162);
    ctx.fillStyle = '#A1A1AA';
    ctx.fillText('ImgBB CDN: https://i.ibb.co/newsroom/cv72.webp', 20, 196);
    ctx.fillStyle = '#27272A';
    ctx.fillRect(20, 222, 472, 14);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(20, 222, 430, 14);
    ctx.fillStyle = '#71717A';
    ctx.fillText('Compressor Status: Completed in 142ms', 20, 264);
  } else if (agentId === 'chronos') {
    ctx.fillStyle = '#A1A1AA';
    ctx.fillText('WATERFALL SCHEDULER // TIME PACING ENGINE', 20, 68);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillText('Current Time: 21:00:00 WIB (Synced)', 20, 102);
    ctx.fillText('Next Queue  : 21:45:00 WIB [Slot 01]', 20, 132);
    ctx.fillText('Queue Depth : 6 Articles in Buffer', 20, 162);
    ctx.fillText('Interval Gap: 45 Minutes Waterfall', 20, 192);
    ctx.fillStyle = '#18181B';
    ctx.fillRect(20, 220, 472, 35);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillText('STATUS: Auto-Publisher Daemon Running', 30, 242);
  } else if (agentId === 'radar') {
    ctx.fillStyle = '#A1A1AA';
    ctx.fillText('SEO RADAR // GOOGLE & BING INDEXING DISPATCH', 20, 68);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillText('POST https://indexing.googleapis.com/v3:publish', 20, 102);
    ctx.fillText('Response: 200 OK - URL_UPDATED', 20, 132);
    ctx.fillText('Bing IndexNow: 200 OK - Key validated', 20, 162);
    ctx.fillText('Sitemap Ping: news-sitemap.xml delivered', 20, 192);
    ctx.fillStyle = '#71717A';
    ctx.fillText('Search Impression Index: Active 100%', 20, 252);
  } else if (agentId === 'sentry') {
    ctx.fillStyle = '#A1A1AA';
    ctx.fillText('INFRASTRUCTURE // NEON POSTGRES POOLER', 20, 68);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillText('DB Latency : 22ms STABLE (Neon Serverless)', 20, 102);
    ctx.fillText('Pooler     : 8 Active / 20 Max Connections', 20, 132);
    ctx.fillText('Auto-Purge : Temporary logs cleared 24h', 20, 162);
    ctx.fillText('CPU Usage  : 14% | RAM: 1.18 GB / 4.00 GB', 20, 192);
    ctx.fillStyle = '#71717A';
    ctx.fillText('Zero memory leaks detected • Watchdog OK', 20, 252);
  } else if (agentId === 'hermes') {
    ctx.fillStyle = '#A1A1AA';
    ctx.fillText('HERMES // TELEGRAM BOT DISPATCHER', 20, 68);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillText('Target : @redaksi_portal_berita_channel', 20, 102);
    ctx.fillText('Message: Breaking News broadcast dispatched', 20, 132);
    ctx.fillText('Buttons: [Terbitkan Sekarang] [Edit Draf]', 20, 162);
    ctx.fillText('Status : 100% Delivered (24 Subscribers)', 20, 192);
    ctx.fillStyle = '#71717A';
    ctx.fillText('Webhook: Listening on /api/telegram-webhook', 20, 252);
  } else {
    ctx.fillStyle = '#A1A1AA';
    ctx.fillText('NEWSROOM HQ // AUXILIARY TERMINAL', 20, 68);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillText('System Ready for next task injection.', 20, 108);
    ctx.fillText('Awaiting editor command...', 20, 140);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// ================= DESKTOP PC WORKSTATION UNIT =================
export const DesktopPC: React.FC<{
  position: [number, number, number];
  rotation?: number;
  agentId?: AgentId;
  glowColor?: string;
  label?: string;
}> = ({ position, rotation = 0, agentId, label }) => {
  const selectAgent = useOfficeStore((state) => state.selectAgent);
  const agent = useOfficeStore((state) => (agentId ? state.agents.find((a) => a.id === agentId) : undefined));
  const activeHologram = useOfficeStore((state) => state.activeHologram);
  const isWorking = agent ? agent.status === 'working' : true;
  const hologramText = (activeHologram && activeHologram.agentId === agentId) ? activeHologram.title : undefined;

  const screenTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createMonitorScreenTexture(agentId, isWorking, label, hologramText);
  }, [agentId, isWorking, label, hologramText]);

  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
      onClick={(e) => {
        if (agentId) {
          e.stopPropagation();
          selectAgent(agentId);
        }
      }}
    >
      {/* LCD Monitor Frame - Soft Charcoal Slate */}
      <mesh position={[0, 0.44, 0]} castShadow>
        <boxGeometry args={[0.84, 0.5, 0.04]} />
        <meshStandardMaterial color="#282B33" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Glowing Screen Content with Live Workstation UI */}
      <mesh position={[0, 0.44, 0.022]}>
        <planeGeometry args={[0.8, 0.46]} />
        {screenTexture ? (
          <meshBasicMaterial map={screenTexture} />
        ) : (
          <meshBasicMaterial color={isWorking ? '#FFFFFF' : '#1E2128'} />
        )}
      </mesh>
      {/* Monitor Stand - Fresh Slate Metal */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.06, 0.26, 0.06]} />
        <meshStandardMaterial color="#64748B" metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.26, 0.02, 0.22]} />
        <meshStandardMaterial color="#282B33" metalness={0.7} />
      </mesh>

      {/* Keyboard - Soft Charcoal Slate with Silver Gray Keys */}
      <mesh position={[0, 0.02, 0.45]}>
        <boxGeometry args={[0.48, 0.016, 0.16]} />
        <meshStandardMaterial color="#2B2E37" roughness={0.5} />
      </mesh>

      {/* Mouse & Mousepad - Soft Charcoal & Fresh Silver */}
      <mesh position={[0.32, 0.015, 0.45]}>
        <boxGeometry args={[0.18, 0.005, 0.22]} />
        <meshStandardMaterial color="#282B33" roughness={0.7} />
      </mesh>
      <mesh position={[0.32, 0.025, 0.45]}>
        <boxGeometry args={[0.07, 0.016, 0.11]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.3} />
      </mesh>

      {/* Modern Soft Charcoal PC Tower Under Desk */}
      <mesh position={[-0.44, -0.42, 0.08]} castShadow>
        <boxGeometry args={[0.2, 0.42, 0.45]} />
        <meshStandardMaterial color="#282B33" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
};

// ================= ERGONOMIC SOFT CHARCOAL & SLATE CHAIR =================
export const OfficeChair: React.FC<{
  position: [number, number, number];
  rotation?: number;
}> = ({ position, rotation = 0 }) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Base - Soft Charcoal */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.04, 6]} />
        <meshStandardMaterial color="#282B33" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Piston - Silver Gray Chrome */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.26, 8]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.8} />
      </mesh>
      {/* Seat Cushion - Mid-Slate Mesh */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[0.5, 0.08, 0.5]} />
        <meshStandardMaterial color="#3F434D" roughness={0.7} />
      </mesh>
      {/* Backrest - Fresh Slate Gray */}
      <mesh position={[0, 0.76, -0.2]} castShadow>
        <boxGeometry args={[0.46, 0.6, 0.06]} />
        <meshStandardMaterial color="#333740" roughness={0.6} />
      </mesh>
    </group>
  );
};

// ================= SENTRY DEVOPS SERVER RACK BAY WITH BLINKING LEDS =================
export const SentryServerRackBay: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const incidentAlert = useOfficeStore((state) => state.incidentAlert);
  const selectAgent = useOfficeStore((state) => state.selectAgent);
  const isIncident = incidentAlert.active;

  // Blinking LED state for active server activity
  const [blink, setBlink] = React.useState(false);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setBlink((prev) => !prev);
    }, 450);
    return () => clearInterval(timer);
  }, []);

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        selectAgent('sentry');
      }}
    >
      {[-2.0, 0, 2.0].map((x, idx) => (
        <group key={`server-${idx}`} position={[x, 0, 0]}>
          {/* Main 42U Server Cabinet */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[1.2, 2.4, 0.8]} />
            <meshStandardMaterial color="#282B33" metalness={0.7} roughness={0.4} />
          </mesh>

          {/* 6 Server Blade Slots */}
          {Array.from({ length: 6 }).map((_, slot) => (
            <group key={`slot-${slot}`} position={[0, 0.4 + slot * 0.32, 0.41]}>
              <mesh>
                <boxGeometry args={[1.0, 0.22, 0.02]} />
                <meshStandardMaterial color="#3B404B" metalness={0.6} />
              </mesh>

              {/* Slot Indicator LEDs (activity blinking) */}
              <mesh position={[-0.42, 0, 0.015]}>
                <boxGeometry args={[0.04, 0.04, 0.01]} />
                <meshBasicMaterial
                  color={
                    isIncident
                      ? (blink ? '#EF4444' : '#7F1D1D')
                      : ((slot + idx) % 2 === 0 ? (blink ? '#10B981' : '#047857') : '#06B6D4')
                  }
                />
              </mesh>
              <mesh position={[-0.34, 0, 0.015]}>
                <boxGeometry args={[0.04, 0.04, 0.01]} />
                <meshBasicMaterial
                  color={
                    isIncident
                      ? '#F59E0B'
                      : ((slot + idx) % 3 === 0 ? (blink ? '#38BDF8' : '#0284C7') : '#10B981')
                  }
                />
              </mesh>
            </group>
          ))}

          {/* Rack Top Status Beacon */}
          <mesh position={[-0.35, 1.6, 0.43]}>
            <boxGeometry args={[0.08, 0.08, 0.02]} />
            <meshBasicMaterial color={isIncident ? '#EF4444' : '#34D399'} />
          </mesh>
          <mesh position={[0.35, 1.6, 0.43]}>
            <boxGeometry args={[0.08, 0.08, 0.02]} />
            <meshBasicMaterial color={isIncident ? (blink ? '#F59E0B' : '#78350F') : '#38BDF8'} />
          </mesh>

          {/* Rack Floor Luminous Glow */}
          <pointLight
            position={[0, 0.2, 0.6]}
            intensity={isIncident ? 0.8 : 0.4}
            distance={2.5}
            color={isIncident ? '#EF4444' : '#10B981'}
          />
        </group>
      ))}
    </group>
  );
};

// ================= 1. REDAKSI AI WORKSTATION BAY (SAYAP BARAT) =================
export const OpenOfficeWorkstations: React.FC = () => {
  return (
    <group>
      {/* Central Desk Island in Sayap Barat (centered at X = -13.5, Z = 0) */}
      <group position={[-13.5, 0, 0]}>
        {/* Row 1 Desk Slab (North Desk: Z = -0.6, length = 8.5, width = 1.2) */}
        <mesh position={[0, 0.72, -0.6]} castShadow receiveShadow>
          <boxGeometry args={[8.5, 0.06, 1.2]} />
          <meshStandardMaterial color="#EDF2F7" roughness={0.3} />
        </mesh>

        {/* Center Fabric Acoustic Privacy Divider */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[8.5, 0.4, 0.06]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>

        {/* Row 2 Desk Slab (South Desk: Z = +0.6, length = 8.5, width = 1.2) */}
        <mesh position={[0, 0.72, 0.6]} castShadow receiveShadow>
          <boxGeometry args={[8.5, 0.06, 1.2]} />
          <meshStandardMaterial color="#EDF2F7" roughness={0.3} />
        </mesh>

        {/* Desk Legs */}
        {[-3.8, -1.2, 1.2, 3.8].map((x, i) => (
          <React.Fragment key={`leg-w-${i}`}>
            <mesh position={[x, 0.36, -1.15]}>
              <boxGeometry args={[0.07, 0.72, 0.07]} />
              <meshStandardMaterial color="#2D313A" metalness={0.7} />
            </mesh>
            <mesh position={[x, 0.36, 1.15]}>
              <boxGeometry args={[0.07, 0.72, 0.07]} />
              <meshStandardMaterial color="#2D313A" metalness={0.7} />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* ================= ROW 1 DEDICATED DESKTOPS & CHAIRS ================= */}
      {/* SCRIBE Desk: X = -15.0 */}
      <DesktopPC position={[-15.0, 0.75, -0.25]} rotation={Math.PI} agentId="scribe" label="SCRIBE" />
      <OfficeChair position={[-15.0, 0, -1.35]} rotation={0} />

      {/* PIXEL Desk: X = -12.0 */}
      <DesktopPC position={[-12.0, 0.75, -0.25]} rotation={Math.PI} agentId="pixel" label="PIXEL" />
      <OfficeChair position={[-12.0, 0, -1.35]} rotation={0} />

      {/* ================= ROW 2 DEDICATED DESKTOPS & CHAIRS ================= */}
      {/* CHRONOS Desk: X = -15.0 */}
      <DesktopPC position={[-15.0, 0.75, 0.25]} rotation={0} agentId="chronos" label="CHRONOS" />
      <OfficeChair position={[-15.0, 0, 1.35]} rotation={Math.PI} />

      {/* HERMES Desk: X = -12.0 */}
      <DesktopPC position={[-12.0, 0.75, 0.25]} rotation={0} agentId="hermes" label="HERMES" />
      <OfficeChair position={[-12.0, 0, 1.35]} rotation={Math.PI} />

      {/* RADAR Desk: X = -9.0 */}
      <DesktopPC position={[-9.0, 0.75, 0.25]} rotation={0} agentId="radar" label="RADAR" />
      <OfficeChair position={[-9.0, 0, 1.35]} rotation={Math.PI} />

      {/* ================= SENTRY DEVOPS SERVER RACK BAY ================= */}
      <SentryServerRackBay position={[-18.5, 0, -6.8]} />

      {/* Low Bookshelves along front edge Z = 4.4 */}
      {[-16.0, -12.0].map((x, idx) => (
        <group key={`shelf-w-${idx}`} position={[x, 0, 4.4]}>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[2.4, 0.9, 0.6]} />
            <meshStandardMaterial color="#2D313A" roughness={0.6} />
          </mesh>
          <mesh position={[-0.4, 0.45, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.4]} />
            <meshStandardMaterial color="#CBD5E1" roughness={0.4} />
          </mesh>
          <mesh position={[0.4, 0.45, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.4]} />
            <meshStandardMaterial color="#94A3B8" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ================= 2. BAR "KOPI TARAK" (CENTRAL HUB & CAFE LOUNGE) =================
export const BreakroomKitchenLounge: React.FC = () => {
  const signTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createKopiTarakSignTexture();
  }, []);

  return (
    <group>
      {/* ================= 1. ILLUMINATED OVERHEAD SIGNBOARD "KOPI TARAK" ================= */}
      <group position={[0.0, 3.4, -4.5]}>
        <mesh castShadow>
          <boxGeometry args={[5.2, 1.5, 0.12]} />
          <meshStandardMaterial color="#282B33" roughness={0.5} metalness={0.7} />
        </mesh>
        <mesh position={[-2.2, 1.0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.8} />
        </mesh>
        <mesh position={[2.2, 1.0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.8} />
        </mesh>
        {signTexture && (
          <mesh position={[0, 0, 0.065]}>
            <planeGeometry args={[5.0, 1.35]} />
            <meshBasicMaterial map={signTexture} />
          </mesh>
        )}
      </group>

      {/* ================= 2. HANGING BAR PENDANT LAMPS ================= */}
      {[-1.8, 0, 1.8].map((xOffset, idx) => (
        <group key={`pendant-${idx}`} position={[0.0 + xOffset, 3.0, -4.5]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
            <meshStandardMaterial color="#282B33" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.28, 0.24, 16]} />
            <meshStandardMaterial color="#353942" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.06, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}

      <pointLight position={[0.0, 2.6, -4.5]} color="#FFFFFF" intensity={1.2} distance={10} />

      {/* ================= 3. MAIN FRONT BAR COUNTER (KOPI TARAK) ================= */}
      <group position={[0.0, 0, -4.5]}>
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.6, 1.04, 1.1]} />
          <meshStandardMaterial color="#2E323B" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.15, 0.6]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 5.4, 12]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.06, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.8, 0.08, 1.25]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.25} />
        </mesh>

        {/* Commercial Multi-Head Espresso Machine */}
        <group position={[-1.6, 1.26, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.95, 0.48, 0.55]} />
            <meshStandardMaterial color="#353942" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.88, 0.03, 0.48]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
        </group>

        {/* Coffee Grinder */}
        <group position={[-0.8, 1.32, -0.05]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.09, 0.12, 0.45, 12]} />
            <meshStandardMaterial color="#282B33" metalness={0.7} />
          </mesh>
        </group>

        {/* Pastry Display */}
        <group position={[1.6, 1.25, 0]}>
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[1.1, 0.06, 0.55]} />
            <meshStandardMaterial color="#282B33" />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[1.05, 0.32, 0.5]} />
            <meshPhysicalMaterial color="#F8FAFC" transmission={0.9} transparent opacity={0.4} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* 4 Barstools along front of Kopi Tarak Bar */}
      {[-1.8, -0.6, 0.6, 1.8].map((xOffset, idx) => (
        <group key={`kopi-stool-${idx}`} position={[0.0 + xOffset, 0, -3.2]}>
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.04, 0.08, 0.84, 8]} />
            <meshStandardMaterial color="#64748B" metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.85, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.06, 16]} />
            <meshStandardMaterial color="#383C46" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Back Bar Counter & Shelves */}
      <group position={[0.0, 0, -7.2]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[6.4, 0.9, 0.85]} />
          <meshStandardMaterial color="#2A2D35" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.92, 0]}>
          <boxGeometry args={[6.5, 0.05, 0.9]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.3} />
        </mesh>
        <mesh position={[4.2, 1.2, 0.1]} castShadow>
          <boxGeometry args={[1.4, 2.4, 1.0]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Communal Dining Table in Central Hub */}
      <group position={[0.0, 0, 2.5]}>
        <mesh position={[0, 0.44, 0]} castShadow>
          <boxGeometry args={[3.2, 0.06, 1.4]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.3} />
        </mesh>
        <mesh position={[-1.3, 0.22, 0]}>
          <boxGeometry args={[0.08, 0.44, 1.2]} />
          <meshStandardMaterial color="#2D313A" metalness={0.7} />
        </mesh>
        <mesh position={[1.3, 0.22, 0]}>
          <boxGeometry args={[0.08, 0.44, 1.2]} />
          <meshStandardMaterial color="#2D313A" metalness={0.7} />
        </mesh>
      </group>
    </group>
  );
};

// ================= 3. RADAR INTEL WORKSTATION BAY (SAYAP TIMUR) =================
export const RadarIntelWorkstations: React.FC = () => {
  return (
    <group>
      {/* ================= CLUSTER 1: NORTH RADAR DESK (Z = -2.6) ================= */}
      {/* 3 Workstations: SCOUT (Tekno), GENTRA (Politik), VERITAS (Hukum) */}
      <group position={[13.5, 0, -2.6]}>
        {/* Table Slab */}
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[10.5, 0.06, 1.2]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Acoustic Cyber Divider */}
        <mesh position={[0, 0.95, -0.58]} castShadow>
          <boxGeometry args={[10.5, 0.4, 0.05]} />
          <meshStandardMaterial color="#0284C7" roughness={0.5} />
        </mesh>
        {/* Desk Legs */}
        {[-4.8, -1.6, 1.6, 4.8].map((x, i) => (
          <React.Fragment key={`leg-n-${i}`}>
            <mesh position={[x, 0.36, -0.5]}>
              <boxGeometry args={[0.07, 0.72, 0.07]} />
              <meshStandardMaterial color="#0F172A" metalness={0.8} />
            </mesh>
            <mesh position={[x, 0.36, 0.5]}>
              <boxGeometry args={[0.07, 0.72, 0.07]} />
              <meshStandardMaterial color="#0F172A" metalness={0.8} />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* North Desktops & Chairs (Facing South, character sits at Z = -3.2 looking towards desk at Z = -2.6) */}
      {/* 1. SCOUT (Tekno & AI): X = 9.5 */}
      <DesktopPC position={[9.5, 0.75, -2.4]} rotation={Math.PI} agentId="scout" label="SCOUT [TEKNO]" />
      <OfficeChair position={[9.5, 0, -3.2]} rotation={0} />

      {/* 2. GENTRA (Politik & Pemilu): X = 13.5 */}
      <DesktopPC position={[13.5, 0.75, -2.4]} rotation={Math.PI} agentId="gentra" label="GENTRA [POLITIK]" />
      <OfficeChair position={[13.5, 0, -3.2]} rotation={0} />

      {/* 3. VERITAS (Hukum & Fakta): X = 17.5 */}
      <DesktopPC position={[17.5, 0.75, -2.4]} rotation={Math.PI} agentId="veritas" label="VERITAS [HUKUM]" />
      <OfficeChair position={[17.5, 0, -3.2]} rotation={0} />

      {/* ================= CLUSTER 2: SOUTH RADAR DESK (Z = 2.6) ================= */}
      {/* 3 Workstations: GAIA (Lingkungan), ARTHA (Bisnis), CIPHER (Internasional) */}
      <group position={[13.5, 0, 2.6]}>
        {/* Table Slab */}
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[10.5, 0.06, 1.2]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Acoustic Cyber Divider */}
        <mesh position={[0, 0.95, 0.58]} castShadow>
          <boxGeometry args={[10.5, 0.4, 0.05]} />
          <meshStandardMaterial color="#10B981" roughness={0.5} />
        </mesh>
        {/* Desk Legs */}
        {[-4.8, -1.6, 1.6, 4.8].map((x, i) => (
          <React.Fragment key={`leg-s-${i}`}>
            <mesh position={[x, 0.36, -0.5]}>
              <boxGeometry args={[0.07, 0.72, 0.07]} />
              <meshStandardMaterial color="#0F172A" metalness={0.8} />
            </mesh>
            <mesh position={[x, 0.36, 0.5]}>
              <boxGeometry args={[0.07, 0.72, 0.07]} />
              <meshStandardMaterial color="#0F172A" metalness={0.8} />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* South Desktops & Chairs (Facing North, character sits at Z = 3.2 looking towards desk at Z = 2.6) */}
      {/* 4. GAIA (Lingkungan & Iklim): X = 9.5 */}
      <DesktopPC position={[9.5, 0.75, 2.4]} rotation={0} agentId="gaia" label="GAIA [IKLIM]" />
      <OfficeChair position={[9.5, 0, 3.2]} rotation={Math.PI} />

      {/* 5. ARTHA (Bisnis & Ekonomi): X = 13.5 */}
      <DesktopPC position={[13.5, 0.75, 2.4]} rotation={0} agentId="artha" label="ARTHA [BISNIS]" />
      <OfficeChair position={[13.5, 0, 3.2]} rotation={Math.PI} />

      {/* 6. CIPHER (Internasional & Geopolitik): X = 17.5 */}
      <DesktopPC position={[17.5, 0.75, 2.4]} rotation={0} agentId="cipher" label="CIPHER [GLOBAL]" />
      <OfficeChair position={[17.5, 0, 3.2]} rotation={Math.PI} />

      {/* ================= CLUSTER 3: TELEBOT SENTRAL RADAR TRANSMISSION TOWER (X = 13.5, Z = 0) ================= */}
      <group position={[13.5, 0, 0]}>
        {/* Cylindrical / Octagonal Command Pedestal */}
        <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.1, 1.2, 0.72, 16]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Luminous Orange Neon Rim */}
        <mesh position={[0, 0.73, 0]}>
          <cylinderGeometry args={[1.12, 1.12, 0.03, 16]} />
          <meshBasicMaterial color="#F97316" />
        </mesh>
        {/* Central Telegram Transmission Antenna Mast */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 1.3, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        {/* Glowing Radar Pulse Sphere on top */}
        <mesh position={[0, 2.1, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshBasicMaterial color="#FB923C" />
        </mesh>
        <pointLight position={[0, 2.1, 0]} color="#F97316" intensity={1.2} distance={4} />

        {/* Dual Curved Command Hologram Screens */}
        <mesh position={[0.45, 1.05, 0.3]} rotation={[0, -0.6, 0]}>
          <boxGeometry args={[0.6, 0.35, 0.02]} />
          <meshBasicMaterial color="#0284C7" />
        </mesh>
        <mesh position={[0.45, 1.05, -0.3]} rotation={[0, 0.6, 0]}>
          <boxGeometry args={[0.6, 0.35, 0.02]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
      </group>

      {/* TELEBOT Command Chair */}
      <OfficeChair position={[12.3, 0, 0]} rotation={Math.PI / 2} />

      {/* ================= OSINT SERVER RACK BAY (EAST WING) ================= */}
      <SentryServerRackBay position={[19.5, 0, -6.8]} />
    </group>
  );
};
