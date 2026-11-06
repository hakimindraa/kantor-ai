import { AgentId } from '@/types/agent';

export interface OfficeWaypoint {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: number;
  type: 'desk' | 'transit' | 'bar_seat' | 'dining_seat' | 'standing_lounge';
  agentId?: AgentId;
}

// 1. DESK WORKSTATIONS (Target coordinates when working)
export const DESK_WAYPOINTS: Record<AgentId, OfficeWaypoint> = {
  // Divisi Redaksi AdaFakta (Sayap Barat - 6 Ruangan Tematik Terpartisi)
  scout_west: {
    id: 'desk-scout-west',
    name: 'Meja Radar Draf Depan',
    position: [-23.5, 0, -0.9],
    rotation: 0,
    type: 'desk',
    agentId: 'scout_west'
  },
  pixel: {
    id: 'desk-pixel',
    name: 'Meja Studio Foto Pixel',
    position: [-18.5, 0, -8.3],
    rotation: 0,
    type: 'desk',
    agentId: 'pixel'
  },
  sadur: {
    id: 'desk-sadur',
    name: 'Meja Kliping & Sadur URL',
    position: [-10.5, 0, -8.3],
    rotation: 0,
    type: 'desk',
    agentId: 'sadur'
  },
  scribe: {
    id: 'desk-scribe',
    name: 'Podium Publikasi Redaksi',
    position: [-18.5, 0, 0.0],
    rotation: 0,
    type: 'desk',
    agentId: 'scribe'
  },
  nova: {
    id: 'desk-nova',
    name: 'Lab AI Studio Nova',
    position: [-25.5, 0, 8.3],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'nova'
  },
  chronos: {
    id: 'desk-chronos',
    name: 'Meja Chronos Waterfall',
    position: [-13.5, 0, -0.9],
    rotation: 0,
    type: 'desk',
    agentId: 'chronos'
  },
  hrd: {
    id: 'desk-hrd',
    name: 'Papan Tim Penulis HRD',
    position: [-12.5, 0, 8.0],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'hrd'
  },
  robosweep: {
    id: 'desk-robosweep',
    name: 'Docking Charger Robo-Sweep',
    position: [-28.8, 0, -6.0],
    rotation: 0,
    type: 'desk',
    agentId: 'robosweep'
  },
  hermes: {
    id: 'desk-hermes',
    name: 'Meja Hermes Dispatch',
    position: [-10.5, 0, 8.0],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'hermes'
  },
  radar: {
    id: 'desk-radar',
    name: 'Meja Radar SEO',
    position: [-8.5, 0, 8.0],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'radar'
  },
  sentry: {
    id: 'desk-sentry',
    name: 'Meja Sentry DevOps',
    position: [-25.0, 0, -8.3],
    rotation: 0,
    type: 'desk',
    agentId: 'sentry'
  },
  chief: {
    id: 'desk-chief',
    name: 'Podium Utama Redaksi',
    position: [-18.5, 0, 0.0],
    rotation: 0,
    type: 'desk',
    agentId: 'chief'
  },

  // Central Hub
  receptionist: {
    id: 'desk-receptionist',
    name: 'Meja Resepsionis',
    position: [-1.5, 0, 6.0],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'receptionist'
  },

  // Divisi Radar Intelijen & Bot Jurnalis (Kantor Timur - 7 Analis Rubrik Berdampingan)
  scout: {
    id: 'desk-scout',
    name: 'Meja Scout (Tekno & AI)',
    position: [7.5, 0, -3.8],
    rotation: 0,
    type: 'desk',
    agentId: 'scout'
  },
  gentra: {
    id: 'desk-gentra',
    name: 'Meja Gentra (Politik & Pemilu)',
    position: [10.5, 0, -3.8],
    rotation: 0,
    type: 'desk',
    agentId: 'gentra'
  },
  veritas: {
    id: 'desk-veritas',
    name: 'Meja Veritas (Hukum & Fakta)',
    position: [13.5, 0, -3.8],
    rotation: 0,
    type: 'desk',
    agentId: 'veritas'
  },
  gaia: {
    id: 'desk-gaia',
    name: 'Meja Gaia (Lingkungan & Iklim)',
    position: [7.5, 0, 3.8],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'gaia'
  },
  artha: {
    id: 'desk-artha',
    name: 'Meja Artha (Bisnis & Ekonomi)',
    position: [10.5, 0, 3.8],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'artha'
  },
  cipher: {
    id: 'desk-cipher',
    name: 'Meja Cipher (Internasional)',
    position: [13.5, 0, 3.8],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'cipher'
  },
  telebot: {
    id: 'desk-telebot',
    name: 'Konsol Sentral TeleBot Dispatcher',
    position: [9.3, 0, 0.0],
    rotation: Math.PI / 2,
    type: 'desk',
    agentId: 'telebot'
  }
};

// 2. CORRIDOR TRANSIT WAYPOINTS (Safe clearance past walls and dividers)
export const TRANSIT_WAYPOINTS = {
  WEST_MAIN_CORRIDOR: [-18.5, 0, 0.0] as [number, number, number],
  WEST_DOORWAY: [-6.5, 0, 0.0] as [number, number, number],
  CENTRAL_HUB_WALKWAY: [-1.5, 0, 0.0] as [number, number, number],
  EAST_DOORWAY: [3.5, 0, 0.0] as [number, number, number],
  EAST_MAIN_CORRIDOR: [10.5, 0, 0.0] as [number, number, number]
};

// 3. IDLE ROAMING DESTINATIONS (Central Hub: Kedai Kopi Tarak & Lounge)
export const ROAMING_WAYPOINTS: OfficeWaypoint[] = [
  // Kopi Tarak Barstools (Menghadap Barista & Meja Bar)
  {
    id: 'bar-stool-1',
    name: 'Kursi Bar Kopi Tarak 1',
    position: [-3.3, 0, -3.7],
    rotation: Math.PI,
    type: 'bar_seat'
  },
  {
    id: 'bar-stool-2',
    name: 'Kursi Bar Kopi Tarak 2',
    position: [-2.1, 0, -3.7],
    rotation: Math.PI,
    type: 'bar_seat'
  },
  {
    id: 'bar-stool-3',
    name: 'Kursi Bar Kopi Tarak 3',
    position: [-0.9, 0, -3.7],
    rotation: Math.PI,
    type: 'bar_seat'
  },
  {
    id: 'bar-stool-4',
    name: 'Kursi Bar Kopi Tarak 4',
    position: [0.3, 0, -3.7],
    rotation: Math.PI,
    type: 'bar_seat'
  },
  // Communal Dining Table in South Half of Central Hub
  {
    id: 'dining-1',
    name: 'Meja Komunal Santai 1',
    position: [-2.3, 0, 5.1],
    rotation: 0,
    type: 'dining_seat'
  },
  {
    id: 'dining-2',
    name: 'Meja Komunal Santai 2',
    position: [-0.7, 0, 5.1],
    rotation: 0,
    type: 'dining_seat'
  },
  {
    id: 'dining-3',
    name: 'Meja Komunal Santai 3',
    position: [-2.3, 0, 6.9],
    rotation: Math.PI,
    type: 'dining_seat'
  },
  {
    id: 'dining-4',
    name: 'Meja Komunal Santai 4',
    position: [-0.7, 0, 6.9],
    rotation: Math.PI,
    type: 'dining_seat'
  },
  // Standing Lounge
  {
    id: 'lounge-central',
    name: 'Lounge Santai Tengah',
    position: [-1.5, 0, 2.0],
    rotation: 0,
    type: 'standing_lounge'
  },
  {
    id: 'lounge-east',
    name: 'Area Briefing Radar Timur',
    position: [10.5, 0, -6.5],
    rotation: 0,
    type: 'standing_lounge'
  }
];

/**
 * Helper to identify which partitioned room a coordinate belongs to.
 * Returns null if the position is already in the main corridor/open area.
 */
function getPartitionedRoom(pos: [number, number, number]): {
  roomId: string;
  doorwayHallNode: [number, number, number];
  doorwayThreshold: [number, number, number];
} | null {
  const x = pos[0];
  const z = pos[2];

  // Ruang 01: Server & DevOps Room (Pojok Kiri Belakang)
  if (x < -22.5 && z < -4.35) {
    return {
      roomId: 'room-01',
      doorwayThreshold: [-25.0, 0, -4.5],
      doorwayHallNode: [-25.0, 0, -3.0]
    };
  }

  // Ruang 02: Studio Foto & Multimedia (Kiri-Tengah Belakang)
  if (x >= -22.5 && x < -14.5 && z < -4.35) {
    return {
      roomId: 'room-02',
      doorwayThreshold: [-18.5, 0, -4.5],
      doorwayHallNode: [-18.5, 0, -3.0]
    };
  }

  // Ruang 05: Biro Kliping & Sadur URL (Kanan Belakang)
  if (x >= -14.5 && x < -6.5 && z < -4.35) {
    return {
      roomId: 'room-05',
      doorwayThreshold: [-10.5, 0, -4.5],
      doorwayHallNode: [-10.5, 0, -3.0]
    };
  }

  // Ruang 03: Lab AI Studio Nova (Pojok Kiri Depan)
  if (x < -22.5 && z > 4.35) {
    return {
      roomId: 'room-03',
      doorwayThreshold: [-25.0, 0, 4.5],
      doorwayHallNode: [-25.0, 0, 3.0]
    };
  }

  // Ruang 06: Biro Tim Penulis, HRD & SEO (Kanan Depan)
  if (x >= -14.5 && x < -6.5 && z > 4.35) {
    return {
      roomId: 'room-06',
      doorwayThreshold: [-10.5, 0, 4.5],
      doorwayHallNode: [-10.5, 0, 3.0]
    };
  }

  return null;
}

/**
 * Calculates a collision-free path between two positions across the 3-zone diorama:
 * Zone 1: Kantor Barat (X < -6.5)
 * Zone 2: Central Hub Kopi Tarak (-6.5 <= X <= 3.5)
 * Zone 3: Kantor Timur (X > 3.5)
 * Guaranteed to route through actual door openings and hallway corridors without cutting glass or desks.
 */
export function calculateOfficePath(
  startPos: [number, number, number],
  endPos: [number, number, number]
): [number, number, number][] {
  const waypoints: [number, number, number][] = [];

  const startRoom = getPartitionedRoom(startPos);
  const endRoom = getPartitionedRoom(endPos);

  // If start is inside a closed room, exit through its doorway
  if (startRoom) {
    waypoints.push(startRoom.doorwayThreshold);
    waypoints.push(startRoom.doorwayHallNode);
  }

  const getZone = (x: number): 1 | 2 | 3 => {
    if (x < -6.5) return 1;
    if (x > 3.5) return 3;
    return 2;
  };

  const currentZoneNode = waypoints.length > 0 ? waypoints[waypoints.length - 1] : startPos;
  const startZone = getZone(currentZoneNode[0]);
  const endZone = getZone(endPos[0]);

  const westDoor: [number, number, number] = [-6.5, 0, 0.0];
  const centralHubWalkway: [number, number, number] = [-1.5, 0, 0.0];
  const eastDoor: [number, number, number] = [3.5, 0, 0.0];

  if (startZone !== endZone) {
    // Moving between Barat (1) and Timur (3)
    if (startZone === 1 && endZone === 3) {
      waypoints.push(westDoor);
      waypoints.push(centralHubWalkway);
      waypoints.push(eastDoor);
    } else if (startZone === 3 && endZone === 1) {
      waypoints.push(eastDoor);
      waypoints.push(centralHubWalkway);
      waypoints.push(westDoor);
    } else if (startZone === 1 && endZone === 2) {
      waypoints.push(westDoor);
    } else if (startZone === 2 && endZone === 1) {
      waypoints.push(westDoor);
    } else if (startZone === 2 && endZone === 3) {
      waypoints.push(eastDoor);
    } else if (startZone === 3 && endZone === 2) {
      waypoints.push(eastDoor);
    }
  }

  // If destination is inside a closed room, enter through its doorway
  if (endRoom) {
    waypoints.push(endRoom.doorwayHallNode);
    waypoints.push(endRoom.doorwayThreshold);
  }

  // Final destination
  waypoints.push(endPos);

  return waypoints;
}

/**
 * Returns a random roaming waypoint that is not currently occupied
 */
export function getRandomRoamingWaypoint(excludeId?: string): OfficeWaypoint {
  const pool = excludeId ? ROAMING_WAYPOINTS.filter((w) => w.id !== excludeId) : ROAMING_WAYPOINTS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || ROAMING_WAYPOINTS[0];
}

