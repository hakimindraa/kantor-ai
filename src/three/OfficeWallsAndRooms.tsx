'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useOfficeStore } from '@/store/officeStore';

function createWarRoomVideoWallTexture(
  articlesCount: number,
  publishedToday: number,
  latestTitle: string,
  isIncident: boolean
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background - Dark Cyber Slate
  ctx.fillStyle = '#0B0F19';
  ctx.fillRect(0, 0, 1024, 512);

  // Outer border
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, 1004, 492);

  // Header Bar
  ctx.fillStyle = '#111827';
  ctx.fillRect(10, 10, 1004, 60);

  ctx.font = 'bold 20px "Courier New", monospace';
  ctx.fillStyle = '#38BDF8';
  ctx.textAlign = 'left';
  ctx.fillText('NEWSROOM WAR ROOM // LIVE AUTOMATION MISSION CONTROL', 30, 48);

  ctx.textAlign = 'right';
  ctx.fillStyle = isIncident ? '#EF4444' : '#10B981';
  ctx.fillText(isIncident ? '● SYSTEM WARNING' : '● ALL SYSTEMS NOMINAL', 990, 48);

  // Telemetry Grid - 3 Large Cards
  // Card 1: Articles Published
  ctx.fillStyle = '#1E2433';
  ctx.fillRect(30, 90, 300, 130);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 90, 300, 130);

  ctx.textAlign = 'left';
  ctx.font = '12px "Courier New", monospace';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('ARTIKEL HARI INI', 46, 120);
  ctx.font = '900 42px "Courier New", monospace';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`${publishedToday} POSTS`, 46, 175);
  ctx.font = '11px "Courier New", monospace';
  ctx.fillStyle = '#38BDF8';
  ctx.fillText('Scheduled: 45m Waterfall', 46, 205);

  // Card 2: Engine Status
  ctx.fillStyle = '#1E2433';
  ctx.fillRect(360, 90, 300, 130);
  ctx.strokeStyle = '#34D399';
  ctx.lineWidth = 2;
  ctx.strokeRect(360, 90, 300, 130);

  ctx.font = '12px "Courier New", monospace';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('GEMINI & WEBP OPTIMIZER', 376, 120);
  ctx.font = '900 36px "Courier New", monospace';
  ctx.fillStyle = '#34D399';
  ctx.fillText('-97.5% WEBP', 376, 175);
  ctx.font = '11px "Courier New", monospace';
  ctx.fillStyle = '#A7F3D0';
  ctx.fillText('Avg Draft Time: 2.4s', 376, 205);

  // Card 3: Neon Server Latency
  ctx.fillStyle = '#1E2433';
  ctx.fillRect(690, 90, 300, 130);
  ctx.strokeStyle = isIncident ? '#EF4444' : '#A855F7';
  ctx.lineWidth = 2;
  ctx.strokeRect(690, 90, 300, 130);

  ctx.font = '12px "Courier New", monospace';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('NEON POSTGRES POOLER', 706, 120);
  ctx.font = '900 42px "Courier New", monospace';
  ctx.fillStyle = isIncident ? '#EF4444' : '#C084FC';
  ctx.fillText(isIncident ? 'LATENCY 140ms' : '22ms 100% OK', 706, 175);
  ctx.font = '11px "Courier New", monospace';
  ctx.fillStyle = '#E9D5FF';
  ctx.fillText('Auto-Purge Watchdog Active', 706, 205);

  // Middle Section: Pipeline Progress Bar
  ctx.fillStyle = '#131B2E';
  ctx.fillRect(30, 240, 960, 110);
  ctx.strokeStyle = '#334155';
  ctx.strokeRect(30, 240, 960, 110);

  ctx.font = 'bold 13px "Courier New", monospace';
  ctx.fillStyle = '#F8FAFC';
  ctx.fillText('AUTOMATED NEWS PIPELINE STATUS:', 46, 270);

  const steps = [
    { label: '1. Scrape Wire', done: true, color: '#38BDF8' },
    { label: '2. Gemini Draft', done: true, color: '#34D399' },
    { label: '3. WebP Optimize', done: true, color: '#F472B6' },
    { label: '4. Waterfall Queue', done: true, color: '#F59E0B' },
    { label: '5. Google Indexing', done: true, color: '#A855F7' }
  ];

  steps.forEach((step, i) => {
    const x = 46 + i * 190;
    ctx.fillStyle = step.done ? step.color : '#334155';
    ctx.fillRect(x, 290, 175, 36);
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(step.label, x + 87, 312);
  });

  // Bottom Ticker - Latest Published Article
  ctx.fillStyle = '#111827';
  ctx.fillRect(30, 375, 960, 105);
  ctx.strokeStyle = '#1E293B';
  ctx.strokeRect(30, 375, 960, 105);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.fillText('● LATEST LIVE PUBLISHED HEADLINE (adafakta.web.id):', 46, 405);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 17px "Courier New", monospace';
  ctx.fillText(
    latestTitle.length > 58 ? latestTitle.substring(0, 58) + '...' : latestTitle,
    46,
    442
  );

  ctx.fillStyle = '#64748B';
  ctx.font = '11px "Courier New", monospace';
  ctx.fillText('Autonomous Newsroom Engine • 24/7 Zero Human Overhead', 46, 465);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export const WarRoomVideoWall: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  const stats = useOfficeStore((state) => state.stats);
  const articles = useOfficeStore((state) => state.articles);
  const incidentAlert = useOfficeStore((state) => state.incidentAlert);

  const latestPublished = articles.find((a) => a.currentStage === 'published');
  const latestTitle = latestPublished
    ? latestPublished.title
    : 'Indonesia Percepat Regulasi AI untuk Efisiensi Birokrasi 2026';

  const videoWallTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createWarRoomVideoWallTexture(
      stats.publishedToday || 181,
      stats.articlesToday || 181,
      latestTitle,
      incidentAlert.active
    );
  }, [stats.publishedToday, stats.articlesToday, latestTitle, incidentAlert.active]);

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        if (typeof window !== 'undefined') {
          window.open('https://www.adafakta.web.id', '_blank');
        }
      }}
    >
      {/* Outer Bezel Frame */}
      <mesh castShadow>
        <boxGeometry args={[5.8, 2.8, 0.08]} />
        <meshStandardMaterial color="#1E2430" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Screen Canvas Surface */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[5.6, 2.6]} />
        {videoWallTexture ? (
          <meshBasicMaterial map={videoWallTexture} />
        ) : (
          <meshBasicMaterial color="#0B0F19" />
        )}
      </mesh>

      {/* Video Wall Soft Ambient Projector Glow */}
      <pointLight position={[0, 0, 0.8]} intensity={0.9} distance={6} color="#38BDF8" />
    </group>
  );
};

// ================= RADAR VIDEO WALL TEXTURE (EAST WING) =================
function createRadarVideoWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background - Cyber Deep Navy
  ctx.fillStyle = '#060B14';
  ctx.fillRect(0, 0, 1024, 512);

  // Outer Border
  ctx.strokeStyle = '#0284C7';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, 1004, 492);

  // Header Bar
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(10, 10, 1004, 60);

  ctx.font = 'bold 20px "Courier New", monospace';
  ctx.fillStyle = '#38BDF8';
  ctx.textAlign = 'left';
  ctx.fillText('📡 ADAFAKTA INTELLIGENCE RADAR // 6 RSS CHANNELS ACTIVE', 30, 48);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#10B981';
  ctx.fillText('● BOT TELEGRAM: ONLINE 24/7', 990, 48);

  // 3 Feature Cards
  // Card 1: 6 RSS Sources
  ctx.fillStyle = '#0B132B';
  ctx.fillRect(30, 90, 300, 130);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 90, 300, 130);

  ctx.textAlign = 'left';
  ctx.font = '12px "Courier New", monospace';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('KANAL RSS AKTIF', 46, 120);
  ctx.font = '900 40px "Courier New", monospace';
  ctx.fillStyle = '#38BDF8';
  ctx.fillText('6 FEED', 46, 175);
  ctx.font = '11px "Courier New", monospace';
  ctx.fillStyle = '#7DD3FC';
  ctx.fillText('TechCrunch, Detik, Antara...', 46, 205);

  // Card 2: Field Investigation & Bot
  ctx.fillStyle = '#0B132B';
  ctx.fillRect(360, 90, 300, 130);
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 2;
  ctx.strokeRect(360, 90, 300, 130);

  ctx.font = '12px "Courier New", monospace';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('INTELLIGENCE DISPATCH', 376, 120);
  ctx.font = '900 36px "Courier New", monospace';
  ctx.fillStyle = '#10B981';
  ctx.fillText('TELEGRAM BOT', 376, 175);
  ctx.font = '11px "Courier New", monospace';
  ctx.fillStyle = '#6EE7B7';
  ctx.fillText('Liputan & Investigasi Kilat', 376, 205);

  // Card 3: Veritas Fact-Check
  ctx.fillStyle = '#0B132B';
  ctx.fillRect(690, 90, 300, 130);
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.strokeRect(690, 90, 300, 130);

  ctx.font = '12px "Courier New", monospace';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('VERIFIKASI FAKTA & HOAX', 706, 120);
  ctx.font = '900 40px "Courier New", monospace';
  ctx.fillStyle = '#F59E0B';
  ctx.fillText('99.8% VALID', 706, 175);
  ctx.font = '11px "Courier New", monospace';
  ctx.fillStyle = '#FCD34D';
  ctx.fillText('Penyaringan Rumor & Fakta', 706, 205);

  // Middle Section: 6 RSS Channel Badges
  ctx.fillStyle = '#08101E';
  ctx.fillRect(30, 240, 960, 110);
  ctx.strokeStyle = '#1E3A5F';
  ctx.strokeRect(30, 240, 960, 110);

  ctx.font = 'bold 13px "Courier New", monospace';
  ctx.fillStyle = '#F8FAFC';
  ctx.fillText('MONITORED RSS CHANNELS (bottelejurnalis.vercel.app):', 46, 270);

  const rssBadges = [
    'TechCrunch',
    'DailySocial',
    'DetikINET',
    'Antara Tekno',
    'The Verge',
    'Google News ID'
  ];
  rssBadges.forEach((b, i) => {
    const bx = 46 + i * 155;
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(bx, 290, 145, 36);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(b, bx + 72, 312);
  });

  // Bottom Ticker
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(30, 375, 960, 105);
  ctx.strokeStyle = '#0284C7';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(30, 375, 960, 105);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.fillText('● RADAR KHUSUS TEKNOLOGI & INOVASI // LIVE INGESTION READY', 46, 405);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px "Courier New", monospace';
  ctx.fillText('KLIK DISPLAY UNTUK MEMBUKA WEB RADAR: bottelejurnalis.vercel.app', 46, 442);

  ctx.fillStyle = '#64748B';
  ctx.font = '11px "Courier New", monospace';
  ctx.fillText('Pusat investigasi, verifikasi fakta & kurasi berita bertenaga AI', 46, 465);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

const RadarVideoWall: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  const radarTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createRadarVideoWallTexture();
  }, []);

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        if (typeof window !== 'undefined') {
          window.open('https://bottelejurnalis.vercel.app/', '_blank');
        }
      }}
    >
      {/* Outer Bezel Frame */}
      <mesh castShadow>
        <boxGeometry args={[5.8, 2.8, 0.08]} />
        <meshStandardMaterial color="#0C1322" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Screen Canvas Surface */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[5.6, 2.6]} />
        {radarTexture ? (
          <meshBasicMaterial map={radarTexture} />
        ) : (
          <meshBasicMaterial color="#060B14" />
        )}
      </mesh>

      {/* Video Wall Soft Ambient Projector Glow */}
      <pointLight position={[0, 0, 0.8]} intensity={0.9} distance={6} color="#0284C7" />
    </group>
  );
};

// ================= ARCHITECTURAL DIORAMA WALL COMPONENT =================
const DioramaWall: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
}> = ({ position, size, color = '#475569' }) => {
  const [w, h, d] = size;
  return (
    <group position={position}>
      {/* Wall Body */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Baseboard Trim */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[w + 0.02, 0.16, d + 0.02]} />
        <meshStandardMaterial color="#282B33" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Top Cap */}
      <mesh position={[0, h + 0.04, 0]}>
        <boxGeometry args={[w + 0.06, 0.08, d + 0.06]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.5} />
      </mesh>
    </group>
  );
};

// ================= GLASS ROOM PARTITION WITH MATTE BLACK METAL FRAME =================
export const GlassPartition: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  glassColor?: string;
  opacity?: number;
}> = ({ position, size, glassColor = '#F8FAFC', opacity = 0.35 }) => {
  const [w, h, d] = size;
  const isAlongX = w >= d;
  return (
    <group position={position}>
      {/* Lower Solid Base Wall (height 0.85m) */}
      <mesh position={[0, 0.425, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.85, d]} />
        <meshStandardMaterial color="#272B34" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Matte Black Metal Frame Sill */}
      <mesh position={[0, 0.87, 0]}>
        <boxGeometry args={[isAlongX ? w : 0.08, 0.04, isAlongX ? 0.08 : d]} />
        <meshStandardMaterial color="#1E2128" metalness={0.8} />
      </mesh>
      {/* Upper Glass Pane (height 1.85m) */}
      <mesh position={[0, 1.82, 0]}>
        <boxGeometry args={[isAlongX ? w : 0.04, 1.85, isAlongX ? 0.04 : d]} />
        <meshPhysicalMaterial
          color={glassColor}
          transmission={0.88}
          transparent
          opacity={opacity}
          roughness={0.15}
          metalness={0.1}
        />
      </mesh>
      {/* Top Header Beam */}
      <mesh position={[0, 2.77, 0]}>
        <boxGeometry args={[isAlongX ? w : 0.08, 0.06, isAlongX ? 0.08 : d]} />
        <meshStandardMaterial color="#1E2128" metalness={0.8} />
      </mesh>
    </group>
  );
};

// ================= NEON ACRYLIC ROOM SIGNBOARD GENERATOR =================
function createRoomSignTexture(code: string, name: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Background
  ctx.fillStyle = '#181B22';
  ctx.fillRect(0, 0, 512, 128);

  // Outer Border with accent color
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.strokeRect(6, 6, 500, 116);

  // Room Code Badge
  ctx.fillStyle = color;
  ctx.fillRect(16, 16, 90, 32);
  ctx.font = 'bold 20px "Courier New", monospace';
  ctx.fillStyle = '#0F172A';
  ctx.textAlign = 'center';
  ctx.fillText(code, 61, 40);

  // Room Title Name
  ctx.font = '900 28px "Courier New", monospace';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.fillText(name, 125, 42);

  // Subtitle
  ctx.font = '14px monospace';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('ADAFAKTA NEWSROOM // AUTHORIZED ACCESS', 125, 78);

  // Bottom Status Dot
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(30, 95, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = 'bold 12px monospace';
  ctx.fillStyle = color;
  ctx.fillText('ACTIVE DIVISION', 46, 99);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

const RoomSignboard: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  code: string;
  name: string;
  color?: string;
}> = ({ position, rotation = [0, 0, 0], code, name, color = '#38BDF8' }) => {
  const texture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createRoomSignTexture(code, name, color);
  }, [code, name, color]);

  return (
    <group position={position} rotation={rotation}>
      {/* Acrylic Plate Backing */}
      <mesh castShadow>
        <boxGeometry args={[2.0, 0.5, 0.04]} />
        <meshStandardMaterial color="#1E222A" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Printed Canvas Surface */}
      <mesh position={[0, 0, 0.022]}>
        <planeGeometry args={[1.96, 0.46]} />
        {texture && <meshBasicMaterial map={texture} />}
      </mesh>
      {/* Hanging Rods */}
      <mesh position={[-0.8, 0.35, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.25, 8]} />
        <meshStandardMaterial color="#64748B" metalness={0.9} />
      </mesh>
      <mesh position={[0.8, 0.35, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.25, 8]} />
        <meshStandardMaterial color="#64748B" metalness={0.9} />
      </mesh>
    </group>
  );
};

export const OfficeWallsAndRooms: React.FC = () => {
  return (
    <group>
      {/* ================= 1. BACK PERIMETER WALL (BALANCED 3-ZONE ~47.5M) ================= */}
      {/* Behind Kantor Barat - Redaksi AdaFakta (X: -30.0 to -6.5, center: -18.25) */}
      <DioramaWall position={[-18.25, 0, -10.1]} size={[23.5, 4.2, 0.4]} color="#3F4654" />
      {/* Windows along Redaksi Back Wall */}
      {[-26.5, -22.5, -18.5, -14.5, -10.5].map((x, idx) => (
        <group key={`win-redaksi-${idx}`} position={[x, 2.4, -9.9]}>
          <mesh>
            <boxGeometry args={[1.6, 1.8, 0.1]} />
            <meshStandardMaterial color="#282B33" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[1.4, 1.6, 0.04]} />
            <meshPhysicalMaterial
              color="#F8FAFC"
              transmission={0.9}
              transparent
              opacity={0.35}
              roughness={0.15}
            />
          </mesh>
        </group>
      ))}

      {/* Behind Central Hub - Kedai Kopi Tarak & Lounge (X: -6.5 to +3.5, center: -1.5) */}
      <DioramaWall position={[-1.5, 0, -10.1]} size={[10.0, 4.2, 0.4]} color="#475569" />
      {/* Windows along Kopi Tarak Back Wall */}
      {[-4.0, 1.0].map((x, idx) => (
        <group key={`win-kopi-${idx}`} position={[x, 2.4, -9.9]}>
          <mesh>
            <boxGeometry args={[1.6, 1.8, 0.1]} />
            <meshStandardMaterial color="#282B33" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[1.4, 1.6, 0.04]} />
            <meshPhysicalMaterial
              color="#FDE68A"
              transmission={0.9}
              transparent
              opacity={0.35}
              roughness={0.15}
            />
          </mesh>
        </group>
      ))}

      {/* Behind Kantor Timur - Radar Intelijen & Bot Jurnalis (X: +3.5 to +17.5, center: +10.5) */}
      <DioramaWall position={[10.5, 0, -10.1]} size={[14.0, 4.2, 0.4]} color="#222B38" />
      {/* Windows along Radar Back Wall */}
      {[6.0, 10.5, 15.0].map((x, idx) => (
        <group key={`win-radar-${idx}`} position={[x, 2.4, -9.9]}>
          <mesh>
            <boxGeometry args={[1.6, 1.8, 0.1]} />
            <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[1.4, 1.6, 0.04]} />
            <meshPhysicalMaterial
              color="#E0F2FE"
              transmission={0.9}
              transparent
              opacity={0.35}
              roughness={0.15}
            />
          </mesh>
        </group>
      ))}

      {/* ================= 2. KANTOR BARAT LEFT PERIMETER WALL (X = -30.0) ================= */}
      <DioramaWall position={[-30.0, 0, 0]} size={[0.4, 4.2, 20.4]} color="#3F4654" />

      {/* Big-Screen War Room Video Wall on Left Wall (181 Published Articles) */}
      <WarRoomVideoWall position={[-29.8, 2.4, 0]} rotation={[0, Math.PI / 2, 0]} />

      {/* ================= 3. KANTOR TIMUR RIGHT PERIMETER WALL (X = +17.5) ================= */}
      <DioramaWall position={[17.5, 0, 0]} size={[0.4, 4.2, 20.4]} color="#222B38" />

      {/* Radar Video Wall on Right Wall (6 RSS Feeds, bottelejurnalis.vercel.app) */}
      <RadarVideoWall position={[17.2, 2.4, 0]} rotation={[0, -Math.PI / 2, 0]} />

      {/* ================= 4. GERBANG KACA BARAT: KANTOR BARAT KE KOPI TARAK (X = -6.5) ================= */}
      {/* North wall segment (Z: -10 to -3) */}
      <GlassPartition position={[-6.5, 0, -6.5]} size={[0.2, 2.8, 7.0]} />
      {/* South wall segment (Z: +3 to +10) */}
      <GlassPartition position={[-6.5, 0, 6.5]} size={[0.2, 2.8, 7.0]} />
      {/* Grand Arch Door Header Beam above doorway (Z: -3 to +3) */}
      <mesh position={[-6.5, 2.6, 0]}>
        <boxGeometry args={[0.3, 0.4, 6.0]} />
        <meshStandardMaterial color="#1E222A" metalness={0.8} />
      </mesh>
      {/* Archway Signboards: Facing Barat & Facing Kopi Tarak */}
      <RoomSignboard position={[-6.6, 2.3, 0]} rotation={[0, -Math.PI / 2, 0]} code="HQ" name="REDAKSI UTAMA" color="#10B981" />
      <RoomSignboard position={[-6.4, 2.3, 0]} rotation={[0, Math.PI / 2, 0]} code="CAFE" name="KOPI TARAK HUB" color="#F59E0B" />

      {/* ================= 5. GERBANG KACA TIMUR: KOPI TARAK KE KANTOR TIMUR (X = +3.5) ================= */}
      {/* North wall segment (Z: -10 to -3) */}
      <GlassPartition position={[3.5, 0, -6.5]} size={[0.2, 2.8, 7.0]} glassColor="#E0F2FE" />
      {/* South wall segment (Z: +3 to +10) */}
      <GlassPartition position={[3.5, 0, 6.5]} size={[0.2, 2.8, 7.0]} glassColor="#E0F2FE" />
      {/* Grand Arch Door Header Beam above doorway (Z: -3 to +3) */}
      <mesh position={[3.5, 2.6, 0]}>
        <boxGeometry args={[0.3, 0.4, 6.0]} />
        <meshStandardMaterial color="#1E222A" metalness={0.8} />
      </mesh>
      {/* Archway Signboards: Facing Kopi Tarak & Facing Kantor Timur */}
      <RoomSignboard position={[3.4, 2.3, 0]} rotation={[0, -Math.PI / 2, 0]} code="CAFE" name="KOPI TARAK HUB" color="#F59E0B" />
      <RoomSignboard position={[3.6, 2.3, 0]} rotation={[0, Math.PI / 2, 0]} code="RADAR" name="BOT TELE JURNALIS" color="#0284C7" />

      {/* ========================================================================= */}
      {/* ================= 6 DEDICATED ROOMS / CHAMBERS DI SAYAP BARAT =========== */}
      {/* ========================================================================= */}

      {/* ───────────────── RUANG 1: SERVER & DEVOPS ROOM (POJOK KIRI-BELAKANG) ───── */}
      {/* Dividing Wall along X = -22.5 (from Z: -10 to -4.5) */}
      <GlassPartition position={[-22.5, 0, -7.25]} size={[0.2, 2.8, 5.5]} glassColor="#A7F3D0" />
      {/* Dividing Wall along Z = -4.5 (from X: -30.5 to -22.5, leaving door at X = -25) */}
      <GlassPartition position={[-28.5, 0, -4.5]} size={[4.0, 2.8, 0.2]} glassColor="#A7F3D0" />
      {/* Door header lintel */}
      <mesh position={[-25.0, 2.6, -4.5]}>
        <boxGeometry args={[3.0, 0.4, 0.2]} />
        <meshStandardMaterial color="#1E222A" metalness={0.8} />
      </mesh>
      {/* Room 01 Signboard */}
      <RoomSignboard position={[-25.0, 2.3, -4.38]} code="01" name="SERVER ROOM" color="#10B981" />

      {/* ───────────────── RUANG 2: STUDIO FOTO & MULTIMEDIA (KIRI-TENGAH BELAKANG) ─ */}
      {/* Dividing Wall along X = -14.5 (from Z: -10 to -4.5) */}
      <GlassPartition position={[-14.5, 0, -7.25]} size={[0.2, 2.8, 5.5]} glassColor="#FDA4AF" />
      {/* Front Wall along Z = -4.5 (from X: -22.5 to -14.5, doorway at X = -18.5) */}
      <GlassPartition position={[-21.5, 0, -4.5]} size={[2.0, 2.8, 0.2]} glassColor="#FDA4AF" />
      <GlassPartition position={[-15.5, 0, -4.5]} size={[2.0, 2.8, 0.2]} glassColor="#FDA4AF" />
      {/* Door header lintel */}
      <mesh position={[-18.5, 2.6, -4.5]}>
        <boxGeometry args={[4.0, 0.4, 0.2]} />
        <meshStandardMaterial color="#1E222A" metalness={0.8} />
      </mesh>
      {/* Room 02 Signboard */}
      <RoomSignboard position={[-18.5, 2.3, -4.38]} code="02" name="PHOTO STUDIO" color="#F43F5E" />

      {/* ───────────────── RUANG 5: BIRO KLIPING & SADUR URL (KANAN-BELAKANG) ────── */}
      {/* Front Wall along Z = -4.5 (from X: -14.5 to -6.5, doorway at X = -10.5) */}
      <GlassPartition position={[-13.25, 0, -4.5]} size={[2.5, 2.8, 0.2]} glassColor="#DDD6FE" />
      <GlassPartition position={[-7.75, 0, -4.5]} size={[2.5, 2.8, 0.2]} glassColor="#DDD6FE" />
      {/* Door header lintel */}
      <mesh position={[-10.5, 2.6, -4.5]}>
        <boxGeometry args={[3.0, 0.4, 0.2]} />
        <meshStandardMaterial color="#1E222A" metalness={0.8} />
      </mesh>
      {/* Room 05 Signboard */}
      <RoomSignboard position={[-10.5, 2.3, -4.38]} code="05" name="CLIPPING DESK" color="#8B5CF6" />

      {/* ───────────────── RUANG 3: LAB INOVASI AI STUDIO (POJOK KIRI-DEPAN) ─────── */}
      {/* Dividing Wall along X = -22.5 (from Z: +4.5 to +10) */}
      <GlassPartition position={[-22.5, 0, 7.25]} size={[0.2, 2.8, 5.5]} glassColor="#FBCFE8" />
      {/* Rear Wall along Z = +4.5 (from X: -30.5 to -22.5, doorway at X = -25) */}
      <GlassPartition position={[-28.5, 0, 4.5]} size={[4.0, 2.8, 0.2]} glassColor="#FBCFE8" />
      {/* Door header lintel */}
      <mesh position={[-25.0, 2.6, 4.5]}>
        <boxGeometry args={[3.0, 0.4, 0.2]} />
        <meshStandardMaterial color="#1E222A" metalness={0.8} />
      </mesh>
      {/* Room 03 Signboard */}
      <RoomSignboard position={[-25.0, 2.3, 4.38]} rotation={[0, Math.PI, 0]} code="03" name="AI STUDIO LAB" color="#EC4899" />

      {/* ───────────────── RUANG 6: BIRO TIM PENULIS, HRD & SEO (KANAN-DEPAN) ────── */}
      {/* Dividing Wall along X = -14.5 (from Z: +4.5 to +10) */}
      <GlassPartition position={[-14.5, 0, 7.25]} size={[0.2, 2.8, 5.5]} glassColor="#BAE6FD" />
      {/* Rear Wall along Z = +4.5 (from X: -14.5 to -6.5, doorway at X = -10.5) */}
      <GlassPartition position={[-13.25, 0, 4.5]} size={[2.5, 2.8, 0.2]} glassColor="#BAE6FD" />
      <GlassPartition position={[-7.75, 0, 4.5]} size={[2.5, 2.8, 0.2]} glassColor="#BAE6FD" />
      {/* Door header lintel */}
      <mesh position={[-10.5, 2.6, 4.5]}>
        <boxGeometry args={[3.0, 0.4, 0.2]} />
        <meshStandardMaterial color="#1E222A" metalness={0.8} />
      </mesh>
      {/* Room 06 Signboard */}
      <RoomSignboard position={[-10.5, 2.3, 4.38]} rotation={[0, Math.PI, 0]} code="06" name="WRITERS GUILD" color="#3B82F6" />

      {/* ───────────────── RUANG 4: AULA UTAMA & PANGGUNG REDAKSI (PUSAT TENGAH) ─── */}
      {/* Overhead Grand Arch Signboard above Central Walkway */}
      <RoomSignboard position={[-18.5, 3.2, -3.8]} code="04" name="NEWSROOM MAIN HALL" color="#F59E0B" />
    </group>
  );
};
