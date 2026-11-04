'use client';

import React from 'react';

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
      {/* ================= 1. BACK PERIMETER WALL ================= */}
      {/* Behind Redaksi Workstations (Left Half) */}
      <DioramaWall position={[-6.8, 0, -7.8]} size={[13.8, 4.2, 0.4]} color="#475569" />

      {/* Windows along Redaksi Back Wall */}
      {[-10.5, -6.5, -2.5].map((x, idx) => (
        <group key={`win-redaksi-${idx}`} position={[x, 2.4, -7.6]}>
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

      {/* Behind Breakroom Pantry (Right Half) */}
      <DioramaWall position={[7.0, 0, -7.8]} size={[13.8, 4.2, 0.4]} color="#475569" />

      {/* ================= 2. LEFT PERIMETER WALL ================= */}
      <DioramaWall position={[-13.8, 0, 0]} size={[0.4, 4.2, 15.6]} color="#475569" />

      {/* Newsroom Editorial Whiteboard on Left Wall */}
      <group position={[-13.5, 2.3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[4.2, 1.8, 0.06]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[4.0, 1.6, 0.01]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* ================= 3. RIGHT PERIMETER WALL ================= */}
      <DioramaWall position={[13.8, 0, 0]} size={[0.4, 4.2, 15.6]} color="#475569" />

      {/* Framed Coffee Menu Board on Right Wall */}
      <group position={[13.5, 2.4, 1.5]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <boxGeometry args={[2.4, 1.5, 0.06]} />
          <meshStandardMaterial color="#282B33" metalness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[2.2, 1.3, 0.01]} />
          <meshStandardMaterial color="#333742" roughness={0.8} />
        </mesh>
      </group>

      {/* ================= 4. CENTER LOW PARTITION DIVIDER ================= */}
      {/* Separates workstation area from breakroom - Soft charcoal steel & frosted fresh glass */}
      <group position={[0.1, 0, -2.5]}>
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.3, 1.6, 10.2]} />
          <meshStandardMaterial color="#353945" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Frosted Glass Top Trim */}
        <mesh position={[0, 1.75, 0]}>
          <boxGeometry args={[0.08, 0.3, 10.0]} />
          <meshPhysicalMaterial
            color="#F1F5F9"
            transmission={0.85}
            transparent
            opacity={0.45}
            roughness={0.2}
          />
        </mesh>
        {/* Planter Box along divider top with architectural fresh slate foliage */}
        {[-3.5, -1.0, 1.5, 4.0].map((z, i) => (
          <group key={`div-plant-${i}`} position={[0, 1.7, z]}>
            <mesh>
              <dodecahedronGeometry args={[0.2, 0]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#64748B' : '#94A3B8'} roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
