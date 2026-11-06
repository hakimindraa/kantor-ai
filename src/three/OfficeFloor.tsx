'use client';

import React from 'react';

export const OfficeFloor: React.FC = () => {
  return (
    <group>
      {/* ================= 1. FOUNDATION DIORAMA BASE (BALANCED 3-ZONE ~47.5M) ================= */}
      {/* Bottom Plinth */}
      <mesh position={[-6.25, -0.35, 0]} receiveShadow>
        <boxGeometry args={[48.2, 0.4, 21.6]} />
        <meshStandardMaterial color="#20232A" roughness={0.9} />
      </mesh>
      {/* Clean Slate Bevel Border */}
      <mesh position={[-6.25, -0.12, 0]} receiveShadow>
        <boxGeometry args={[47.8, 0.12, 21.2]} />
        <meshStandardMaterial color="#2E323B" roughness={0.7} />
      </mesh>
      {/* Subfloor Slab */}
      <mesh position={[-6.25, -0.03, 0]} receiveShadow>
        <boxGeometry args={[47.4, 0.06, 20.8]} />
        <meshStandardMaterial color="#262932" roughness={0.8} />
      </mesh>

      {/* ================= 2. KANTOR BARAT: REDAKSI UTAMA ADAFAKTA (23.5M x 20M) ================= */}
      {/* Mid-Slate Architectural Floor */}
      <mesh position={[-18.25, 0.01, 0]} receiveShadow>
        <boxGeometry args={[23.5, 0.02, 20.0]} />
        <meshStandardMaterial color="#2E333E" roughness={0.75} metalness={0.15} />
      </mesh>
      {/* Architectural Silver Grid for Redaksi zone */}
      <gridHelper
        args={[23.5, 20, '#94A3B8', '#475569']}
        position={[-18.25, 0.025, 0]}
      />

      {/* Inlay Divider between Kantor Barat and Kopi Tarak */}
      <mesh position={[-6.5, 0.012, 0]} receiveShadow>
        <boxGeometry args={[0.2, 0.02, 20.0]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ================= 3. ZONA PERBATASAN TENGAH: KEDAI KOPI TARAK & LOUNGE (10M x 20M) ================= */}
      {/* Warm Slate Terrazzo Concrete Floor */}
      <mesh position={[-1.5, 0.01, 0]} receiveShadow>
        <boxGeometry args={[10.0, 0.02, 20.0]} />
        <meshStandardMaterial color="#4A5260" roughness={0.6} metalness={0.12} />
      </mesh>
      {/* Subtle Cafe Floor Pattern Grid */}
      <gridHelper
        args={[10, 20, '#CBD5E1', '#3E4452']}
        position={[-1.5, 0.025, 0]}
      />

      {/* Inlay Divider between Kopi Tarak and Kantor Timur */}
      <mesh position={[3.5, 0.012, 0]} receiveShadow>
        <boxGeometry args={[0.2, 0.02, 20.0]} />
        <meshStandardMaterial color="#38BDF8" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ================= 4. KANTOR TIMUR: RADAR INTELIJEN BOT TELE JURNALIS (14M x 20M) ================= */}
      {/* Cyber Navy Dark Slate Concrete Floor */}
      <mesh position={[10.5, 0.01, 0]} receiveShadow>
        <boxGeometry args={[14.0, 0.02, 20.0]} />
        <meshStandardMaterial color="#1E2430" roughness={0.7} metalness={0.25} />
      </mesh>
      {/* Cyber Emerald/Cyan Intelligence Grid */}
      <gridHelper
        args={[14, 20, '#0284C7', '#1E3A5F']}
        position={[10.5, 0.025, 0]}
      />
    </group>
  );
};
