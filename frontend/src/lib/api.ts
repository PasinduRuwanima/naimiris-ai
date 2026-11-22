export interface HealthResponse { status: 'ok'; service: string; version: string }
export interface Source { title: string; url: string }
export interface DiseaseInfo {
  id: string; name: string; category: string; description: string;
  symptoms: string[]; causes: string[]; management: string[]; prevention: string[]; sources: Source[];
}
export interface PredictionResponse {
  condition: string; score: number; model_version: string; disease: DiseaseInfo; warning: string;
}
export interface ChatTurn { role: 'user' | 'assistant'; content: string }
export interface ChatResponse { answer: string; sources: Source[] }
export const PREDICTION_UNAVAILABLE = 'AI disease detection is currently unavailable. The trained model has not yet been connected.';
export const CHAT_UNAVAILABLE = 'The AI farming assistant is currently unavailable. The chatbot service has not yet been connected.';
export class ApiError extends Error {
  constructor(message: string, public readonly kind: 'unavailable' | 'network' | 'timeout' | 'invalid' | 'server') { super(message); this.name = 'ApiError'; }
}
const object = (data: unknown): data is Record<string, unknown> => !!data && typeof data === 'object' && !Array.isArray(data);
const strings = (data: unknown): data is string[] => Array.isArray(data) && data.every((item) => typeof item === 'string');
export function safeSourceUrl(url: string): boolean {
  try { return ['http:', 'https:'].includes(new URL(url).protocol); } catch { return false; }
}
function sources(data: unknown): data is Source[] {
  return Array.isArray(data) && data.every((item: unknown) => object(item) && typeof item.title === 'string' && typeof item.url === 'string' && safeSourceUrl(item.url));
}
function disease(data: unknown): data is DiseaseInfo {
  return object(data) && ['id', 'name', 'category', 'description'].every((key) => typeof data[key] === 'string')
    && ['symptoms', 'causes', 'management', 'prevention'].every((key) => strings(data[key])) && sources(data.sources);
}
async function request(path: string, options: RequestInit = {}, unavailable = 'This service is not connected yet.'): Promise<unknown> {
  const origin = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '');
  const timeout = AbortSignal.timeout(15000);
  try {
    const response = await fetch(`${origin}${path}`, {
      ...options, headers: { Accept: 'application/json', ...options.headers },
      signal: options.signal ? AbortSignal.any([options.signal, timeout]) : timeout,
    });
    if ([404, 501, 503].includes(response.status)) throw new ApiError(unavailable, 'unavailable');
    if (!response.ok) throw new ApiError(`The request failed (${response.status}). Please try again.`, 'server');
    try { return await response.json(); } catch { throw new ApiError('The service returned an invalid response.', 'invalid'); }
  } catch (error) {
    if (options.signal?.aborted) throw error;
    if (timeout.aborted) throw new ApiError('The request timed out. Please try again.', 'timeout');
    if (error instanceof ApiError) throw error;
    throw new ApiError('Unable to reach the service. Check your connection and try again.', 'network');
  }
}
export async function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const data = await request('/api/health', { signal: signal ?? null }, 'Health check failed (503 or unavailable).');
  if (!object(data) || data.status !== 'ok' || typeof data.service !== 'string' || typeof data.version !== 'string') throw new ApiError('The backend returned an unexpected health response.', 'invalid');
  return { status: 'ok', service: data.service, version: data.version };
}
export async function getDiseases(signal?: AbortSignal): Promise<DiseaseInfo[]> {
  const data = await request('/api/diseases', { signal: signal ?? null });
  if (!Array.isArray(data) || !data.every(disease)) throw new ApiError('The disease service returned an invalid response.', 'invalid');
  return data;
}
export async function predictImage(file: File, signal?: AbortSignal): Promise<PredictionResponse> {
  const body = new FormData(); body.append('image', file);
  const data = await request('/api/predict', { method: 'POST', body, signal: signal ?? null }, PREDICTION_UNAVAILABLE);
  if (!object(data) || typeof data.condition !== 'string' || typeof data.score !== 'number' || !Number.isFinite(data.score) || data.score < 0 || data.score > 1 || typeof data.model_version !== 'string' || !disease(data.disease) || typeof data.warning !== 'string') throw new ApiError('The prediction service returned an invalid response. No result is shown.', 'invalid');
  return data as unknown as PredictionResponse;
}
export async function sendChat(messages: ChatTurn[], signal?: AbortSignal): Promise<ChatResponse> {
  const data = await request('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages }), signal: signal ?? null }, CHAT_UNAVAILABLE);
  if (!object(data) || typeof data.answer !== 'string' || !data.answer.trim() || !sources(data.sources)) throw new ApiError('The chatbot returned an invalid response. Please try again.', 'invalid');
  return { answer: data.answer, sources: data.sources };
}
