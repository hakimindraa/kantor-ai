'use client';

import React from 'react';

export const OfficeFloor: React.FC = () => {
  return (
    <group>
      {/* ================= 1. FOUNDATION DIORAMA BASE (EXPANDED DUAL-WING) ================= */}
      {/* Bottom Plinth */}
      <mesh position={[0, -0.35, 0]} receiveShadow>
        <boxGeometry args={[46.6, 0.4, 17.6]} />
        <meshStandardMaterial color="#20232A" roughness={0.9} />
      </mesh>
      {/* Clean Slate Bevel Border */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[46.2, 0.12, 17.2]} />
        <meshStandardMaterial color="#2E323B" roughness={0.7} />
      </mesh>
      {/* Subfloor Slab */}
      <mesh position={[0, -0.03, 0]} receiveShadow>
        <boxGeometry args={[45.8, 0.06, 16.8]} />
        <meshStandardMaterial color="#262932" roughness={0.8} />
      </mesh>

      {/* ================= 2. SAYAP BARAT: REDAKSI UTAMA ADAFAKTA ================= */}
      {/* Mid-Slate Concrete Floor */}
      <mesh position={[-14.5, 0.01, 0]} receiveShadow>
        <boxGeometry args={[15.2, 0.02, 16.2]} />
        <meshStandardMaterial color="#333742" roughness={0.75} metalness={0.15} />
      </mesh>
      {/* Architectural Silver Grid for Redaksi zone */}
      <gridHelper
        args={[15, 15, '#94A3B8', '#475569']}
        position={[-14.5, 0.025, 0]}
      />

      {/* West Wing Inlay Divider */}
      <mesh position={[-6.8, 0.012, 0]} receiveShadow>
        <boxGeometry args={[0.2, 0.02, 16.2]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* ================= 3. AREA TENGAH: KOPI TARAK HUB & LOUNGE ================= */}
      {/* Warm Slate Terrazzo Concrete Floor */}
      <mesh position={[0.0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[13.2, 0.02, 16.2]} />
        <meshStandardMaterial color="#4A5260" roughness={0.6} metalness={0.12} />
      </mesh>
      {/* Subtle Cafe Floor Pattern Grid */}
      <gridHelper
        args={[13, 13, '#64748B', '#3E4452']}
        position={[0.0, 0.025, 0]}
      />

      {/* East Wing Inlay Divider */}
      <mesh position={[6.8, 0.012, 0]} receiveShadow>
        <boxGeometry args={[0.2, 0.02, 16.2]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* ================= 4. SAYAP TIMUR: RADAR INTELIJEN & BOT JURNALIS ================= */}
      {/* Cyber Navy Dark Slate Concrete Floor */}
      <mesh position={[14.5, 0.01, 0]} receiveShadow>
        <boxGeometry args={[15.2, 0.02, 16.2]} />
        <meshStandardMaterial color="#1E2430" roughness={0.7} metalness={0.25} />
      </mesh>
      {/* Cyber Emerald/Cyan Intelligence Grid */}
      <gridHelper
        args={[15, 15, '#0284C7', '#1E3A5F']}
        position={[14.5, 0.025, 0]}
      />
    </group>
  );
};
