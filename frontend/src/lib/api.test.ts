import { afterEach, describe, expect, it, vi } from 'vitest';
import { CHAT_UNAVAILABLE, getDiseases, getHealth, PREDICTION_UNAVAILABLE, predictImage, safeSourceUrl, sendChat } from './api';
import { MAX_UPLOAD_MB, validateImage } from './upload';

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

describe('future service contracts', () => {
  it.each([404, 501, 503])('reports unavailable prediction for status %s', async (status) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status })));
    await expect(predictImage(new File(['x'], 'plant.jpg', { type: 'image/jpeg' }))).rejects.toThrow(PREDICTION_UNAVAILABLE);
  });
  it('reports chat unavailability without inventing an answer', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 404 })));
    await expect(sendChat([{ role: 'user', content: 'නයි මිරිස්?' }])).rejects.toThrow(CHAT_UNAVAILABLE);
  });
  it('rejects malformed predictions and never treats a generic success as model output', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ condition: 'test fixture', score: 1.4 }))));
    await expect(predictImage(new File(['x'], 'plant.jpg'))).rejects.toThrow('invalid response');
  });
  it('rejects unsafe references in chatbot responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ answer: 'Test fixture', sources: [{ title: 'unsafe', url: 'javascript:alert(1)' }] }))));
    await expect(sendChat([])).rejects.toThrow('invalid response');
    expect(safeSourceUrl('https://example.org/reference')).toBe(true);
    expect(safeSourceUrl('data:text/html,test')).toBe(false);
  });
  it('validates returned disease information', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([{ id: 'missing-fields' }]))));
    await expect(getDiseases()).rejects.toThrow('invalid response');
  });
  it('accepts a genuine typed chat response and preserves source references', async () => {
    const payload = { answer: 'An explicit API test fixture.', sources: [{ title: 'Test source', url: 'https://example.org' }] };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(payload))));
    await expect(sendChat([{ role: 'user', content: 'test' }])).resolves.toEqual(payload);
  });
  it('handles network failures and malformed JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Offline')));
    await expect(getDiseases()).rejects.toThrow('Unable to reach');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('<html>wrong content</html>')));
    await expect(getDiseases()).rejects.toThrow('invalid response');
  });
  it('handles timeout and preserves explicit cancellation', async () => {
    vi.spyOn(AbortSignal, 'timeout').mockReturnValue(AbortSignal.abort(new DOMException('Timeout', 'TimeoutError')));
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new DOMException('Timeout', 'TimeoutError')));
    await expect(getDiseases()).rejects.toThrow('timed out');
    const cancellation = new DOMException('Cancelled', 'AbortError');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(cancellation));
    await expect(getDiseases(AbortSignal.abort())).rejects.toBe(cancellation);
  });
});
describe('image validation boundary', () => {
  it('rejects empty files and accepts supported formats at the exact limit', () => {
    expect(validateImage(new File([], 'empty.png', { type: 'image/png' }))).toContain('empty');
    for (const type of ['image/jpeg', 'image/png', 'image/webp']) {
      const file = new File(['x'], 'plant', { type });
      Object.defineProperty(file, 'size', { value: MAX_UPLOAD_MB * 1024 * 1024 });
      expect(validateImage(file)).toBeNull();
    }
  });
});
