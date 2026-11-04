import { AgentId } from './agent';

export type MovementMode = 'AUTOMATIC' | 'MANUAL';

export type CameraInteractionMode = 'ORBIT' | 'PAN';

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

