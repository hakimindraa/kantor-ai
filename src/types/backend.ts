export type IntegrationStatus = 'connected' | 'simulated' | 'standby' | 'error';

export interface BackendModuleDef {
  id: string;
  name: string;
  type: 'api_route' | 'server_action' | 'lib_service' | 'cron_job' | 'database' | 'external_cdn';
  pathOrIdentifier: string;
  associatedAgent: string;
  status: IntegrationStatus;
  description: string;
  lastExecuted?: string;
  latencyMs?: number;
  environmentVar?: string;
  samplePayload?: Record<string, unknown>;
}

