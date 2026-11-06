import { AgentId } from './agent';

export type MovementMode = 'AUTOMATIC' | 'MANUAL';

export type CameraInteractionMode = 'ORBIT' | 'PAN';

export type OfficeDataMode = 'LIVE' | 'DEMO';

export type TimeOfDay = 'DAY' | 'SUNSET' | 'NIGHT';

export type RemoteActionType =
  | 'SCRAPE_NOW'
  | 'PUBLISH_NOW'
  | 'PURGE_CACHE'
  | 'TEST_TELEGRAM';

export interface OfficeIncident {
  type: 'API_TIMEOUT' | 'DB_HIGH_LATENCY' | 'QUEUE_EMPTY' | 'NONE';
  message: string;
  active: boolean;
  timestamp?: number;
}

export interface HologramEvent {
  agentId: AgentId;
  type: 'WEBP_COMPRESS' | 'GEMINI_DRAFT' | 'RSS_BREAKING' | 'TELEGRAM_ALERT' | 'SEO_PING';
  title: string;
  subtitle?: string;
  timestamp: number;
}

export type CameraActionType =
  | 'PAN_LEFT'
  | 'PAN_RIGHT'
  | 'PAN_UP'
  | 'PAN_DOWN'
  | 'ZOOM_IN'
  | 'ZOOM_OUT';

export type CameraPreset = 
  | 'ISOMETRIC'
  | 'OVERVIEW'
  | 'RUANG_RAPAT'
  | 'PEMIMPIN_REDAKSI'
  | 'SENTRY_SERVER'
  | 'STUDIO_FOTO'
  | 'WORKSTATIONS'
  | 'RECEPTION'
  | 'LOUNGE'
  | 'FOCUS_AGENT';

export interface CameraViewConfig {
  position: [number, number, number];
  target: [number, number, number];
  zoom?: number;
}

export interface WorkstationDef {
  id: string;
  name: string;
  agentId: AgentId;
  position: [number, number, number];
  rotation: number;
  type: 'triple_monitor' | 'dual_monitor' | 'studio' | 'server' | 'reception' | 'meeting' | 'executive';
}

