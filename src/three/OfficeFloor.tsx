'use client';

import React from 'react';

export const OfficeFloor: React.FC = () => {
  return (
    <group>
      {/* 1. FOUNDATION DIORAMA BASE - SOFT CHARCOAL & FRESH INDUSTRIAL SLATE */}
      {/* Bottom Plinth */}
      <mesh position={[0, -0.35, 0]} receiveShadow>
        <boxGeometry args={[28.6, 0.4, 16.6]} />
        <meshStandardMaterial color="#24272E" roughness={0.9} />
      </mesh>
      {/* Clean Slate Bevel Border */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[28.2, 0.12, 16.2]} />
        <meshStandardMaterial color="#353942" roughness={0.7} />
      </mesh>
      {/* Subfloor Slab */}
      <mesh position={[0, -0.03, 0]} receiveShadow>
        <boxGeometry args={[27.8, 0.06, 15.8]} />
        <meshStandardMaterial color="#2B2E37" roughness={0.8} />
      </mesh>

      {/* 2. LEFT SIDE: REDAKSI AI WORKSTATION FLOOR (Fresh Mid-Slate Concrete) */}
      <mesh position={[-6.8, 0.01, 0]} receiveShadow>
        <boxGeometry args={[13.6, 0.02, 15.2]} />
        <meshStandardMaterial color="#3E434F" roughness={0.75} metalness={0.12} />
      </mesh>

      {/* Crisp Architectural Silver Grid for Redaksi desk zone */}
      <gridHelper
        args={[14, 14, '#94A3B8', '#505664']}
        position={[-6.8, 0.025, 0]}
      />

      {/* 3. CENTER RUNWAY DIVIDER STRIP (Bright Brushed Silver Aluminum Inlay) */}
      <mesh position={[0.1, 0.012, 0]} receiveShadow>
        <boxGeometry args={[0.3, 0.02, 15.2]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* 4. RIGHT SIDE: BREAKROOM & CAFE PANTRY FLOOR (Fresh Light Terrazzo Slate Concrete) */}
      <mesh position={[7.0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[13.0, 0.02, 15.2]} />
        <meshStandardMaterial color="#64748B" roughness={0.55} metalness={0.12} />
      </mesh>

      {/* Floor border inlay for Breakroom */}
      <mesh position={[7.0, 0.015, -7.5]} receiveShadow>
        <boxGeometry args={[13.0, 0.01, 0.1]} />
        <meshStandardMaterial color="#94A3B8" />
      </mesh>
    </group>
  );
};
