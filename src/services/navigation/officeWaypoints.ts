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
  scout: {
    id: 'desk-scout',
    name: 'Meja Scout',
    position: [-10.5, 0, -1.35],
    rotation: 0,
    type: 'desk',
    agentId: 'scout'
  },
  scribe: {
    id: 'desk-scribe',
    name: 'Meja Scribe',
    position: [-8.2, 0, -1.35],
    rotation: 0,
    type: 'desk',
    agentId: 'scribe'
  },
  pixel: {
    id: 'desk-pixel',
    name: 'Meja Pixel',
    position: [-5.8, 0, -1.35],
    rotation: 0,
    type: 'desk',
    agentId: 'pixel'
  },
  chronos: {
    id: 'desk-chronos',
    name: 'Meja Chronos',
    position: [-3.5, 0, -1.35],
    rotation: 0,
    type: 'desk',
    agentId: 'chronos'
  },
  radar: {
    id: 'desk-radar',
    name: 'Meja Radar',
    position: [-10.5, 0, 1.35],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'radar'
  },
  sentry: {
    id: 'desk-sentry',
    name: 'Meja Sentry',
    position: [-8.2, 0, 1.35],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'sentry'
  },
  hermes: {
    id: 'desk-hermes',
    name: 'Meja Hermes',
    position: [-5.8, 0, 1.35],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'hermes'
  },
  receptionist: {
    id: 'desk-receptionist',
    name: 'Meja Resepsionis',
    position: [0.1, 0, 6.0],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'receptionist'
  },
  chief: {
    id: 'desk-chief',
    name: 'Meja Pemimpin Redaksi',
    position: [-3.5, 0, 1.35],
    rotation: Math.PI,
    type: 'desk',
    agentId: 'chief'
  }
};

// 2. CORRIDOR TRANSIT WAYPOINTS (Safe clearance past walls and dividers)
export const TRANSIT_WAYPOINTS = {
  WEST_NORTH_AISLE: [-2.0, 0, -3.2] as [number, number, number],
  WEST_SOUTH_AISLE: [-2.0, 0, 2.5] as [number, number, number],
  MID_NORTH_CORRIDOR: [0.1, 0, -3.2] as [number, number, number],
  MID_SOUTH_CORRIDOR: [0.1, 0, 2.5] as [number, number, number],
  EAST_NORTH_AISLE: [2.5, 0, -3.2] as [number, number, number],
  EAST_SOUTH_AISLE: [2.5, 0, 2.5] as [number, number, number],
};

// 3. IDLE ROAMING DESTINATIONS (Breakroom, Kopi Tarak, Dining, Lounge)
export const ROAMING_WAYPOINTS: OfficeWaypoint[] = [
  // Kopi Tarak Barstools
  {
    id: 'bar-stool-1',
    name: 'Kursi Bar Kopi Tarak (Kiri)',
    position: [4.7, 0, -1.1],
    rotation: Math.PI,
    type: 'bar_seat'
  },
  {
    id: 'bar-stool-2',
    name: 'Kursi Bar Kopi Tarak (Tengah 1)',
    position: [5.9, 0, -1.1],
    rotation: Math.PI,
    type: 'bar_seat'
  },
  {
    id: 'bar-stool-3',
    name: 'Kursi Bar Kopi Tarak (Tengah 2)',
    position: [7.1, 0, -1.1],
    rotation: Math.PI,
    type: 'bar_seat'
  },
  {
    id: 'bar-stool-4',
    name: 'Kursi Bar Kopi Tarak (Kanan)',
    position: [8.3, 0, -1.1],
    rotation: Math.PI,
    type: 'bar_seat'
  },
  // Barista Order Counter
  {
    id: 'bar-order-point',
    name: 'Depan Barista Kopi Tarak',
    position: [6.5, 0, -1.8],
    rotation: 0, // facing barista
    type: 'standing_lounge'
  },
  // Dining Table 1
  {
    id: 'dining-1-n1',
    name: 'Meja Makan 1 (Utara)',
    position: [3.6, 0, 2.0],
    rotation: 0,
    type: 'dining_seat'
  },
  {
    id: 'dining-1-n2',
    name: 'Meja Makan 1 (Utara Kanan)',
    position: [4.8, 0, 2.0],
    rotation: 0,
    type: 'dining_seat'
  },
  {
    id: 'dining-1-s1',
    name: 'Meja Makan 1 (Selatan)',
    position: [3.6, 0, 3.6],
    rotation: Math.PI,
    type: 'dining_seat'
  },
  // Dining Table 2
  {
    id: 'dining-2-n1',
    name: 'Meja Makan 2 (Utara)',
    position: [8.6, 0, 2.0],
    rotation: 0,
    type: 'dining_seat'
  },
  {
    id: 'dining-2-s1',
    name: 'Meja Makan 2 (Selatan)',
    position: [8.6, 0, 3.6],
    rotation: Math.PI,
    type: 'dining_seat'
  },
  {
    id: 'dining-2-s2',
    name: 'Meja Makan 2 (Selatan Kanan)',
    position: [9.8, 0, 3.6],
    rotation: Math.PI,
    type: 'dining_seat'
  },
  // Standing Lounge / Pantry
  {
    id: 'fridge-area',
    name: 'Dekat Kulkas Breakroom',
    position: [10.5, 0, -5.5],
    rotation: -Math.PI / 2,
    type: 'standing_lounge'
  },
  {
    id: 'dispenser-area',
    name: 'Dekat Dispenser & Kopi',
    position: [12.0, 0, 0.5],
    rotation: -Math.PI / 2,
    type: 'standing_lounge'
  },
  {
    id: 'lounge-hallway',
    name: 'Lorong Lounge Santai',
    position: [4.5, 0, 0.5],
    rotation: 0,
    type: 'standing_lounge'
  }
];

/**
 * Calculates a collision-free path between two positions in the 3D office.
 * Automatically inserts corridor waypoints when crossing between West (Desks) and East (Breakroom).
 */
export function calculateOfficePath(
  startPos: [number, number, number],
  endPos: [number, number, number]
): [number, number, number][] {
  const isStartWest = startPos[0] < 0;
  const isEndWest = endPos[0] < 0;

  // 1. If moving within the same zone (both West or both East), direct travel is safe
  if (isStartWest === isEndWest) {
    return [endPos];
  }

  // 2. Crossing between West (Desks) and East (Breakroom) requires routing via Corridor
  const avgZ = (startPos[2] + endPos[2]) / 2;
  const useNorth = avgZ < 0;

  const westAisle = useNorth ? TRANSIT_WAYPOINTS.WEST_NORTH_AISLE : TRANSIT_WAYPOINTS.WEST_SOUTH_AISLE;
  const midCorridor = useNorth ? TRANSIT_WAYPOINTS.MID_NORTH_CORRIDOR : TRANSIT_WAYPOINTS.MID_SOUTH_CORRIDOR;
  const eastAisle = useNorth ? TRANSIT_WAYPOINTS.EAST_NORTH_AISLE : TRANSIT_WAYPOINTS.EAST_SOUTH_AISLE;

  if (isStartWest) {
    // West to East: Start -> West Aisle -> Mid Corridor -> East Aisle -> Destination
    return [westAisle, midCorridor, eastAisle, endPos];
  } else {
    // East to West: Start -> East Aisle -> Mid Corridor -> West Aisle -> Destination
    return [eastAisle, midCorridor, westAisle, endPos];
  }
}

/**
 * Returns a random roaming waypoint that is not currently occupied
 */
export function getRandomRoamingWaypoint(excludeId?: string): OfficeWaypoint {
  const pool = excludeId ? ROAMING_WAYPOINTS.filter((w) => w.id !== excludeId) : ROAMING_WAYPOINTS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || ROAMING_WAYPOINTS[0];
}

