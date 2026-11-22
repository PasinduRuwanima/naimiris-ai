export interface HealthResponse {
  status: 'ok';
  service: string;
  version: string;
}

export async function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const origin = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/$/, '');
  const response = await fetch(`${origin}/api/health`, {
    headers: { Accept: 'application/json' },
    signal: signal ?? null,
  });
  if (!response.ok) throw new Error(`Health check failed (${response.status}).`);
  const data: unknown = await response.json();
  if (!data || typeof data !== 'object' || !('status' in data) || data.status !== 'ok'
    || !('service' in data) || typeof data.service !== 'string'
    || !('version' in data) || typeof data.version !== 'string') {
    throw new Error('The backend returned an unexpected health response.');
  }
  return { status: data.status, service: data.service, version: data.version };
}
