# Phase 2 delivery and verification

Implemented on `dev`, 22 November 2026. Phase 2 stops at the frontend. Backend
architecture and ML/training files were not modified, and Phase 3 was not started.

## Delivered behavior

- Responsive forest-green/warm-neutral design, licensed local photograph,
  sticky navigation, active routes, keyboard/mobile menu, skip link, focus
  handling, reduced motion and a reusable footer.
- Home with feature highlights, three-step workflow, plant/guide/chat previews,
  research limitations and calls to action.
- About Nai Miris with local names, botanical caution, cultivation context,
  culinary uses and linked sources. Local names are not universal taxonomic IDs.
- Fourteen-stage growing guide with section navigation and source references.
  Exact local fertilizer, watering, spacing and harvesting prescriptions remain
  explicitly subject to review.
- Six searchable/filterable disease, pest, symptom and healthy-observation
  topics, with detail views, management considerations and attribution.
- Detector with drag/drop and keyboard browsing, configurable MIME/byte checks,
  preview/replacement/removal, corrupt-image handling, real request status,
  cancellation, prepared result components and an honest unavailable message.
- Unicode chat composer, English/Sinhala suggestions, visible user turns,
  loading/cancellation, retry without duplicates, sources-ready assistant turns,
  library question prefills, and a new-conversation reset.
- About Project with objectives, system stack, architecture, planned methodology,
  candidate datasets, limitations, credits and the preserved live health check.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home |
| `/about-nai-miris` | Plant and local context |
| `/growing-guide` | Cultivation learning checklist |
| `/disease-detector` | Upload and analysis interface |
| `/disease-library` | Search and category filters |
| `/disease-library/:id` | Source-attributed reference details |
| `/chatbot` | Bilingual question composer and conversation |
| `/about-project` | Research, datasets, sources and health |
| Other paths | 404 with a working return-home link |

## Files created or modified

Created:

- [Layout.tsx](../frontend/src/components/Layout.tsx): navbar, route effects, footer.
- [ui.tsx](../frontend/src/components/ui.tsx): brand, button links, page/section
  headings, disclaimers, sources, loading/error/empty states, error boundary.
- [ImageUploader.tsx](../frontend/src/components/ImageUploader.tsx).
- [Home.tsx](../frontend/src/pages/Home.tsx).
- [Learn.tsx](../frontend/src/pages/Learn.tsx): About, guide, library, disease cards
  and shared disease details.
- [Detector.tsx](../frontend/src/pages/Detector.tsx): detector and prediction result.
- [Chatbot.tsx](../frontend/src/pages/Chatbot.tsx): chat page, message and input.
- [AboutProject.tsx](../frontend/src/pages/AboutProject.tsx).
- [content.ts](../frontend/src/data/content.ts): references, guide, educational
  library and candidate dataset links.
- [upload.ts](../frontend/src/lib/upload.ts): configurable validation.
- [Chilli photograph](../frontend/public/images/chilli-plant.jpg).
- [Browser verification script](../scripts/check-frontend-browser.mjs).
- [Checklist](PHASE_2_CHECKLIST.md), [API handoff](FRONTEND_API_CONTRACTS.md),
  [source record](PHASE_2_SOURCES.md), and this report.

Modified:

- [App.tsx](../frontend/src/App.tsx), [styles.css](../frontend/src/styles.css),
  [HealthCheck.tsx](../frontend/src/components/HealthCheck.tsx).
- [API client](../frontend/src/lib/api.ts), [app tests](../frontend/src/App.test.tsx),
  [API tests](../frontend/src/lib/api.test.ts), [test setup](../frontend/src/test/setup.ts).
- [Frontend package](../frontend/package.json), [environment example](../frontend/.env.example),
  [HTML metadata](../frontend/index.html).
- [README](../README.md), [architecture](ARCHITECTURE.md),
  [implementation plan](IMPLEMENTATION_PLAN.md), [limitations](LIMITATIONS.md).

No frontend dependencies were added or upgraded. The root lock file and backend
and ML source files remain unchanged.

## API status

`GET /api/health` remains real and implemented. Typed proposals for
`GET /api/diseases`, `POST /api/predict` and `POST /api/chat` are prepared, with
runtime response checks, timeout, cancellation and safe reference URLs. The
detector and chat issue real requests and show the resulting errors; neither
generates synthetic output. Educational pages use attributed local content.
See [contracts and privacy boundaries](FRONTEND_API_CONTRACTS.md).

## Actual verification results

| Check | Result |
| --- | --- |
| `npm run test:frontend` | 29 tests passed in 2 files |
| `npm run typecheck --workspace @naimiris/frontend` | Passed |
| `npm run build` | Passed strict TypeScript + Vite production build |
| `npm run test:backend` | 18 passed; one existing FastAPI/Starlette test-client deprecation warning |
| `node scripts/check-frontend-browser.mjs` | 32 route/viewport checks passed, plus actual mobile navigation flow |
| Editor diagnostics | No frontend errors reported |
| Lint | Not run: this repository has no lint script/configuration |

Component/API tests cover rendering, route navigation and fallback, menu
open/Escape/focus/close, the 14 guide stages, health failure/retry, file type and
size boundaries, preview/replace/remove and object URL cleanup, drag/drop,
unreadable files, cancellation, unavailable predictions, Sinhala chat input,
empty-submit prevention, retries, query prefills, library filters/search/details,
unavailable HTTP statuses, malformed JSON/schema, unsafe references, network
failure, timeout and explicit abort.

Installed headless Edge checked all seven main routes and a library detail at
360, 390, 768 and 1440 px. Every page had one h1 and no horizontal overflow. The
photograph loaded. A real mobile menu opened, navigated and closed. Desktop and
mobile screenshots were visually inspected and removed after review. The shared
browser also rendered the app; its forced viewport limited resizing, so Edge
provided the reliable multi-viewport check. This is not a full accessibility or
cross-browser certification.

## Local run commands

From the repository root (PowerShell may require `npm.cmd`):

```sh
npm ci
npm run dev:frontend
```

Open <http://127.0.0.1:5173>. Start `npm run dev:backend` separately to enable the
existing health check; educational pages and navigation work without it.
The Vite preview was started during verification. No services were deployed.

## Remaining limitations and Phase 3 readiness

The frontend is ready for API contract review and secure backend integration.
It is not ready for real AI diagnosis or advisory deployment. Agree upload
limits and schemas, implement backend validation and privacy safeguards, audit
datasets/licenses, and validate independently on local Nai Miris before making
performance claims. There is no trained checkpoint, approved RAG corpus or LLM.
Full Sinhala localization and local expert content review are still pending.

Suggested commit message:

```text
feat(frontend): deliver Phase 2 NaiMiris learning and AI-ready experience
```

Changes were uncommitted at the end of Phase 2 implementation. Subsequent Git
publication is a separate user-authorized step. Do not begin Phase 3 without a
new instruction.
