import { BackendModuleDef } from '@/types/backend';
import { BACKEND_MODULES } from '../mock/mockBackendModules';

/**
 * Newsroom Integration Adapter
 * Provides a standardized interface for 3D AI Agents to communicate with backend APIs,
 * Server Actions, and services with fallback to mock data when environment variables are not set.
 */
export class NewsroomAdapter {
  private static instance: NewsroomAdapter;

  public static getInstance(): NewsroomAdapter {
    if (!NewsroomAdapter.instance) {
      NewsroomAdapter.instance = new NewsroomAdapter();
    }
    return NewsroomAdapter.instance;
  }

  public getModules(): BackendModuleDef[] {
    return BACKEND_MODULES;
  }

  public async callEndpoint(moduleId: string, payload?: unknown) {
    const mod = BACKEND_MODULES.find((m) => m.id === moduleId);
    if (!mod) throw new Error(`Module ${moduleId} not found`);

    // In a real environment with backend credentials, dispatch fetch to process.env.API_BASE_URL
    const isRealBackendAvailable = Boolean(process.env.NEXT_PUBLIC_REAL_BACKEND_URL);

    if (isRealBackendAvailable) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_REAL_BACKEND_URL}${mod.pathOrIdentifier}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return await response.json();
      } catch (err: any) {
        console.warn(`[NewsroomAdapter] Real backend call failed, falling back to simulated:`, err);
      }
    }

    // Default simulated response
    return {
      status: 'simulated_success',
      endpoint: mod.pathOrIdentifier,
      agent: mod.associatedAgent,
      executionLatencyMs: mod.latencyMs || 45,
      timestamp: new Date().toISOString(),
      data: payload || mod.samplePayload || { success: true }
    };
  }
}

export const newsroomAdapter = NewsroomAdapter.getInstance();

