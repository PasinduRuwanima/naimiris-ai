# Frontend API handoff

Only the health endpoint is implemented in FastAPI. The remaining contracts
below are **frontend proposals for Phase 3**, not claims about current APIs.
No backend or ML code was changed in Phase 2.

The frontend uses the public `VITE_API_BASE_URL` origin (without `/api`); an empty
value uses same-origin requests and the development Vite proxy. All calls accept
an AbortSignal, time out after 15 seconds, and validate JSON at runtime. The
existing health component retains its shorter 8-second connection timeout.

| Method and path | Status | Frontend contract |
| --- | --- | --- |
| GET `/api/health` | Existing | `{status:"ok",service:string,version:string}` |
| GET `/api/diseases` | Proposed | `DiseaseInfo[]`; prepared client, educational pages use attributed local content |
| POST `/api/predict` | Proposed | multipart field `image`; returns `PredictionResponse` |
| POST `/api/chat` | Proposed | JSON `{messages:[{role:"user"|"assistant",content:string}]}`; returns `ChatResponse` |

```ts
interface Source { title: string; url: string } // absolute HTTP(S) only
interface DiseaseInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  symptoms: string[];
  causes: string[];
  management: string[];
  prevention: string[];
  sources: Source[];
}
interface PredictionResponse {
  condition: string;
  score: number; // finite 0..1; model output, not calibrated certainty
  model_version: string;
  disease: DiseaseInfo;
  warning: string;
}
interface ChatResponse { answer: string; sources: Source[] }
```

404, 501 and 503 responses show the service-specific unavailable message. Other
HTTP failures, timeouts, network errors, malformed JSON and schema failures have
separate safe messages. Server error bodies are not rendered. Reference URLs must
use HTTP(S), and message/answer text renders as plain React text, not raw HTML.
Explicit cancellations and stale requests do not display late results.

The detector supports JPEG, PNG and WebP with a configurable frontend byte limit
(`VITE_MAX_UPLOAD_MB`, default 5). There is no backend upload limit to align yet.
Phase 3 must agree the limit and implement server-side signature/decode/size
checks, safeguards, privacy, and the actual upload contract before activation.
Object URLs are revoked on replace, remove and unmount. Selecting a file does
not send it. The user explicitly chooses Analyze.

Chat suggestions fill the composer and do not automatically send. Library links
prefill `?question=...`. Conversation history exists only in memory. Send posts
the visible history, with a 2,000-character limit per new question. Retry reuses
the same history without inserting duplicate user turns. New conversation and
navigation abort in-flight work. No keys or private credentials use `VITE_*`.

Phase 3 should reconcile these proposals with approved backend schemas, add
end-to-end successful inference/chat tests, and derive capability status from
real model/retrieval readiness. Current status notices correctly describe this
repository's disconnected services.
