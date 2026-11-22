# NaiMiris AI

**AI-Powered Sri Lankan Nai Miris Disease Detection and Intelligent Farming
Advisory System**

A single monorepo for a responsible bilingual farming research platform.
**Phase 1 only is implemented:** a React/TypeScript foundation screen, a FastAPI
health endpoint, development tooling, initial tests, and research documentation.

No classifier, chatbot, agricultural recommendations, database, or deployed
service is available yet. Nai Miris-specific model performance has not been
established. See [current limitations](docs/LIMITATIONS.md).

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

Open <http://127.0.0.1:5173>. The setup screen checks the real backend via the
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
Vitest checks health contract handling, unavailable/retry states, routing, and
explicit capability limitations. Pytest checks health, OpenAPI, CORS,
environment settings, and safe error handling. See the actual executed results
in [Phase 1 verification](docs/PHASE_1_VERIFICATION.md).

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

**Next: Phase 2**, the design system, navigation, and source-attributed educational
pages. Do not proceed to it without a subsequent instruction.

## Research and privacy commitments

No simulated predictions, invented experiments, or unverified local accuracy
claims. Audit actual datasets and licenses before training; isolate original
photographs, plants, sessions, and augmented copies across splits. Keep datasets,
checkpoints, secrets, and private farmer data outside Git. Do not retain uploaded
images by default. Persistence needs consent, retention, and deletion controls.

The foundation's plant illustration is original inline SVG and uses no external
photography. Educational content needs verified sources before publication.
