'use client';

import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useOfficeStore } from '@/store/officeStore';
import { resolveCharacterCollision } from '@/services/physics/officeCollision';

interface KeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

export const CharacterController: React.FC = () => {
  const movementMode = useOfficeStore((state) => state.movementMode);
  const controlledAgentId = useOfficeStore((state) => state.controlledAgentId);
  const playerPosition = useOfficeStore((state) => state.playerPosition);
  const playerRotation = useOfficeStore((state) => state.playerRotation);
  const setPlayerTransform = useOfficeStore((state) => state.setPlayerTransform);

  // Position and velocity refs
  const posRef = useRef<[number, number, number]>([...playerPosition]);
  const rotRef = useRef<number>(playerRotation);
  const keys = useRef<KeyState>({ forward: false, backward: false, left: false, right: false });
  const isMovingRef = useRef<boolean>(false);

  // Synchronize when controlled agent changes
  useEffect(() => {
    posRef.current = [...playerPosition];
    rotRef.current = playerRotation;
  }, [controlledAgentId]);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't hijack keyboard if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.code) {
        case 'KeyW':
          keys.current.forward = true;
          break;
        case 'KeyS':
          keys.current.backward = true;
          break;
        case 'KeyA':
          keys.current.left = true;
          break;
        case 'KeyD':
          keys.current.right = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          keys.current.forward = false;
          break;
        case 'KeyS':
          keys.current.backward = false;
          break;
        case 'KeyA':
          keys.current.left = false;
          break;
        case 'KeyD':
          keys.current.right = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Frame update
  useFrame((state, delta) => {
    if (movementMode !== 'MANUAL') return;

    let moveX = 0;
    let moveZ = 0;

    if (keys.current.forward) moveZ -= 1;
    if (keys.current.backward) moveZ += 1;
    if (keys.current.left) moveX -= 1;
    if (keys.current.right) moveX += 1;

    const hasInput = moveX !== 0 || moveZ !== 0;
    isMovingRef.current = hasInput;

    if (hasInput) {
      // Normalize diagonal
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= length;
      moveZ /= length;

      const speed = 7.5 * delta;
      const desiredX = posRef.current[0] + moveX * speed;
      const desiredZ = posRef.current[2] + moveZ * speed;

      // Real-time 3D collision resolution against walls, glass partitions, desks, tables, and chairs
      const [resolvedX, , resolvedZ] = resolveCharacterCollision(
        posRef.current,
        [desiredX, 0, desiredZ],
        0.32
      );

      // Calculate facing angle based on input direction
      const targetAngle = Math.atan2(moveX, moveZ);
      rotRef.current = targetAngle;

      posRef.current = [resolvedX, 0, resolvedZ];
      setPlayerTransform(posRef.current, rotRef.current);
    }
  });

  return null;
};

