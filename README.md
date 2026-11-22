# NaiMiris AI

**AI-Powered Sri Lankan Nai Miris Disease Detection and Intelligent Farming
Advisory System**

A single monorepo for a responsible bilingual farming research platform.
**Phase 2 frontend is implemented:** a responsive React/TypeScript application
with seven product pages, a growing guide, searchable disease references,
image-upload and chat interfaces, typed API clients, and frontend tests.
The existing FastAPI health endpoint and Phase 1 tooling are preserved.

No classifier, AI chatbot service, database, or deployed service is available
yet. General pepper education is source-attributed; local agronomic review and
Nai Miris-specific model validation remain pending. See
[current limitations](docs/LIMITATIONS.md).

## Requirements

- Node.js 24 LTS and npm 11.
- Python 3.11+ with `venv` and pip (locally verified on Python 3.12.4).
- Network access for initial dependency installation.

Run all commands below from the repository root.

## Setup

```sh
npm ci
python -m venv .venv
```

On Windows PowerShell:

```powershell
.\.venv\Scripts\python.exe -m pip install -r backend/requirements-dev.lock.txt -e ./backend
Copy-Item .env.example .env
```

On macOS/Linux:

```sh
.venv/bin/python -m pip install -r backend/requirements-dev.lock.txt -e ./backend
cp .env.example .env
```

The Python lock records the tested Phase 1 dependency set on Windows/Python
3.12; other platforms and Python 3.11 need their own verification. To deliberately
resolve an updated set, install `-e "./backend[dev]"`, run checks, and regenerate
the lock with `python -m pip freeze --exclude naimiris-api` using the venv Python.
The frontend uses the root npm workspace lock.

If the local PowerShell policy blocks `npm`, use `npm.cmd` instead.

## Development

In separate terminals:

```sh
npm run dev:backend
npm run dev:frontend
```

Open <http://127.0.0.1:5173>. The About Project page checks the real backend via the
Vite `/api` proxy. API health is <http://127.0.0.1:8000/api/health>; interactive
OpenAPI documentation is <http://127.0.0.1:8000/docs>.

```json
{"status":"ok","service":"NaiMiris AI API","version":"0.1.0"}
```

This response indicates HTTP liveness only. It does not imply model readiness.
Only `GET /api/health` is implemented; other product APIs are future work.

The root [environment example](.env.example) configures the backend. The optional
[frontend example](frontend/.env.example) configures a public API origin; copy it
to `frontend/.env.local` when bypassing the development proxy. Never put private
keys in `VITE_*` variables.

## Checks

```sh
npm run build
npm run test:frontend
npm run test:backend
# Or run both test suites:
npm test
```

The frontend build runs strict TypeScript checks and Vite production compilation.
Run `npm run typecheck --workspace @naimiris/frontend` for type-checking alone.
Vitest checks navigation, upload validation/preview/removal/cancellation, chat,
Unicode input, library filtering, health retry and typed API error handling.
There is no configured lint command. Pytest checks health, OpenAPI, CORS,
environment settings, and safe error handling. See the actual executed results
in [Phase 1 verification](docs/PHASE_1_VERIFICATION.md) and
[Phase 2 verification](docs/PHASE_2_VERIFICATION.md).

With Vite running, `node scripts/check-frontend-browser.mjs` runs dependency-free
headless Edge smoke checks at 360, 390, 768 and 1440 px. Set `BROWSER_PATH` for an
installed Chromium browser on another platform. This script uses a temporary
browser profile and does not need browser automation npm dependencies.

## Frontend routes

| Route | Experience |
| --- | --- |
| `/` | Landing page, feature previews and research limitations |
| `/about-nai-miris` | Local context, botanical caveats and references |
| `/growing-guide` | Fourteen stages with section navigation |
| `/disease-detector` | Validated file selection, preview, analysis and unavailable state |
| `/disease-library` | Searchable, filterable educational references |
| `/disease-library/:id` | Symptoms, possible causes, management and sources |
| `/chatbot` | English/Sinhala input, suggested questions, cancellation and retry |
| `/about-project` | Research scope, candidate datasets, architecture and live API health |

The frontend works without FastAPI for learning and navigation. Analyze and Send
call the proposed APIs and report their real errors; they never generate mock
results. See [API handoff](docs/FRONTEND_API_CONTRACTS.md). The upload limit is a
provisional 5 MB (`VITE_MAX_UPLOAD_MB`), to be agreed with backend enforcement in
Phase 3. All `VITE_*` variables are public, never secret storage.

Production static hosting needs an SPA fallback for deep links and either
same-origin `/api` routing or a configured backend origin.

## Structure and plan

| Path | Responsibility |
| --- | --- |
| [frontend/](frontend/) | React, TypeScript, Vite, Tailwind, router, UI tests |
| [backend/](backend/) | FastAPI package, settings, health route, API tests |
| [ml/](ml/README.md) | Future reproducible CV pipeline workspace |
| [datasets/](datasets/README.md) | Dataset documentation and metadata only |
| [knowledge_base/](knowledge_base/README.md) | Future approved-source metadata |
| [tests/](tests/README.md) | Future cross-service integration tests |
| [docs/](docs/) | Plan, architecture, research protocols, limitations |
| [scripts/](scripts/) | Cross-platform development command launcher |

Read the [implementation checklist](docs/IMPLEMENTATION_PLAN.md),
[architecture](docs/ARCHITECTURE.md), [dataset audit](docs/DATASET_AUDIT.md),
[ML methodology](docs/ML_METHODOLOGY.md), [evaluation status](docs/MODEL_EVALUATION.md),
[chatbot design](docs/CHATBOT_DESIGN.md), and [deployment notes](docs/DEPLOYMENT.md).

**Next: Phase 3**, backend product API design and secure validation. Phase 2 stops
at the frontend; further phases require a subsequent instruction.

## Research and privacy commitments

No simulated predictions, invented experiments, or unverified local accuracy
claims. Audit actual datasets and licenses before training; isolate original
photographs, plants, sessions, and augmented copies across splits. Keep datasets,
checkpoints, secrets, and private farmer data outside Git. Do not retain uploaded
images by default. Persistence needs consent, retention, and deletion controls.

The frontend uses a credited Pexels chilli photograph, explicitly marked as
general imagery rather than verified local Nai Miris. Educational summaries
link to botanical and extension references. See the
[source and photography record](docs/PHASE_2_SOURCES.md). Local expert review is
still needed before variety-specific agronomic recommendations.
