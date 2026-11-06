/**
 * Real-time 3D Collision Detection & Sliding Physics Engine for Kantor AI Newsroom
 * Prevents characters from phasing through glass partitions, solid walls, desks, tables,
 * server racks, and chairs.
 */

export interface ColliderAABB {
  id: string;
  name: string;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  type: 'wall' | 'glass' | 'desk' | 'counter' | 'server' | 'chair' | 'prop';
  chairPos?: [number, number]; // [x, z] if this is a chair, allowing sitting agent to dismount
}

export const PLAYABLE_BOUNDS = {
  minX: -29.5,
  maxX: 17.0,
  minZ: -9.5,
  maxZ: 9.5
};

export const CHARACTER_RADIUS = 0.32;

/**
 * All physical obstacle colliders in the office diorama
 */
export const OFFICE_COLLIDERS: ColliderAABB[] = [
  // ================= 1. PERIMETER WALLS =================
  {
    id: 'wall-back',
    name: 'Dinding Belakang Diorama',
    minX: -30.5,
    maxX: 18.0,
    minZ: -10.5,
    maxZ: -9.5,
    type: 'wall'
  },
  {
    id: 'wall-front-edge',
    name: 'Bibir Depan Diorama',
    minX: -30.5,
    maxX: 18.0,
    minZ: 9.5,
    maxZ: 10.5,
    type: 'wall'
  },
  {
    id: 'wall-left-west',
    name: 'Dinding Kiri Kantor Barat',
    minX: -30.5,
    maxX: -29.6,
    minZ: -10.5,
    maxZ: 10.5,
    type: 'wall'
  },
  {
    id: 'wall-right-east',
    name: 'Dinding Kanan Kantor Timur',
    minX: 17.1,
    maxX: 18.0,
    minZ: -10.5,
    maxZ: 10.5,
    type: 'wall'
  },

  // ================= 2. INTER-ZONE GLASS PARTITIONS =================
  // Gerbang Kaca Barat (X = -6.5): Doorway is Z in [-2.8, 2.8]
  {
    id: 'glass-west-arch-north',
    name: 'Partisi Kaca Barat Utara',
    minX: -6.65,
    maxX: -6.35,
    minZ: -10.0,
    maxZ: -2.8,
    type: 'glass'
  },
  {
    id: 'glass-west-arch-south',
    name: 'Partisi Kaca Barat Selatan',
    minX: -6.65,
    maxX: -6.35,
    minZ: 2.8,
    maxZ: 10.0,
    type: 'glass'
  },

  // Gerbang Kaca Timur (X = +3.5): Doorway is Z in [-2.8, 2.8]
  {
    id: 'glass-east-arch-north',
    name: 'Partisi Kaca Timur Utara',
    minX: 3.35,
    maxX: 3.65,
    minZ: -10.0,
    maxZ: -2.8,
    type: 'glass'
  },
  {
    id: 'glass-east-arch-south',
    name: 'Partisi Kaca Timur Selatan',
    minX: 3.35,
    maxX: 3.65,
    minZ: 2.8,
    maxZ: 10.0,
    type: 'glass'
  },

  // ================= 3. KANTOR BARAT ROOM PARTITIONS =================
  // Ruang 01 (Server Room): divider X = -22.5, front Z = -4.5 (doorway X in [-26.5, -23.5])
  {
    id: 'glass-room01-east',
    name: 'Dinding Kaca Ruang 01 Server (Timur)',
    minX: -22.65,
    maxX: -22.35,
    minZ: -10.0,
    maxZ: -4.5,
    type: 'glass'
  },
  {
    id: 'glass-room01-front',
    name: 'Dinding Kaca Ruang 01 Server (Depan)',
    minX: -30.0,
    maxX: -26.5,
    minZ: -4.65,
    maxZ: -4.35,
    type: 'glass'
  },

  // Ruang 02 (Studio Foto): divider X = -14.5, front Z = -4.5 (doorway X in [-20.5, -16.5])
  {
    id: 'glass-room02-east',
    name: 'Dinding Kaca Ruang 02 Studio (Timur)',
    minX: -14.65,
    maxX: -14.35,
    minZ: -10.0,
    maxZ: -4.5,
    type: 'glass'
  },
  {
    id: 'glass-room02-front-left',
    name: 'Dinding Kaca Ruang 02 Studio (Depan Kiri)',
    minX: -22.5,
    maxX: -20.5,
    minZ: -4.65,
    maxZ: -4.35,
    type: 'glass'
  },
  {
    id: 'glass-room02-front-right',
    name: 'Dinding Kaca Ruang 02 Studio (Depan Kanan)',
    minX: -16.5,
    maxX: -14.5,
    minZ: -4.65,
    maxZ: -4.35,
    type: 'glass'
  },

  // Ruang 05 (Biro Kliping): front Z = -4.5 (doorway X in [-12.0, -9.0])
  {
    id: 'glass-room05-front-left',
    name: 'Dinding Kaca Ruang 05 Kliping (Depan Kiri)',
    minX: -14.5,
    maxX: -12.0,
    minZ: -4.65,
    maxZ: -4.35,
    type: 'glass'
  },
  {
    id: 'glass-room05-front-right',
    name: 'Dinding Kaca Ruang 05 Kliping (Depan Kanan)',
    minX: -9.0,
    maxX: -6.5,
    minZ: -4.65,
    maxZ: -4.35,
    type: 'glass'
  },

  // Ruang 03 (Lab AI Studio): divider X = -22.5, rear Z = 4.5 (doorway X in [-26.5, -23.5])
  {
    id: 'glass-room03-east',
    name: 'Dinding Kaca Ruang 03 AI Lab (Timur)',
    minX: -22.65,
    maxX: -22.35,
    minZ: 4.5,
    maxZ: 10.0,
    type: 'glass'
  },
  {
    id: 'glass-room03-rear',
    name: 'Dinding Kaca Ruang 03 AI Lab (Belakang)',
    minX: -30.0,
    maxX: -26.5,
    minZ: 4.35,
    maxZ: 4.65,
    type: 'glass'
  },

  // Ruang 06 (Biro Tim Penulis & SEO): divider X = -14.5, rear Z = 4.5 (doorway X in [-12.0, -9.0])
  {
    id: 'glass-room06-east',
    name: 'Dinding Kaca Ruang 06 Writers (Timur)',
    minX: -14.65,
    maxX: -14.35,
    minZ: 4.5,
    maxZ: 10.0,
    type: 'glass'
  },
  {
    id: 'glass-room06-rear-left',
    name: 'Dinding Kaca Ruang 06 Writers (Belakang Kiri)',
    minX: -14.5,
    maxX: -12.0,
    minZ: 4.35,
    maxZ: 4.65,
    type: 'glass'
  },
  {
    id: 'glass-room06-rear-right',
    name: 'Dinding Kaca Ruang 06 Writers (Belakang Kanan)',
    minX: -9.0,
    maxX: -6.5,
    minZ: 4.35,
    maxZ: 4.65,
    type: 'glass'
  },

  // ================= 4. FURNITURE: KANTOR BARAT =================
  // Ruang 01: Server Racks & Desk
  {
    id: 'desk-server-racks-west',
    name: '42U Server Racks Ruang 01',
    minX: -29.5,
    maxX: -25.5,
    minZ: -8.8,
    maxZ: -7.2,
    type: 'server'
  },
  {
    id: 'desk-sentry',
    name: 'Meja Terminal Sentry DevOps',
    minX: -25.9,
    maxX: -24.1,
    minZ: -7.95,
    maxZ: -7.05,
    type: 'desk'
  },
  {
    id: 'prop-robosweep-dock',
    name: 'Docking Charger Robo-Sweep',
    minX: -29.4,
    maxX: -28.2,
    minZ: -6.5,
    maxZ: -5.5,
    type: 'prop'
  },

  // Ruang 02: Studio Cyclorama Backdrop & Pixel Desk
  {
    id: 'prop-cyclorama-backdrop',
    name: 'Backdrop Cyclorama Foto',
    minX: -20.8,
    maxX: -16.2,
    minZ: -9.8,
    maxZ: -9.2,
    type: 'prop'
  },
  {
    id: 'desk-pixel',
    name: 'Meja Editing Pixel',
    minX: -19.5,
    maxX: -17.5,
    minZ: -7.95,
    maxZ: -7.05,
    type: 'desk'
  },
  {
    id: 'prop-studio-tripod',
    name: 'Tripod Kamera & Softbox Blitz',
    minX: -16.2,
    maxX: -15.4,
    minZ: -7.9,
    maxZ: -7.1,
    type: 'prop'
  },

  // Ruang 05: Sadur Desk
  {
    id: 'desk-sadur',
    name: 'Meja Kliping & Sadur URL',
    minX: -11.6,
    maxX: -9.4,
    minZ: -8.0,
    maxZ: -7.0,
    type: 'desk'
  },

  // Ruang 04: Panggung Podium Redaksi & Meja Sisi
  {
    id: 'podium-scribe-rostrum',
    name: 'Podium Terbit Utama Redaksi (Scribe Rostrum)',
    minX: -18.9,
    maxX: -18.1,
    minZ: 0.25,
    maxZ: 0.65,
    type: 'desk'
  },
  {
    id: 'desk-scout-west',
    name: 'Meja Radar Draf Masuk (Scout Barat)',
    minX: -24.5,
    maxX: -22.5,
    minZ: -0.45,
    maxZ: 0.45,
    type: 'desk'
  },
  {
    id: 'desk-chronos',
    name: 'Meja Waterfall Scheduler (Chronos)',
    minX: -14.5,
    maxX: -12.5,
    minZ: -0.45,
    maxZ: 0.45,
    type: 'desk'
  },

  // Ruang 03: Lab AI Studio Nova Desk & Tube
  {
    id: 'desk-nova',
    name: 'Meja Lab AI Studio Nova',
    minX: -26.6,
    maxX: -24.4,
    minZ: 7.0,
    maxZ: 8.0,
    type: 'desk'
  },
  {
    id: 'prop-nova-hologram-tube',
    name: 'Tabung Hologram AI Studio',
    minX: -29.2,
    maxX: -27.8,
    minZ: 6.8,
    maxZ: 8.2,
    type: 'prop'
  },

  // Ruang 06: Tim Penulis, HRD & SEO Desks
  {
    id: 'prop-whiteboard-roster',
    name: 'Papan Tulis Tim Penulis & Roster',
    minX: -11.5,
    maxX: -9.5,
    minZ: 9.1,
    maxZ: 9.7,
    type: 'prop'
  },
  {
    id: 'desk-hrd',
    name: 'Meja Tim Penulis (HRD)',
    minX: -13.4,
    maxX: -11.6,
    minZ: 6.75,
    maxZ: 7.65,
    type: 'desk'
  },
  {
    id: 'desk-radar',
    name: 'Meja SEO & Indexing (Radar)',
    minX: -9.4,
    maxX: -7.6,
    minZ: 6.75,
    maxZ: 7.65,
    type: 'desk'
  },

  // ================= 5. FURNITURE: CENTRAL HUB (KOPI TARAK) =================
  // Bar Counter & Espresso Machine
  {
    id: 'counter-kopi-tarak',
    name: 'Meja Bar Kopi Tarak',
    minX: -3.9,
    maxX: 0.9,
    minZ: -5.5,
    maxZ: -4.5,
    type: 'counter'
  },
  // Back Bar Shelves & Cabinets
  {
    id: 'shelves-kopi-tarak',
    name: 'Rak Belakang Bar Kopi Tarak',
    minX: -3.9,
    maxX: 0.9,
    minZ: -8.0,
    maxZ: -7.0,
    type: 'counter'
  },
  // Barista Stall (Area Berdiri Bang Tarak)
  {
    id: 'barista-bang-tarak-stall',
    name: 'Posisi Barista Bang Tarak',
    minX: -2.0,
    maxX: -1.0,
    minZ: -6.5,
    maxZ: -5.5,
    type: 'counter'
  },
  // Communal Dining Table in South Half
  {
    id: 'table-communal-lounge',
    name: 'Meja Makan Komunal Kopi Tarak',
    minX: -3.1,
    maxX: 0.1,
    minZ: 5.4,
    maxZ: 6.6,
    type: 'desk'
  },

  // ================= 6. FURNITURE: KANTOR TIMUR (RADAR BOT TELE) =================
  // North Radar Desk Cluster (Scout, Gentra, Veritas)
  {
    id: 'desk-radar-north-bay',
    name: 'Meja Radar Utara (Scout, Gentra, Veritas)',
    minX: 6.6,
    maxX: 14.4,
    minZ: -3.6,
    maxZ: -2.4,
    type: 'desk'
  },
  // South Radar Desk Cluster (Gaia, Artha, Cipher)
  {
    id: 'desk-radar-south-bay',
    name: 'Meja Radar Selatan (Gaia, Artha, Cipher)',
    minX: 6.6,
    maxX: 14.4,
    minZ: 2.4,
    maxZ: 3.6,
    type: 'desk'
  },
  // TeleBot Command Pedestal
  {
    id: 'pedestal-telebot',
    name: 'Konsol Sentral TeleBot',
    minX: 9.5,
    maxX: 11.5,
    minZ: -1.0,
    maxZ: 1.0,
    type: 'desk'
  },
  // Kantor Timur OSINT Server Racks
  {
    id: 'server-racks-east',
    name: 'OSINT Server Racks Kantor Timur',
    minX: 13.8,
    maxX: 17.2,
    minZ: -8.2,
    maxZ: -6.8,
    type: 'server'
  }
];

/**
 * Checks if a point (x, z) with radius r intersects any collider in the office.
 */
export function isPositionColliding(
  x: number,
  z: number,
  radius: number = CHARACTER_RADIUS
): boolean {
  // Check diorama outer boundary
  if (
    x - radius < PLAYABLE_BOUNDS.minX ||
    x + radius > PLAYABLE_BOUNDS.maxX ||
    z - radius < PLAYABLE_BOUNDS.minZ ||
    z + radius > PLAYABLE_BOUNDS.maxZ
  ) {
    return true;
  }

  for (let i = 0; i < OFFICE_COLLIDERS.length; i++) {
    const c = OFFICE_COLLIDERS[i];

    // Minkowski expansion by character radius
    const expandedMinX = c.minX - radius;
    const expandedMaxX = c.maxX + radius;
    const expandedMinZ = c.minZ - radius;
    const expandedMaxZ = c.maxZ + radius;

    if (x > expandedMinX && x < expandedMaxX && z > expandedMinZ && z < expandedMaxZ) {
      return true;
    }
  }

  return false;
}

/**
 * Resolves movement from currentPos towards desiredPos using independent axis sliding.
 * If moving in a direction hits an obstacle, the character slides along the surface.
 */
export function resolveCharacterCollision(
  currentPos: [number, number, number],
  desiredPos: [number, number, number],
  radius: number = CHARACTER_RADIUS
): [number, number, number] {
  const currentX = currentPos[0];
  const currentY = currentPos[1];
  const currentZ = currentPos[2];

  let targetX = desiredPos[0];
  let targetZ = desiredPos[2];

  // Clamp desired targets to diorama floor
  targetX = Math.max(PLAYABLE_BOUNDS.minX + radius, Math.min(PLAYABLE_BOUNDS.maxX - radius, targetX));
  targetZ = Math.max(PLAYABLE_BOUNDS.minZ + radius, Math.min(PLAYABLE_BOUNDS.maxZ - radius, targetZ));

  // If already free and not colliding at destination, accept move
  if (!isPositionColliding(targetX, targetZ, radius)) {
    return [targetX, currentY, targetZ];
  }

  // Attempt sliding: Test X movement alone
  let resolvedX = currentX;
  if (!isPositionColliding(targetX, currentZ, radius)) {
    resolvedX = targetX;
  }

  // Attempt sliding: Test Z movement alone
  let resolvedZ = currentZ;
  if (!isPositionColliding(currentX, targetZ, radius)) {
    resolvedZ = targetZ;
  }

  // If both X and Z separately were ok, but combined hit a corner, pick the axis with larger movement
  if (resolvedX !== currentX && resolvedZ !== currentZ) {
    if (isPositionColliding(resolvedX, resolvedZ, radius)) {
      const dx = Math.abs(targetX - currentX);
      const dz = Math.abs(targetZ - currentZ);
      if (dx >= dz) {
        resolvedZ = currentZ;
      } else {
        resolvedX = currentX;
      }
    }
  }

  return [resolvedX, currentY, resolvedZ];
}

