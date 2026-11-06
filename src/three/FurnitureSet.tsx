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
  } else if (agentId === 'scout_west') {
    ctx.fillStyle = '#38BDF8';
    ctx.fillText('RADAR BARAT // INCOMING DRAFT INGESTION', 20, 68);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillText('Incoming: 24/7 Multi-portal Breaking Wire', 20, 102);
    ctx.fillText('Endpoint: /api/incoming-news (200 OK)', 20, 132);
    ctx.fillText('Filter  : Anti-Duplikasi & Filter Hoaks', 20, 162);
    ctx.fillText('Status  : Standby Menunggu Draf Baru', 20, 192);
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(20, 222, 472, 14);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(20, 222, 400, 14);
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Radar Telemetry Active • West Wing Redaksi', 20, 264);
  } else if (agentId === 'sadur') {
    ctx.fillStyle = '#C4B5FD';
    ctx.fillText('URL SYNTHESIZER // MEJA KLIPING & SADUR', 20, 68);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillText('Rujukan : Portal Berita & Dokumen Luar', 20, 102);
    ctx.fillText('Metode  : Sintesis Berimbang 5W+1H', 20, 132);
    ctx.fillText('Validasi: Sitasi Orisinal 98.5% Unik', 20, 162);
    ctx.fillText('Status  : Menyusun Ringkasan Saduran', 20, 192);
    ctx.fillStyle = '#7C3AED';
    ctx.fillRect(20, 222, 472, 14);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(20, 222, 380, 14);
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Kliping Jurnalistik Siap Disetor ke Meja Redaksi', 20, 264);
  } else if (agentId === 'nova') {
    ctx.fillStyle = '#F472B6';
    ctx.fillText('AI STUDIO LAB // MULTI-LLM LAB TUBE', 20, 68);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillText('Model   : Gemini 3.8 Flash // Multi-turn', 20, 102);
    ctx.fillText('Sesi    : Investigasi Kontekstual Mendalam', 20, 132);
    ctx.fillText('Tabung  : Partikel Hologram Aktif', 20, 162);
    ctx.fillText('Keluaran: Naskah Naratif Komparatif', 20, 192);
    ctx.fillStyle = '#DB2777';
    ctx.fillRect(20, 222, 472, 14);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(20, 222, 450, 14);
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('AI Studio Lab Online • Generative Pipeline OK', 20, 264);
  } else if (agentId === 'hrd') {
    ctx.fillStyle = '#93C5FD';
    ctx.fillText('TIM PENULIS // ROSTER & ONBOARDING', 20, 68);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillText('Roster  : 14 Jurnalis & Kontributor', 20, 102);
    ctx.fillText('Struktur: Dewan Redaksi & Tim Investigasi', 20, 132);
    ctx.fillText('Onboard : Akun Wartawan Baru Tervalidasi', 20, 162);
    ctx.fillText('Akses   : Admin AdaFakta Terotorisasi', 20, 192);
    ctx.fillStyle = '#2563EB';
    ctx.fillRect(20, 222, 472, 14);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(20, 222, 410, 14);
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Manajemen Redaksi & Struktur Tim Stabil', 20, 264);
  } else if (agentId === 'robosweep') {
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('ROBO-SWEEP // AUTONOMOUS DB VACUUM', 20, 68);
    ctx.fillStyle = '#FAFAFA';
    ctx.fillText('Daya    : 100% Penuh (Docked / Charging)', 20, 102);
    ctx.fillText('Target  : Cache Basi & Temporary Logs', 20, 132);
    ctx.fillText('Vacuum  : Lantai Server Zero Dust', 20, 162);
    ctx.fillText('Siklus  : Pembersihan Harian Terjadwal', 20, 192);
    ctx.fillStyle = '#475569';
    ctx.fillRect(20, 222, 472, 14);
    ctx.fillStyle = '#10B981';
    ctx.fillRect(20, 222, 472, 14);
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText('Neon DB Cleaned • Latensi 22ms', 20, 264);
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
      {/* ───────────────── RUANG 1: SERVER & DEVOPS ROOM (X: -23 s/d -30, Z: -5 s/d -10) ───── */}
      {/* 42U Server Rack Bay */}
      <SentryServerRackBay position={[-27.5, 0, -8.0]} />

      {/* Sentry DevOps Terminal Desk */}
      <group position={[-25.0, 0, -7.5]}>
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.06, 0.9]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh position={[-0.8, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.72, 0.8]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
        <mesh position={[0.8, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.72, 0.8]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
      </group>
      <DesktopPC position={[-25.0, 0.75, -7.3]} rotation={Math.PI} agentId="sentry" label="SENTRY [SERVER]" />
      <OfficeChair position={[-25.0, 0, -8.3]} rotation={0} />

      {/* Robo-Sweep Floor Charging Dock Station */}
      <group position={[-28.8, 0, -6.0]}>
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <boxGeometry args={[0.9, 0.04, 0.8]} />
          <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.18, -0.34]} castShadow>
          <boxGeometry args={[0.6, 0.32, 0.1]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[-0.15, 0.28, -0.28]}>
          <boxGeometry args={[0.04, 0.04, 0.02]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
        <mesh position={[0.15, 0.28, -0.28]}>
          <boxGeometry args={[0.04, 0.04, 0.02]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
      </group>

      {/* ───────────────── RUANG 2: STUDIO FOTO & MULTIMEDIA (X: -14.5 s/d -22.5, Z: -5 s/d -10) ─ */}
      {/* Studio Photo Cyclorama Backdrop */}
      <group position={[-18.5, 0, -9.6]}>
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[4.2, 3.6, 0.04]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.9} />
        </mesh>
        <mesh position={[-2.1, 1.8, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 3.6, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        <mesh position={[2.1, 1.8, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 3.6, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
      </group>

      {/* Pixel Editing Workstation Desk */}
      <group position={[-18.5, 0, -7.5]}>
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.06, 0.9]} />
          <meshStandardMaterial color="#22262E" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[-0.9, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.72, 0.8]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
        <mesh position={[0.9, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.72, 0.8]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
      </group>
      <DesktopPC position={[-18.5, 0.75, -7.3]} rotation={Math.PI} agentId="pixel" label="PIXEL [FOTO]" />
      <OfficeChair position={[-18.5, 0, -8.3]} rotation={0} />

      {/* Studio Camera on Tripod + Blitz Softbox Umbrella */}
      <group position={[-15.8, 0, -7.5]}>
        {[-0.2, 0, 0.2].map((angle, idx) => (
          <mesh key={`tripod-p-${idx}`} position={[Math.sin(angle * 4) * 0.18, 0.6, Math.cos(angle * 4) * 0.18]} rotation={[0.15 * Math.cos(angle * 4), 0, -0.15 * Math.sin(angle * 4)]}>
            <cylinderGeometry args={[0.015, 0.02, 1.2, 8]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
        ))}
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[0.24, 0.18, 0.22]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 1.25, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.075, 0.14, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.9} />
        </mesh>
        {/* Softbox / Blitz Diffuser */}
        <mesh position={[0.3, 1.6, -0.05]} rotation={[0.3, -0.5, 0]}>
          <boxGeometry args={[0.45, 0.45, 0.08]} />
          <meshStandardMaterial color="#F43F5E" roughness={0.4} />
        </mesh>
        <mesh position={[0.3, 1.6, -0.01]} rotation={[0.3, -0.5, 0]}>
          <planeGeometry args={[0.42, 0.42]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* ───────────────── RUANG 5: BIRO KLIPING & SADUR URL (X: -6.5 s/d -14.5, Z: -5 s/d -10) ─ */}
      {/* Sadur Vintage Wooden Desk */}
      <group position={[-10.5, 0, -7.5]}>
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.06, 1.0]} />
          <meshStandardMaterial color="#451A03" roughness={0.6} />
        </mesh>
        <mesh position={[-1.0, 0.36, 0]}>
          <boxGeometry args={[0.08, 0.72, 0.9]} />
          <meshStandardMaterial color="#291203" roughness={0.7} />
        </mesh>
        <mesh position={[1.0, 0.36, 0]}>
          <boxGeometry args={[0.08, 0.72, 0.9]} />
          <meshStandardMaterial color="#291203" roughness={0.7} />
        </mesh>
      </group>
      <DesktopPC position={[-10.5, 0.75, -7.3]} rotation={Math.PI} agentId="sadur" label="SADUR [URL]" />
      <OfficeChair position={[-10.5, 0, -8.3]} rotation={0} />

      {/* Broadsheet Newspaper Stacks & Vintage Brass Desk Lamp */}
      <group position={[-9.2, 0.75, -7.3]}>
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[0.46, 0.08, 0.35]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.9} />
        </mesh>
        <mesh position={[0.02, 0.1, -0.02]} rotation={[0, 0.12, 0]}>
          <boxGeometry args={[0.44, 0.04, 0.32]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.9} />
        </mesh>
        <mesh position={[0.26, 0.22, -0.1]}>
          <cylinderGeometry args={[0.015, 0.015, 0.44, 8]} />
          <meshStandardMaterial color="#D97706" metalness={0.8} />
        </mesh>
        <mesh position={[0.26, 0.42, -0.05]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.15, 0.14, 12]} />
          <meshStandardMaterial color="#059669" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* ───────────────── RUANG 4: AULA UTAMA & PANGGUNG REDAKSI (X: -14.5 s/d -22.5, Z: -4 s/d +4) ─ */}
      {/* PANGGUNG PODIUM TERBIT TENGAH (AGENT REDAKSI / SCRIBE) */}
      <group position={[-18.5, 0, 0]}>
        {/* Raised Circular Dais / Stage */}
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 1.9, 0.16, 24]} />
          <meshStandardMaterial color="#0F172A" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Gold & Emerald Outer Rim */}
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[1.82, 1.82, 0.02, 24]} />
          <meshStandardMaterial color="#10B981" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Red Carpet Stage Runner */}
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[1.65, 1.65, 0.01, 24]} />
          <meshStandardMaterial color="#991B1B" roughness={0.8} />
        </mesh>

        {/* Elegant Wooden Rostrum / Podium Stand */}
        <group position={[0, 0.18, 0.4]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.7, 1.0, 0.5]} />
            <meshStandardMaterial color="#451A03" roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.02, 0]} rotation={[-0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.8, 0.06, 0.55]} />
            <meshStandardMaterial color="#78350F" roughness={0.4} />
          </mesh>
          {/* AdaFakta Gold Emblem Seal */}
          <mesh position={[0, 0.65, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Gooseneck Mic */}
          <mesh position={[-0.2, 1.15, 0.05]} rotation={[0.3, 0, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.28, 8]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
          <mesh position={[-0.2, 1.28, 0.09]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#10B981" />
          </mesh>
        </group>

        {/* Scribe Publishing Terminal Console */}
        <DesktopPC position={[0, 0.88, 0.4]} rotation={Math.PI} agentId="scribe" label="SCRIBE [PUBLISH]" />

        {/* Dual Confetti Cannon Launch Tubes */}
        <group position={[-1.3, 0.18, -0.2]} rotation={[0.4, 0, -0.4]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.1, 0.65, 12]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.8} />
          </mesh>
        </group>
        <group position={[1.3, 0.18, -0.2]} rotation={[0.4, 0, 0.4]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.1, 0.65, 12]} />
            <meshStandardMaterial color="#10B981" metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* MEJA RADAR DRAF MASUK (AGENT SCOUT BARAT): X = -23.5, Z = 0.0 */}
      <group position={[-23.5, 0, 0]}>
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.06, 0.9]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[-0.9, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.72, 0.8]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
        <mesh position={[0.9, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.72, 0.8]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
      </group>
      <DesktopPC position={[-23.5, 0.75, 0.15]} rotation={0} agentId="scout_west" label="SCOUT [BARAT]" />
      <OfficeChair position={[-23.5, 0, -0.9]} rotation={0} />
      {/* Radar Dish / Wire Ingestion Antenna */}
      <group position={[-24.3, 0.75, 0.15]}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#64748B" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.32, 0]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.02, 0.06, 16]} />
          <meshStandardMaterial color="#0284C7" metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.34, 0.02]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
      </group>

      {/* MEJA WATERFALL QUEUE SCHEDULER (CHRONOS): X = -13.5, Z = 0.0 */}
      <group position={[-13.5, 0, 0]}>
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.06, 0.9]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[-0.9, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.72, 0.8]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
        <mesh position={[0.9, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.72, 0.8]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
      </group>
      <DesktopPC position={[-13.5, 0.75, 0.15]} rotation={0} agentId="chronos" label="CHRONOS" />
      <OfficeChair position={[-13.5, 0, -0.9]} rotation={0} />

      {/* ───────────────── RUANG 3: LAB INOVASI AI STUDIO (X: -22.5 s/d -30.5, Z: +4.5 s/d +10) ─ */}
      {/* Nova Cyber Lab Desk */}
      <group position={[-25.5, 0, 7.5]}>
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.06, 1.0]} />
          <meshStandardMaterial color="#201528" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[-1.0, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.72, 0.9]} />
          <meshStandardMaterial color="#3B1238" metalness={0.8} />
        </mesh>
        <mesh position={[1.0, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.72, 0.9]} />
          <meshStandardMaterial color="#3B1238" metalness={0.8} />
        </mesh>
      </group>
      <DesktopPC position={[-25.5, 0.75, 7.3]} rotation={0} agentId="nova" label="NOVA [AI STUDIO]" />
      <OfficeChair position={[-25.5, 0, 8.3]} rotation={Math.PI} />

      {/* AI Studio Transparent Cylinder Hologram Tube */}
      <group position={[-28.5, 0, 7.5]}>
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.6, 0.24, 24]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.57, 0.57, 0.02, 24]} />
          <meshBasicMaterial color="#EC4899" />
        </mesh>
        {/* Glass Cylinder Tube */}
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.46, 0.46, 2.0, 24]} />
          <meshPhysicalMaterial color="#F472B6" transmission={0.9} transparent opacity={0.35} roughness={0.1} />
        </mesh>
        {/* Top Metallic Cap */}
        <mesh position={[0, 2.3, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.14, 24]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>
        {/* Internal Glowing Holographic Core & Particles */}
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.7, 12]} />
          <meshBasicMaterial color="#F472B6" />
        </mesh>
        <pointLight position={[0, 1.25, 0]} color="#EC4899" intensity={1.5} distance={4} />
      </group>

      {/* ───────────────── RUANG 6: BIRO TIM PENULIS, HRD & SEO (X: -6.5 s/d -14.5, Z: +4.5 s/d +10) ─ */}
      {/* Standing Whiteboard with Roster Badges */}
      <group position={[-10.5, 0, 9.4]}>
        <mesh position={[-0.8, 1.0, 0]}>
          <boxGeometry args={[0.04, 2.0, 0.04]} />
          <meshStandardMaterial color="#64748B" metalness={0.8} />
        </mesh>
        <mesh position={[0.8, 1.0, 0]}>
          <boxGeometry args={[0.04, 2.0, 0.04]} />
          <meshStandardMaterial color="#64748B" metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[1.7, 1.2, 0.04]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[1.76, 1.26, 0.03]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.7} />
        </mesh>
        {[-0.5, 0, 0.5].map((xOffset, idx) => (
          <mesh key={`badge-hrd-${idx}`} position={[xOffset, 1.35, -0.025]}>
            <boxGeometry args={[0.34, 0.2, 0.01]} />
            <meshStandardMaterial color={idx === 0 ? '#3B82F6' : idx === 1 ? '#10B981' : '#F59E0B'} />
          </mesh>
        ))}
      </group>

      {/* HRD Bureau Desk */}
      <group position={[-12.5, 0, 7.2]}>
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.06, 0.9]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[-0.8, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.72, 0.8]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
        <mesh position={[0.8, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.72, 0.8]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
      </group>
      <DesktopPC position={[-12.5, 0.75, 7.0]} rotation={0} agentId="hrd" label="HRD [TIM PENULIS]" />
      <OfficeChair position={[-12.5, 0, 8.0]} rotation={Math.PI} />

      {/* Radar SEO Workstation Desk */}
      <group position={[-8.5, 0, 7.2]}>
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.06, 0.9]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[-0.8, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.72, 0.8]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
        <mesh position={[0.8, 0.36, 0]}>
          <boxGeometry args={[0.06, 0.72, 0.8]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
      </group>
      <DesktopPC position={[-8.5, 0.75, 7.0]} rotation={0} agentId="radar" label="RADAR [SEO]" />
      <OfficeChair position={[-8.5, 0, 8.0]} rotation={Math.PI} />
    </group>
  );
};

// ================= 2. BAR "KOPI TARAK" (ZONA PERBATASAN TENGAH: X = -1.5, Z = -5.0) =================
export const BreakroomKitchenLounge: React.FC = () => {
  const signTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createKopiTarakSignTexture();
  }, []);

  return (
    <group position={[-1.5, 0, -5.0]}>
      {/* ================= 1. ILLUMINATED OVERHEAD SIGNBOARD "KOPI TARAK" ================= */}
      <group position={[0, 3.3, 0]}>
        <mesh castShadow>
          <boxGeometry args={[4.6, 1.2, 0.12]} />
          <meshStandardMaterial color="#282B33" roughness={0.5} metalness={0.7} />
        </mesh>
        <mesh position={[-1.9, 0.8, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.8} />
        </mesh>
        <mesh position={[1.9, 0.8, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.8} />
        </mesh>
        {signTexture && (
          <mesh position={[0, 0, 0.065]}>
            <planeGeometry args={[4.4, 1.05]} />
            <meshBasicMaterial map={signTexture} />
          </mesh>
        )}
      </group>

      {/* ================= 2. HANGING BAR PENDANT LAMPS ================= */}
      {[-1.4, 0, 1.4].map((xOffset, idx) => (
        <group key={`pendant-${idx}`} position={[xOffset, 2.9, 0.2]}>
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

      <pointLight position={[0, 2.5, 0.2]} color="#FFFFFF" intensity={1.2} distance={8} />

      {/* ================= 3. MAIN FRONT BAR COUNTER (KOPI TARAK) ================= */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.8, 1.04, 1.0]} />
          <meshStandardMaterial color="#2E323B" roughness={0.7} />
        </mesh>
        {/* Foot Rail facing south towards patrons */}
        <mesh position={[0, 0.15, 0.55]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 4.6, 12]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.06, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.0, 0.08, 1.15]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.25} />
        </mesh>

        {/* Commercial Multi-Head Espresso Machine */}
        <group position={[-1.3, 1.26, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.85, 0.48, 0.5]} />
            <meshStandardMaterial color="#353942" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.8, 0.03, 0.45]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
        </group>

        {/* Coffee Grinder */}
        <group position={[-0.6, 1.32, -0.05]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.09, 0.12, 0.45, 12]} />
            <meshStandardMaterial color="#282B33" metalness={0.7} />
          </mesh>
        </group>

        {/* Pastry Display */}
        <group position={[1.3, 1.25, 0]}>
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.95, 0.06, 0.5]} />
            <meshStandardMaterial color="#282B33" />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.9, 0.32, 0.45]} />
            <meshPhysicalMaterial color="#F8FAFC" transmission={0.9} transparent opacity={0.4} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* 4 Barstools along front of Kopi Tarak Bar (facing counter, world Z = -3.7) */}
      {[-1.8, -0.6, 0.6, 1.8].map((xOffset, idx) => (
        <group key={`kopi-stool-${idx}`} position={[xOffset, 0, 1.3]}>
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

      {/* Back Bar Shelves behind Barista (world Z = -7.5) */}
      <group position={[0, 0, -2.5]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[4.8, 0.9, 0.8]} />
          <meshStandardMaterial color="#2A2D35" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.92, 0]}>
          <boxGeometry args={[4.9, 0.05, 0.85]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.3} />
        </mesh>
      </group>

      {/* Communal Dining / Lounge Table in South Half of Central Hub (world Z = +6.0) */}
      <group position={[0, 0, 11.0]}>
        <mesh position={[0, 0.44, 0]} castShadow>
          <boxGeometry args={[3.2, 0.06, 1.2]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.3} />
        </mesh>
        <mesh position={[-1.3, 0.22, 0]}>
          <boxGeometry args={[0.08, 0.44, 1.0]} />
          <meshStandardMaterial color="#2D313A" metalness={0.7} />
        </mesh>
        <mesh position={[1.3, 0.22, 0]}>
          <boxGeometry args={[0.08, 0.44, 1.0]} />
          <meshStandardMaterial color="#2D313A" metalness={0.7} />
        </mesh>

        {/* Chairs around communal table */}
        <OfficeChair position={[-0.8, 0, -0.9]} rotation={0} />
        <OfficeChair position={[0.8, 0, -0.9]} rotation={0} />
        <OfficeChair position={[-0.8, 0, 0.9]} rotation={Math.PI} />
        <OfficeChair position={[0.8, 0, 0.9]} rotation={Math.PI} />
      </group>
    </group>
  );
};

// ================= 3. RADAR INTEL WORKSTATION BAY (KANTOR TIMUR: X = +3.5 s/d +17.5) =================
export const RadarIntelWorkstations: React.FC = () => {
  return (
    <group>
      {/* ================= CLUSTER 1: NORTH RADAR DESK (Z = -3.0, centered at X = 10.5) ================= */}
      {/* 3 Workstations: SCOUT (Tekno), GENTRA (Politik), VERITAS (Hukum) */}
      <group position={[10.5, 0, -3.0]}>
        {/* Table Slab */}
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.8, 0.06, 1.2]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Acoustic Cyber Divider */}
        <mesh position={[0, 0.95, -0.58]} castShadow>
          <boxGeometry args={[7.8, 0.4, 0.05]} />
          <meshStandardMaterial color="#0284C7" roughness={0.5} />
        </mesh>
        {/* Desk Legs */}
        {[-3.6, -1.2, 1.2, 3.6].map((x, i) => (
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

      {/* North Desktops & Chairs (Facing South, sitting at Z = -3.8) */}
      {/* 1. SCOUT (Tekno & AI): X = 7.5 */}
      <DesktopPC position={[7.5, 0.75, -2.8]} rotation={Math.PI} agentId="scout" label="SCOUT [TEKNO]" />
      <OfficeChair position={[7.5, 0, -3.8]} rotation={0} />

      {/* 2. GENTRA (Politik & Pemilu): X = 10.5 */}
      <DesktopPC position={[10.5, 0.75, -2.8]} rotation={Math.PI} agentId="gentra" label="GENTRA [POLITIK]" />
      <OfficeChair position={[10.5, 0, -3.8]} rotation={0} />

      {/* 3. VERITAS (Hukum & Fakta): X = 13.5 */}
      <DesktopPC position={[13.5, 0.75, -2.8]} rotation={Math.PI} agentId="veritas" label="VERITAS [HUKUM]" />
      <OfficeChair position={[13.5, 0, -3.8]} rotation={0} />

      {/* ================= CLUSTER 2: SOUTH RADAR DESK (Z = 3.0, centered at X = 10.5) ================= */}
      {/* 3 Workstations: GAIA (Lingkungan), ARTHA (Bisnis), CIPHER (Internasional) */}
      <group position={[10.5, 0, 3.0]}>
        {/* Table Slab */}
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.8, 0.06, 1.2]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Acoustic Cyber Divider */}
        <mesh position={[0, 0.95, 0.58]} castShadow>
          <boxGeometry args={[7.8, 0.4, 0.05]} />
          <meshStandardMaterial color="#10B981" roughness={0.5} />
        </mesh>
        {/* Desk Legs */}
        {[-3.6, -1.2, 1.2, 3.6].map((x, i) => (
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

      {/* South Desktops & Chairs (Facing North, sitting at Z = 3.8) */}
      {/* 4. GAIA (Lingkungan & Iklim): X = 7.5 */}
      <DesktopPC position={[7.5, 0.75, 2.8]} rotation={0} agentId="gaia" label="GAIA [IKLIM]" />
      <OfficeChair position={[7.5, 0, 3.8]} rotation={Math.PI} />

      {/* 5. ARTHA (Bisnis & Ekonomi): X = 10.5 */}
      <DesktopPC position={[10.5, 0.75, 2.8]} rotation={0} agentId="artha" label="ARTHA [BISNIS]" />
      <OfficeChair position={[10.5, 0, 3.8]} rotation={Math.PI} />

      {/* 6. CIPHER (Internasional & Geopolitik): X = 13.5 */}
      <DesktopPC position={[13.5, 0.75, 2.8]} rotation={0} agentId="cipher" label="CIPHER [GLOBAL]" />
      <OfficeChair position={[13.5, 0, 3.8]} rotation={Math.PI} />

      {/* ================= CLUSTER 3: TELEBOT SENTRAL RADAR TRANSMISSION TOWER (X = 10.5, Z = 0) ================= */}
      <group position={[10.5, 0, 0]}>
        {/* Cylindrical Command Pedestal */}
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
        <pointLight position={[0, 2.1, 0]} color="#F97316" intensity={1.2} distance={5} />

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
      <OfficeChair position={[9.3, 0, 0]} rotation={Math.PI / 2} />

      {/* ================= OSINT SERVER RACK BAY (KANTOR TIMUR) ================= */}
      <SentryServerRackBay position={[15.5, 0, -7.5]} />
    </group>
  );
};
