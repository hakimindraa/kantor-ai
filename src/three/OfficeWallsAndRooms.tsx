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
  ctx.fillText('AUTOMATED AGENT PIPELINE: SCOUT ➔ SCRIBE ➔ PIXEL ➔ CHRONOS ➔ RADAR ➔ HERMES', 46, 270);

  // Stage steps
  const steps = [
    { label: 'SCOUT: RSS INGEST', color: '#F59E0B' },
    { label: 'SCRIBE: GEMINI FLASH', color: '#10B981' },
    { label: 'PIXEL: WEBP COMPRESS', color: '#F43F5E' },
    { label: 'CHRONOS: PACING QUEUE', color: '#0EA5E9' },
    { label: 'RADAR: GOOGLE INDEX', color: '#A855F7' }
  ];
  steps.forEach((st, i) => {
    const sx = 46 + i * 190;
    ctx.fillStyle = st.color;
    ctx.fillRect(sx, 290, 175, 36);
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 10px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(st.label, sx + 87, 312);
  });

  // Bottom Ticker / News Bulletin Bar
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(30, 375, 960, 105);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(30, 375, 960, 105);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#EF4444';
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.fillText('● BREAKING NEWS WIRE (KLIK DISPLAY UNTUK BACA ARTIKEL)', 46, 405);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 17px "Courier New", monospace';
  ctx.fillText(`LATEST: "${latestTitle.slice(0, 68)}..."`, 46, 442);

  ctx.fillStyle = '#64748B';
  ctx.font = '11px "Courier New", monospace';
  ctx.fillText(`Antrean Pipeline: ${articlesCount} Berita | Google Indexing: 100% OK`, 46, 465);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

const WarRoomVideoWall: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  const articles = useOfficeStore((state) => state.articles);
  const stats = useOfficeStore((state) => state.stats);
  const incidentAlert = useOfficeStore((state) => state.incidentAlert);
  const openArticleReader = useOfficeStore((state) => state.openArticleReader);

  const latestArticle = articles[0] || {
    id: 'latest',
    title: 'Terobosan Ekosistem Otomasi Digital Nasional 2026',
    category: 'Teknologi',
    source: 'Antara News Feed',
    currentStage: 'published',
    assignedAgent: 'scout',
    readTime: '3 min',
    wordCount: 420,
    seoScore: 96,
    telegramNotified: true,
    indexedGoogle: true
  };

  const videoWallTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createWarRoomVideoWallTexture(
      articles.length,
      stats.publishedToday || 18,
      latestArticle.title,
      incidentAlert.active
    );
  }, [articles.length, stats.publishedToday, latestArticle.title, incidentAlert.active]);

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        openArticleReader(latestArticle as any);
      }}
    >
      {/* Outer Bezel Frame */}
      <mesh castShadow>
        <boxGeometry args={[5.8, 2.8, 0.08]} />
        <meshStandardMaterial color="#1E232F" roughness={0.3} metalness={0.8} />
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

// Helper component for architectural diorama wall with soft charcoal and fresh slate trim
const DioramaWall: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
}> = ({ position, size, color = '#475569' }) => {
  const [w, h, d] = size;
  return (
    <group position={position}>
      {/* Wall Body - Fresh Architectural Concrete */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Soft Charcoal Baseboard Trim */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[w + 0.02, 0.16, d + 0.02]} />
        <meshStandardMaterial color="#282B33" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Fresh Slate Gray Top Cap */}
      <mesh position={[0, h + 0.04, 0]}>
        <boxGeometry args={[w + 0.06, 0.08, d + 0.06]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.5} />
      </mesh>
    </group>
  );
};

export const OfficeWallsAndRooms: React.FC = () => {
  return (
    <group>
      {/* ================= 1. BACK PERIMETER WALL (46m SPAN) ================= */}
      {/* Behind Sayap Barat - Redaksi AdaFakta */}
      <DioramaWall position={[-14.5, 0, -8.1]} size={[15.2, 4.2, 0.4]} color="#3F4654" />
      {/* Windows along Redaksi Back Wall */}
      {[-18.5, -14.5, -10.5].map((x, idx) => (
        <group key={`win-redaksi-${idx}`} position={[x, 2.4, -7.9]}>
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

      {/* Behind Central Hub - Kopi Tarak Cafe */}
      <DioramaWall position={[0.0, 0, -8.1]} size={[13.2, 4.2, 0.4]} color="#475569" />

      {/* Behind Sayap Timur - Radar Intelijen & Bot Jurnalis */}
      <DioramaWall position={[14.5, 0, -8.1]} size={[15.2, 4.2, 0.4]} color="#222B38" />
      {/* Windows along Radar Back Wall */}
      {[10.5, 14.5, 18.5].map((x, idx) => (
        <group key={`win-radar-${idx}`} position={[x, 2.4, -7.9]}>
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

      {/* ================= 2. SAYAP BARAT LEFT PERIMETER WALL ================= */}
      <DioramaWall position={[-22.1, 0, 0]} size={[0.4, 4.2, 16.4]} color="#3F4654" />

      {/* Big-Screen War Room Video Wall on Left Wall (181 Published Articles) */}
      <WarRoomVideoWall position={[-21.8, 2.3, 0]} rotation={[0, Math.PI / 2, 0]} />

      {/* ================= 3. SAYAP TIMUR RIGHT PERIMETER WALL ================= */}
      <DioramaWall position={[22.1, 0, 0]} size={[0.4, 4.2, 16.4]} color="#222B38" />

      {/* Radar Video Wall on Right Wall (6 RSS Feeds, bottelejurnalis.vercel.app) */}
      <RadarVideoWall position={[21.8, 2.3, 0]} rotation={[0, -Math.PI / 2, 0]} />

      {/* ================= 4. WEST-TO-CENTER GLASS DIVIDER (X = -6.8) ================= */}
      {/* North partition */}
      <group position={[-6.8, 0, -4.5]}>
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 1.6, 4.2]} />
          <meshStandardMaterial color="#2E333D" roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[0, 1.75, 0]}>
          <boxGeometry args={[0.08, 0.3, 4.0]} />
          <meshPhysicalMaterial color="#F1F5F9" transmission={0.85} transparent opacity={0.45} roughness={0.2} />
        </mesh>
      </group>
      {/* South partition (Doorway between Z = -2.0 and Z = +0.5 is completely open) */}
      <group position={[-6.8, 0, 3.8]}>
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 1.6, 5.8]} />
          <meshStandardMaterial color="#2E333D" roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[0, 1.75, 0]}>
          <boxGeometry args={[0.08, 0.3, 5.6]} />
          <meshPhysicalMaterial color="#F1F5F9" transmission={0.85} transparent opacity={0.45} roughness={0.2} />
        </mesh>
      </group>

      {/* ================= 5. CENTER-TO-EAST GLASS DIVIDER (X = 6.8) ================= */}
      {/* North partition */}
      <group position={[6.8, 0, -4.5]}>
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 1.6, 4.2]} />
          <meshStandardMaterial color="#1E2736" roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[0, 1.75, 0]}>
          <boxGeometry args={[0.08, 0.3, 4.0]} />
          <meshPhysicalMaterial color="#E0F2FE" transmission={0.85} transparent opacity={0.45} roughness={0.2} />
        </mesh>
      </group>
      {/* South partition (Doorway between Z = -2.0 and Z = +0.5 is completely open) */}
      <group position={[6.8, 0, 3.8]}>
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 1.6, 5.8]} />
          <meshStandardMaterial color="#1E2736" roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[0, 1.75, 0]}>
          <boxGeometry args={[0.08, 0.3, 5.6]} />
          <meshPhysicalMaterial color="#E0F2FE" transmission={0.85} transparent opacity={0.45} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};
