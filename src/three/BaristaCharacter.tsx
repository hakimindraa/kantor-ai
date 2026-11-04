'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { useOfficeStore } from '@/store/officeStore';

const BARISTA_THOUGHTS = [
  '“Kopi Tarak hangat siap disruput, bos!”',
  '“Tarik mang! Teh tarik spesial siap.”',
  '“Mau kopi hitam apa kopi susu gula aren?”',
  '“Redaksi sibuk banget ya hari ini...”',
  '“Kopi tarik asli resep turun-temurun!”'
];

function createBaristaThoughtBubbleTexture(thought: string): THREE.CanvasTexture {
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

  // Border - Soft Artisanal Teal
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#14B8A6';
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
  ctx.strokeStyle = '#14B8A6';
  ctx.stroke();

  // Quote / Thought Text
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

function createBaristaBadgeTexture(): THREE.CanvasTexture {
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

  // Border - Teal
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#14B8A6';
  ctx.strokeRect(x, y, w, h);

  // Left status pip (square)
  ctx.fillStyle = '#14B8A6';
  ctx.fillRect(x + 24, y + (h - 16) / 2, 16, 16);

  // Barista Name
  ctx.font = '900 28px "Courier New", monospace, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText('BARISTA // KOPI TARAK', x + 56, y + h / 2 + 2);

  // Badge Tag on right
  const badgeText = 'BAR';
  ctx.font = '900 22px "Courier New", monospace';
  const badgeTextWidth = ctx.measureText(badgeText).width;
  const badgeW = badgeTextWidth + 30;
  const badgeH = 46;
  const badgeX = x + w - badgeW - 16;
  const badgeY = y + (h - badgeH) / 2;

  ctx.fillStyle = '#0D9488';
  ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(badgeText, badgeX + badgeW / 2, badgeY + badgeH / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export const BaristaCharacter: React.FC<{
  position?: [number, number, number];
  rotation?: number;
}> = ({ position = [6.5, 0, -3.2], rotation = 0 }) => {
  const addActivityLog = useOfficeStore((state) => state.addActivityLog);

  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  const [thoughtIndex, setThoughtIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setThoughtIndex((prev) => (prev + 1) % BARISTA_THOUGHTS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentThought = useMemo(() => {
    return BARISTA_THOUGHTS[thoughtIndex % BARISTA_THOUGHTS.length];
  }, [thoughtIndex]);

  const thoughtTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createBaristaThoughtBubbleTexture(currentThought);
  }, [currentThought]);

  const badgeTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return createBaristaBadgeTexture();
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Idle breathing & head looking around the bar
    if (headRef.current) {
      headRef.current.position.y = 1.58 + Math.sin(time * 2) * 0.02;
      headRef.current.rotation.y = Math.sin(time * 0.7) * 0.25; // Checking the customers
    }

    // Iconic "Tarik" Motion: Right arm lifts high pouring into the glass in left hand
    const tarikCycle = Math.sin(time * 1.5);
    if (rightArmRef.current) {
      // Right arm lifts teapot up and down
      rightArmRef.current.rotation.x = -Math.PI / 2.2 - (tarikCycle > 0 ? tarikCycle * 0.4 : 0);
      rightArmRef.current.rotation.z = -0.2 - (tarikCycle > 0 ? tarikCycle * 0.15 : 0);
    }

    if (leftArmRef.current) {
      // Left arm holds cup steady below
      leftArmRef.current.rotation.x = -Math.PI / 3.2;
      leftArmRef.current.rotation.z = 0.15;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    addActivityLog({
      agentId: 'hermes',
      agentName: 'Bang Tarak',
      agentColor: '#FAFAFA',
      category: 'editorial',
      level: 'success',
      message: '☕ Barista Kopi Tarak: "Kopi Tarik racikan spesial berbusa tebal siap dihidangkan untuk tim Redaksi AI!"'
    });
  };

  return (
    <group ref={rootRef} position={position} rotation={[0, rotation, 0]} onClick={handleClick}>
      {/* Floating Status Pill: BARISTA KOPI TARAK */}
      {badgeTexture && (
        <Billboard position={[0, 2.35, 0]} follow={true}>
          <mesh renderOrder={998} onClick={handleClick}>
            <planeGeometry args={[2.0, 0.5]} />
            <meshBasicMaterial map={badgeTexture} transparent={true} depthTest={false} side={THREE.DoubleSide} />
          </mesh>
        </Billboard>
      )}

      {/* Floating Live Barista Thought Bubble */}
      {thoughtTexture && (
        <Billboard position={[0, 2.92, 0]} follow={true}>
          <mesh renderOrder={999} onClick={handleClick}>
            <planeGeometry args={[2.6, 0.55]} />
            <meshBasicMaterial map={thoughtTexture} transparent={true} depthTest={false} side={THREE.DoubleSide} />
          </mesh>
        </Billboard>
      )}

      {/* ================= ROBLOX BARISTA RIG - ARTISANAL TEAL & CREAM ================= */}

      {/* 1. TORSO (Warm Cream Shirt + Artisanal Teal Apron) */}
      <mesh ref={torsoRef} position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 0.85, 0.44]} />
        <meshStandardMaterial color="#FFFBEB" roughness={0.4} />
      </mesh>
      {/* Soft Teal Canvas Apron Front */}
      <mesh position={[0, 0.92, 0.23]} castShadow>
        <boxGeometry args={[0.62, 0.76, 0.04]} />
        <meshStandardMaterial color="#0D9488" roughness={0.6} />
      </mesh>
      {/* Apron Cream Neck Strap */}
      <mesh position={[0, 1.34, 0.22]}>
        <boxGeometry args={[0.3, 0.08, 0.04]} />
        <meshStandardMaterial color="#FEF3C7" roughness={0.5} />
      </mesh>
      {/* Apron Dark Teal Pocket */}
      <mesh position={[0, 0.75, 0.26]}>
        <boxGeometry args={[0.36, 0.22, 0.03]} />
        <meshStandardMaterial color="#0F766E" />
      </mesh>

      {/* 2. HEAD & BARISTA CAP */}
      <group ref={headRef} position={[0, 1.58, 0]}>
        {/* Head - Warm Art-Toy Peach Skin */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshStandardMaterial color="#FDE2CA" roughness={0.4} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.14, 0.05, 0.28]}>
          <boxGeometry args={[0.08, 0.09, 0.02]} />
          <meshBasicMaterial color="#1E222A" />
        </mesh>
        <mesh position={[0.14, 0.05, 0.28]}>
          <boxGeometry args={[0.08, 0.09, 0.02]} />
          <meshBasicMaterial color="#1E222A" />
        </mesh>
        {/* Friendly Barista Smile */}
        <mesh position={[0, -0.12, 0.28]}>
          <boxGeometry args={[0.22, 0.04, 0.02]} />
          <meshBasicMaterial color="#64748B" />
        </mesh>

        {/* Barista Teal Flat Cap */}
        <group position={[0, 0.28, 0]}>
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[0.62, 0.16, 0.62]} />
            <meshStandardMaterial color="#0F766E" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.02, 0.36]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.5, 0.04, 0.24]} />
            <meshStandardMaterial color="#115E59" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* 3. ARMS & PROPS (Stainless Teko Tarik & Glass Cup) */}
      {/* Left Arm with Glass Cup */}
      <group ref={leftArmRef} position={[-0.52, 1.25, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <boxGeometry args={[0.26, 0.75, 0.3]} />
          <meshStandardMaterial color="#FFFBEB" />
        </mesh>
        <mesh position={[0, -0.78, 0]}>
          <boxGeometry args={[0.22, 0.16, 0.26]} />
          <meshStandardMaterial color="#FDE2CA" />
        </mesh>

        {/* Clear Glass Cup in Hand */}
        <group position={[0, -0.88, 0.15]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.06, 0.18, 12]} />
            <meshPhysicalMaterial color="#E2E8F0" transmission={0.9} transparent opacity={0.5} roughness={0.1} />
          </mesh>
          {/* Frothy Kopi Tarik inside with thick foam */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.075, 0.055, 0.14, 12]} />
            <meshStandardMaterial color="#22252C" roughness={0.2} />
          </mesh>
          {/* Light Froth on top */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.078, 0.078, 0.03, 12]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* Right Arm with Stainless Steel Teko Tarik */}
      <group ref={rightArmRef} position={[0.52, 1.25, 0]}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <boxGeometry args={[0.26, 0.75, 0.3]} />
          <meshStandardMaterial color="#FFFBEB" />
        </mesh>
        <mesh position={[0, -0.78, 0]}>
          <boxGeometry args={[0.22, 0.16, 0.26]} />
          <meshStandardMaterial color="#FDE2CA" />
        </mesh>

        {/* Iconic Tall Stainless Steel Teko Tarik */}
        <group position={[0, -0.85, 0.18]} rotation={[0.4, 0, 0]}>
          {/* Pot body */}
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.12, 0.28, 16]} />
            <meshStandardMaterial color="#F8FAFC" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Spout */}
          <mesh position={[0, 0.1, -0.12]} rotation={[-0.4, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.05, 0.14, 8]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
          {/* Handle */}
          <mesh position={[0, 0, 0.14]}>
            <boxGeometry args={[0.04, 0.22, 0.06]} />
            <meshStandardMaterial color="#0F766E" />
          </mesh>
        </group>
      </group>

      {/* 4. LEGS (Slate Navy Chinos) */}
      <group position={[-0.24, 0.55, 0]}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <boxGeometry args={[0.3, 0.65, 0.35]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
      </group>
      <group position={[0.24, 0.55, 0]}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <boxGeometry args={[0.3, 0.65, 0.35]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
};

