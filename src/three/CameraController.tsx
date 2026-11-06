'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useOfficeStore } from '@/store/officeStore';
import { CameraPreset } from '@/types/office';

const PRESET_COORDINATES: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  ISOMETRIC: { pos: [18.0, 24.0, 24.0], target: [-6.25, 1.0, 0.0] },
  OVERVIEW: { pos: [-6.25, 30.0, 20.0], target: [-6.25, 0.5, 0.0] }, // Full 3-Zone Diorama View (Barat, Kopi Tarak, Timur)
  WORKSTATIONS: { pos: [-18.5, 16.0, 14.0], target: [-18.5, 1.0, 0] }, // Kantor Barat Redaksi AdaFakta (6 Ruangan)
  STUDIO_FOTO: { pos: [-18.5, 7.5, -2.5], target: [-18.5, 1.0, -7.5] }, // Ruang 02 Studio Foto & Pixel
  RUANG_RAPAT: { pos: [-18.5, 12.0, 10.0], target: [-18.5, 1.0, 0] },
  PEMIMPIN_REDAKSI: { pos: [-18.5, 6.5, 4.5], target: [-18.5, 1.0, 0.4] }, // Podium Publikasi Scribe & Panggung Redaksi
  SENTRY_SERVER: { pos: [10.5, 12.0, 11.0], target: [10.5, 1.0, 0.0] }, // Kantor Timur (Radar Intelijen & TeleBot)
  RECEPTION: { pos: [-1.5, 9.0, 9.5], target: [-1.5, 1.0, 0.0] }, // Gerbang Pintu Kaca & Central Hub
  LOUNGE: { pos: [-1.5, 8.0, 2.5], target: [-1.5, 1.0, -5.0] }, // Central Hub: Kedai Kopi Tarak & Barista Bang Tarak
  FOCUS_AGENT: { pos: [0, 6, 6], target: [0, 1, 0] }
};

export const CameraController: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera, gl } = useThree();

  const cameraPreset = useOfficeStore((state) => state.cameraPreset);
  const cameraResetTrigger = useOfficeStore((state) => state.cameraResetTrigger);
  const selectedAgentId = useOfficeStore((state) => state.selectedAgentId);
  const agents = useOfficeStore((state) => state.agents);
  const movementMode = useOfficeStore((state) => state.movementMode);
  const cameraFollowPlayer = useOfficeStore((state) => state.cameraFollowPlayer);
  const playerPosition = useOfficeStore((state) => state.playerPosition);
  const cameraInteractionMode = useOfficeStore((state) => state.cameraInteractionMode);
  const cameraActionTrigger = useOfficeStore((state) => state.cameraActionTrigger);

  // Target vectors for animated preset transitions
  const desiredPos = useRef(new THREE.Vector3(17, 18, 17));
  const desiredTarget = useRef(new THREE.Vector3(0, 1.0, 0));
  const isTransitioning = useRef<boolean>(false);

  // Pan camera in screen space (parallel to screen plane)
  const panCamera = useCallback(
    (deltaX: number, deltaY: number) => {
      if (!controlsRef.current) return;
      isTransitioning.current = false;

      const target = controlsRef.current.target;
      const distance = camera.position.distanceTo(target);
      // Dynamic pan speed scaling: fine and precise when zoomed in, broad when zoomed out
      const factor = Math.max(distance * 0.065, 0.35);

      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);

      const offset = right.multiplyScalar(deltaX * factor).add(up.multiplyScalar(deltaY * factor));
      camera.position.add(offset);
      target.add(offset);

      controlsRef.current.update();
    },
    [camera]
  );

  // Zoom camera towards/away from target
  const zoomCamera = useCallback(
    (deltaZoom: number) => {
      if (!controlsRef.current) return;
      isTransitioning.current = false;

      const target = controlsRef.current.target;
      const offset = new THREE.Vector3().subVectors(camera.position, target);
      const currentDist = offset.length();

      // deltaZoom > 0 means zoom in (closer), deltaZoom < 0 means zoom out (further)
      const factor = deltaZoom > 0 ? 0.85 : 1.18;
      const newDist = THREE.MathUtils.clamp(currentDist * factor, 2.5, 85);

      offset.setLength(newDist);
      camera.position.copy(target).add(offset);
      controlsRef.current.update();
    },
    [camera]
  );

  // When a preset button is clicked, or "Reset Cam" is pressed, trigger smooth transition
  useEffect(() => {
    if (cameraPreset === 'FOCUS_AGENT' && selectedAgentId) {
      const agent = agents.find((a) => a.id === selectedAgentId);
      if (agent) {
        const targetPos = agent.status === 'working' ? agent.deskPosition : agent.chillPosition;
        desiredTarget.current.set(...targetPos);
        desiredPos.current.set(targetPos[0] + 5, targetPos[1] + 5, targetPos[2] + 5);
        isTransitioning.current = true;
      }
    } else if (PRESET_COORDINATES[cameraPreset]) {
      const coord = PRESET_COORDINATES[cameraPreset];
      desiredPos.current.set(...coord.pos);
      desiredTarget.current.set(...coord.target);
      isTransitioning.current = true;
    }
  }, [cameraPreset, cameraResetTrigger, selectedAgentId]);

  // Listen to programmatic camera actions (D-Pad, Arrow buttons, Zoom buttons)
  const lastActionIdRef = useRef<number>(-1);
  useEffect(() => {
    if (!cameraActionTrigger || cameraActionTrigger.id === lastActionIdRef.current) return;
    lastActionIdRef.current = cameraActionTrigger.id;

    switch (cameraActionTrigger.type) {
      case 'PAN_LEFT':
        panCamera(-1.0, 0);
        break;
      case 'PAN_RIGHT':
        panCamera(1.0, 0);
        break;
      case 'PAN_UP':
        panCamera(0, 1.0);
        break;
      case 'PAN_DOWN':
        panCamera(0, -1.0);
        break;
      case 'ZOOM_IN':
        zoomCamera(1);
        break;
      case 'ZOOM_OUT':
        zoomCamera(-1);
        break;
    }
  }, [cameraActionTrigger, panCamera, zoomCamera]);

  // Listen for keyboard arrow keys (←, →, ↑, ↓) & (+, -) to pan & zoom anytime!
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.code) {
        case 'ArrowLeft':
          e.preventDefault();
          panCamera(-1.2, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          panCamera(1.2, 0);
          break;
        case 'ArrowUp':
          e.preventDefault();
          panCamera(0, 1.2);
          break;
        case 'ArrowDown':
          e.preventDefault();
          panCamera(0, -1.2);
          break;
        case 'Equal':
          if (e.shiftKey || e.key === '+') {
            e.preventDefault();
            zoomCamera(1);
          }
          break;
        case 'Minus':
          e.preventDefault();
          zoomCamera(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panCamera, zoomCamera]);

  // Listen for user wheel & touch/mouse interaction to immediately yield 100% control
  useEffect(() => {
    const dom = gl.domElement;
    const stopTransition = () => {
      // User is actively interacting (zooming, dragging, or panning) - stop auto-centering!
      isTransitioning.current = false;
    };

    dom.addEventListener('wheel', stopTransition, { passive: true });
    dom.addEventListener('pointerdown', stopTransition, { passive: true });
    dom.addEventListener('touchstart', stopTransition, { passive: true });

    return () => {
      dom.removeEventListener('wheel', stopTransition);
      dom.removeEventListener('pointerdown', stopTransition);
      dom.removeEventListener('touchstart', stopTransition);
    };
  }, [gl]);

  useFrame((state, delta) => {
    // 1. If player is moving character in WASD manual mode
    if (movementMode === 'MANUAL' && cameraFollowPlayer) {
      desiredTarget.current.set(playerPosition[0], 1.0, playerPosition[2]);
      desiredPos.current.set(
        playerPosition[0] + 7,
        playerPosition[1] + 8,
        playerPosition[2] + 7
      );
      const lerp = THREE.MathUtils.clamp(delta * 4, 0, 1);
      camera.position.lerp(desiredPos.current, lerp);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(desiredTarget.current, lerp);
        controlsRef.current.update();
      }
      return;
    }

    // 2. If a preset transition is active, smoothly lerp to destination
    if (isTransitioning.current) {
      const lerpFactor = THREE.MathUtils.clamp(delta * 5, 0, 1);
      camera.position.lerp(desiredPos.current, lerpFactor);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(desiredTarget.current, lerpFactor);
        controlsRef.current.update();
      }

      // Once arrived within threshold, hand full control to OrbitControls!
      const posDist = camera.position.distanceTo(desiredPos.current);
      const targetDist = controlsRef.current
        ? controlsRef.current.target.distanceTo(desiredTarget.current)
        : 0;

      if (posDist < 0.08 && targetDist < 0.08) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      maxPolarAngle={Math.PI / 2.1}
      minDistance={2.5}
      maxDistance={85}
      zoomSpeed={1.3}
      rotateSpeed={0.8}
      panSpeed={1.2}
      screenSpacePanning={true}
      mouseButtons={{
        LEFT: cameraInteractionMode === 'PAN' ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: cameraInteractionMode === 'PAN' ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN
      }}
      touches={{
        ONE: cameraInteractionMode === 'PAN' ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      }}
      onStart={() => {
        isTransitioning.current = false;
      }}
    />
  );
};
