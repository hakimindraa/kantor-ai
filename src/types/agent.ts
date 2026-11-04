export type AgentId = 'scout' | 'scribe' | 'pixel' | 'chronos' | 'hermes' | 'radar' | 'sentry' | 'receptionist' | 'chief';

export type AgentStatus = 'working' | 'idle' | 'active' | 'paused';

export interface AgentMetric {
  label: string;
  value: string | number;
  trend?: string;
  change?: string;
}

export interface AgentData {
  id: AgentId;
  name: string;
  role: string;
  title: string;
  department: string;
  workstation: string;
  color: string;
  accentColor: string;
  status: AgentStatus;
  currentActivity: string;
  assignedTask: string;
  lastActive: string;
  progress: number;
  description: string;
  specialization: string[];
  metrics: AgentMetric[];
  endpoint: string;
  // Dedicated Workstation PC Coordinates
  deskPosition: [number, number, number];
  deskRotation: number;
  // Breakroom / Lounge "Nyantai" Coordinates
  chillPosition: [number, number, number];
  chillRotation: number;
  chillActivity: string;
  position: [number, number, number];
  rotation: number;
}

export interface AgentActivityLog {
  id: string;
  timestamp: string;
  agentId: AgentId;
  agentName: string;
  agentColor: string;
  message: string;
  category: 'fetch' | 'editorial' | 'multimedia' | 'publishing' | 'distribution' | 'seo' | 'infrastructure';
  level: 'info' | 'success' | 'warning' | 'alert';
}
