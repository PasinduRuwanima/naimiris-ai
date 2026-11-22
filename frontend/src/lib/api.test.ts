import { afterEach, describe, expect, it, vi } from 'vitest';
import { getHealth } from './api';

afterEach(() => vi.unstubAllEnvs());

describe('health API client', () => {
  it('reads a typed successful health response', async () => {
    const payload = { status: 'ok', service: 'NaiMiris AI API', version: '0.1.0' };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(payload)));
    vi.stubGlobal('fetch', fetchMock);
    await expect(getHealth()).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith('/api/health', expect.objectContaining({ headers: { Accept: 'application/json' } }));
  });
  it('uses the configured API origin', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com/');
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(getHealth()).rejects.toThrow('503');
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.example.com/api/health');
  });
  it('rejects successful HTTP responses with an invalid contract', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: 'ok' }))));
    await expect(getHealth()).rejects.toThrow('unexpected health response');
  });
});
