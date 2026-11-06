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
  // Divisi Redaksi AdaFakta (Sayap Barat)
  scribe: {
    id: 'desk-scribe',
    name: 'Meja Scribe',
    position: [-15.0, 0, -2.5],
    rotation: 0,
    type: 'desk',
    agentId: 'scribe'
  },
  pixel: {
    id: 'desk-pixel',
    name: 'Meja Pixel',
    position: [-12.0, 0, -2.5],
    rotation: 0,
    type: 'desk',
    agentId: 'pixel'
  },
  chronos: {
    id: 'desk-chronos',
    name: 'Meja Chronos',
    position: [-15.0, 0, 2.5],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'chronos'
  },
  hermes: {
    id: 'desk-hermes',
    name: 'Meja Hermes',
    position: [-12.0, 0, 2.5],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'hermes'
  },
  radar: {
    id: 'desk-radar',
    name: 'Meja Radar',
    position: [-9.0, 0, 2.5],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'radar'
  },
  sentry: {
    id: 'desk-sentry',
    name: 'Meja Sentry',
    position: [-18.5, 0, -5.5],
    rotation: 0,
    type: 'desk',
    agentId: 'sentry'
  },
  chief: {
    id: 'desk-chief',
    name: 'Meja Pemimpin Redaksi',
    position: [-18.5, 0, 0.0],
    rotation: Math.PI / 2,
    type: 'desk',
    agentId: 'chief'
  },

  // Central Hub
  receptionist: {
    id: 'desk-receptionist',
    name: 'Meja Resepsionis',
    position: [0.0, 0, 6.0],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'receptionist'
  },

  // Divisi Radar Intelijen & Bot Jurnalis (Sayap Timur - 7 Analis Rubrik)
  scout: {
    id: 'desk-scout',
    name: 'Meja Scout (Tekno & AI)',
    position: [9.5, 0, -3.2],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'scout'
  },
  gentra: {
    id: 'desk-gentra',
    name: 'Meja Gentra (Politik & Pemilu)',
    position: [13.5, 0, -3.2],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'gentra'
  },
  veritas: {
    id: 'desk-veritas',
    name: 'Meja Veritas (Hukum & Fakta)',
    position: [17.5, 0, -3.2],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'veritas'
  },
  gaia: {
    id: 'desk-gaia',
    name: 'Meja Gaia (Lingkungan & Iklim)',
    position: [9.5, 0, 3.2],
    rotation: 0,
    type: 'desk',
    agentId: 'gaia'
  },
  artha: {
    id: 'desk-artha',
    name: 'Meja Artha (Bisnis & Ekonomi)',
    position: [13.5, 0, 3.2],
    rotation: 0,
    type: 'desk',
    agentId: 'artha'
  },
  cipher: {
    id: 'desk-cipher',
    name: 'Meja Cipher (Internasional)',
    position: [17.5, 0, 3.2],
    rotation: 0,
    type: 'desk',
    agentId: 'cipher'
  },
  telebot: {
    id: 'desk-telebot',
    name: 'Konsol Sentral TeleBot Dispatcher',
    position: [13.5, 0, 0.0],
    rotation: Math.PI / 2,
    type: 'desk',
    agentId: 'telebot'
  }
};

// 2. CORRIDOR TRANSIT WAYPOINTS (Safe clearance past walls and dividers)
export const TRANSIT_WAYPOINTS = {
  WEST_MAIN_CORRIDOR: [-6.5, 0, 0.0] as [number, number, number],
  WEST_NORTH_AISLE: [-6.5, 0, -3.2] as [number, number, number],
  WEST_SOUTH_AISLE: [-6.5, 0, 2.5] as [number, number, number],
  MID_NORTH_CORRIDOR: [0.0, 0, -3.2] as [number, number, number],
  MID_SOUTH_CORRIDOR: [0.0, 0, 2.5] as [number, number, number],
  EAST_MAIN_CORRIDOR: [6.5, 0, 0.0] as [number, number, number],
  EAST_NORTH_AISLE: [6.5, 0, -3.2] as [number, number, number],
  EAST_SOUTH_AISLE: [6.5, 0, 2.5] as [number, number, number]
};

// 3. IDLE ROAMING DESTINATIONS (Central Hub Kopi Tarak & Lounge)
export const ROAMING_WAYPOINTS: OfficeWaypoint[] = [
  // Kopi Tarak Barstools (Central Hub)
  {
    id: 'bar-stool-1',
    name: 'Kursi Bar Kopi Tarak (Kiri)',
    position: [-2.0, 0, -3.2],
    rotation: Math.PI,
    type: 'bar_seat'
  },
  {
    id: 'bar-stool-2',
    name: 'Kursi Bar Kopi Tarak (Tengah 1)',
    position: [-0.7, 0, -3.2],
    rotation: Math.PI,
    type: 'bar_seat'
  },
  {
    id: 'bar-stool-3',
    name: 'Kursi Bar Kopi Tarak (Tengah 2)',
    position: [0.7, 0, -3.2],
    rotation: Math.PI,
    type: 'bar_seat'
  },
  {
    id: 'bar-stool-4',
    name: 'Kursi Bar Kopi Tarak (Kanan)',
    position: [2.0, 0, -3.2],
    rotation: Math.PI,
    type: 'bar_seat'
  },
  // Barista Order Counter
  {
    id: 'bar-order-point',
    name: 'Depan Barista Kopi Tarak',
    position: [0.0, 0, -3.8],
    rotation: 0, // facing barista
    type: 'standing_lounge'
  },
  // Dining Tables (Central Hub)
  {
    id: 'dining-1-n1',
    name: 'Meja Makan Komunal 1',
    position: [-2.0, 0, 2.5],
    rotation: 0,
    type: 'dining_seat'
  },
  {
    id: 'dining-1-n2',
    name: 'Meja Makan Komunal 2',
    position: [2.0, 0, 2.5],
    rotation: Math.PI,
    type: 'dining_seat'
  },
  // Lounge Areas
  {
    id: 'lounge-west',
    name: 'Sofa Santai Barat',
    position: [-4.2, 0, 4.2],
    rotation: 0,
    type: 'standing_lounge'
  },
  {
    id: 'lounge-east',
    name: 'Sofa Santai Timur',
    position: [4.2, 0, 4.2],
    rotation: 0,
    type: 'standing_lounge'
  },
  {
    id: 'dispenser-area',
    name: 'Area Kulkas & Dispenser Kopi Tarak',
    position: [3.8, 0, -4.2],
    rotation: -Math.PI / 2,
    type: 'standing_lounge'
  }
];

/**
 * Calculates a collision-free path between two positions across the 3-zone diorama:
 * Zone 1: Sayap Barat (X < -6)
 * Zone 2: Central Hub Kopi Tarak (-6 <= X <= 6)
 * Zone 3: Sayap Timur (X > 6)
 */
export function calculateOfficePath(
  startPos: [number, number, number],
  endPos: [number, number, number]
): [number, number, number][] {
  const getZone = (x: number) => (x < -6 ? 1 : x > 6 ? 3 : 2);
  const startZone = getZone(startPos[0]);
  const endZone = getZone(endPos[0]);

  // Within the same zone, direct movement is safe
  if (startZone === endZone) {
    return [endPos];
  }

  const avgZ = (startPos[2] + endPos[2]) / 2;
  const useNorth = avgZ < 0;
  const westAisle = useNorth ? TRANSIT_WAYPOINTS.WEST_NORTH_AISLE : TRANSIT_WAYPOINTS.WEST_SOUTH_AISLE;
  const midCorridor = useNorth ? TRANSIT_WAYPOINTS.MID_NORTH_CORRIDOR : TRANSIT_WAYPOINTS.MID_SOUTH_CORRIDOR;
  const eastAisle = useNorth ? TRANSIT_WAYPOINTS.EAST_NORTH_AISLE : TRANSIT_WAYPOINTS.EAST_SOUTH_AISLE;

  if (startZone === 1 && endZone === 2) {
    return [westAisle, midCorridor, endPos];
  }
  if (startZone === 2 && endZone === 1) {
    return [midCorridor, westAisle, endPos];
  }
  if (startZone === 3 && endZone === 2) {
    return [eastAisle, midCorridor, endPos];
  }
  if (startZone === 2 && endZone === 3) {
    return [midCorridor, eastAisle, endPos];
  }
  if (startZone === 1 && endZone === 3) {
    return [westAisle, midCorridor, eastAisle, endPos];
  }
  if (startZone === 3 && endZone === 1) {
    return [eastAisle, midCorridor, westAisle, endPos];
  }

  return [endPos];
}

/**
 * Returns a random roaming waypoint that is not currently occupied
 */
export function getRandomRoamingWaypoint(excludeId?: string): OfficeWaypoint {
  const pool = excludeId ? ROAMING_WAYPOINTS.filter((w) => w.id !== excludeId) : ROAMING_WAYPOINTS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || ROAMING_WAYPOINTS[0];
}

