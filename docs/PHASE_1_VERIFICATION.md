# Phase 1 verification — 22 November 2026

Status: **Phase 1 complete.** Frontend and backend foundation verified locally.
Phase 2 has not been started.

## Scope

The supplied repository was empty. This phase created the monorepo foundation
only. No dataset audit, model training, prediction service, educational content
corpus, chatbot, database, or deployment was completed.

## Executed checks

| Check | Actual result |
| --- | --- |
| Python source compilation | Passed |
| Backend tests: `npm.cmd run test:backend` | 18 passed, 0 failed; one HTTPX deprecation warning |
| Backend dependencies: venv `python -m pip check` | No broken requirements found |
| Running `GET http://127.0.0.1:8000/api/health` | HTTP 200 with expected JSON |
| Frontend production build: `npm.cmd run build` | Passed strict TypeScript checking and Vite production build; rebuilt after the responsive CSS fix |
| Frontend tests: `npm.cmd run test:frontend` | 6 passed, 0 failed, across 2 files |
| npm installation audit | 0 known vulnerabilities reported for 135 audited packages |
| Installed frontend dependency graph | Direct dependencies resolved successfully; 3 leftover packages from the interrupted install removed with offline `npm prune` |
| Browser API proxy check | `/api/health` returned HTTP 200 and the expected health JSON from the running frontend origin |
| Responsive layout measurements | No horizontal overflow at viewport widths 320, 390, 900, and 1440 pixels after removing the body's minimum width |
| Keyboard and semantic checks | First Tab focused “Skip to content”; Enter focused `main`; one main landmark and one h1 |
| Editor diagnostics | No errors reported for frontend/backend |
| Git ignore checks | Confirmed local venv, .env, frontend local environment, dataset images, and checkpoint paths are ignored |

Health response:

```json
{"status":"ok","service":"NaiMiris AI API","version":"0.1.0"}
```

Backend tests cover health/OpenAPI, 404/405 contracts, CORS allowed/disallowed
origins and preflight, environment parsing, unsafe CORS configuration, request
validation without echoing submitted values, and generic unexpected-error
responses. The warning comes from the installed Starlette TestClient's use of
HTTPX; it does not fail tests. A future test-stack update should address it.

Frontend tests cover valid health contracts, configured API origins, rejection
of malformed responses, connected and unavailable states, successful retry,
planned-capability disclosures, and the fallback route. Total: **24 tests
passed, 0 failed**. No unit test failure was encountered. No full accessibility
audit, production load test, Python CVE scan, or ML validation is claimed.

Verified environment: Windows, Node 24.13.0, npm 11.6.2, Python 3.12.4,
React 19.3.1, TypeScript 7.0.2, Vite 8.3.8, Tailwind 4.3.5, Vitest 5.1.1,
FastAPI 0.165.0, and pytest 9.2.0. Exact dependencies are recorded in the
[npm lock](../package-lock.json) and
[Python dependency lock](../backend/requirements-dev.lock.txt).

The local frontend and backend were left running for review at
<http://127.0.0.1:5173> and <http://127.0.0.1:8000/api/health>. Use the documented
development commands again if those processes have since stopped. Nothing was
deployed to a hosting provider.

## Commands and tooling used

- `git ls-remote https://github.com/PasinduRuwanima/naimiris-ai.git`
- `git clone https://github.com/PasinduRuwanima/naimiris-ai.git .`
- `node --version`, `npm.cmd --version`; Python environment configuration
  selected the project venv (Python 3.12.4).
- `npm.cmd install --workspace @naimiris/frontend react react-dom react-router lucide-react`
- `npm.cmd install --save-dev --workspace @naimiris/frontend typescript@latest @types/node @types/react @types/react-dom vite @vitejs/plugin-react tailwindcss @tailwindcss/vite vitest jsdom @testing-library/react @testing-library/jest-dom`
- Project venv Python: `-m pip install -e "./backend[dev]"`,
  `-m pip check`, `-m pip freeze --exclude naimiris-api`, and
  `-m compileall -q backend/src backend/tests`.
- `npm.cmd run build`, `npm.cmd run test:frontend`, `npm.cmd run test:backend`,
  `npm.cmd run dev:frontend`, and `npm.cmd run dev:backend`.
- `npm.cmd prune --offline --ignore-scripts --no-audit --no-fund` and
  `npm.cmd ls --workspace @naimiris/frontend --depth=0` to remove interrupted-install
  leftovers and confirm the installed direct dependency graph.
- PowerShell `Invoke-WebRequest` against the live health endpoint.
- `git -c safe.directory=D:/Al/naimiris-ai status`, `ls-files`, and
  `check-ignore` for inspection. The per-command exception avoids changing
  global Git configuration in the sandbox's separate user account.

Network-bound Git/npm/pip operations initially failed under sandbox restrictions
and were retried with approved network access. The first approved pip attempt
timed out; a retry with a 120-second download timeout succeeded. The first npm
build-tool attempt hit stale registry metadata for source-map-js; a fresh
registry query confirmed compatible versions and installation was retried with
`--prefer-online --fetch-retries=2 --fetch-timeout=60000`.
That attempt reached package downloads but failed with an npm idle timeout and
a partial-install cleanup warning. A subsequent retry using the populated
cache, `--prefer-offline --maxsockets=3 --fetch-retries=3 --fetch-timeout=180000`,
succeeded. No dependency overrides or application-code workarounds were needed.

The VS Code task tool returned “No invocation context”; the documented npm CLI
scripts were used as the fallback.

## Outstanding work and exact next phase

Phase 2 is next: design system, navigation, and source-attributed educational
pages, with English/Sinhala content and appropriate botanical qualifications.
It has not been started. Later phases still require dataset/license inspection,
approved sources, real checkpoints, independent local evaluation, server-side
LLM configuration, and verified deployment. See [the plan](IMPLEMENTATION_PLAN.md).

## Files created

The following are source/configuration/documentation files. Dependency folders,
virtual environments, build outputs, and caches are ignored and are not source
deliverables. No commit or push was performed.

- [.editorconfig](../.editorconfig)
- [.env.example](../.env.example)
- [.gitignore](../.gitignore)
- [.nvmrc](../.nvmrc)
- [README.md](../README.md)
- [backend/pyproject.toml](../backend/pyproject.toml)
- [backend/requirements-dev.lock.txt](../backend/requirements-dev.lock.txt)
- [backend/src/naimiris_api/__init__.py](../backend/src/naimiris_api/__init__.py)
- [backend/src/naimiris_api/config.py](../backend/src/naimiris_api/config.py)
- [backend/src/naimiris_api/main.py](../backend/src/naimiris_api/main.py)
- [backend/src/naimiris_api/routes/__init__.py](../backend/src/naimiris_api/routes/__init__.py)
- [backend/src/naimiris_api/routes/health.py](../backend/src/naimiris_api/routes/health.py)
- [backend/src/naimiris_api/schemas.py](../backend/src/naimiris_api/schemas.py)
- [backend/tests/conftest.py](../backend/tests/conftest.py)
- [backend/tests/test_config.py](../backend/tests/test_config.py)
- [backend/tests/test_health.py](../backend/tests/test_health.py)
- [datasets/README.md](../datasets/README.md)
- [datasets/metadata/README.md](../datasets/metadata/README.md)
- [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
- [docs/CHATBOT_DESIGN.md](../docs/CHATBOT_DESIGN.md)
- [docs/DATASET_AUDIT.md](../docs/DATASET_AUDIT.md)
- [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)
- [docs/IMPLEMENTATION_PLAN.md](../docs/IMPLEMENTATION_PLAN.md)
- [docs/LIMITATIONS.md](../docs/LIMITATIONS.md)
- [docs/ML_METHODOLOGY.md](../docs/ML_METHODOLOGY.md)
- [docs/MODEL_EVALUATION.md](../docs/MODEL_EVALUATION.md)
- [docs/PHASE_1_VERIFICATION.md](../docs/PHASE_1_VERIFICATION.md)
- [frontend/.env.example](../frontend/.env.example)
- [frontend/index.html](../frontend/index.html)
- [frontend/package.json](../frontend/package.json)
- [frontend/src/App.test.tsx](../frontend/src/App.test.tsx)
- [frontend/src/App.tsx](../frontend/src/App.tsx)
- [frontend/src/components/HealthCheck.tsx](../frontend/src/components/HealthCheck.tsx)
- [frontend/src/lib/api.test.ts](../frontend/src/lib/api.test.ts)
- [frontend/src/lib/api.ts](../frontend/src/lib/api.ts)
- [frontend/src/main.tsx](../frontend/src/main.tsx)
- [frontend/src/styles.css](../frontend/src/styles.css)
- [frontend/src/test/setup.ts](../frontend/src/test/setup.ts)
- [frontend/tsconfig.json](../frontend/tsconfig.json)
- [frontend/vite.config.ts](../frontend/vite.config.ts)
- [knowledge_base/README.md](../knowledge_base/README.md)
- [ml/README.md](../ml/README.md)
- [ml/configs/README.md](../ml/configs/README.md)
- [ml/data/README.md](../ml/data/README.md)
- [ml/evaluation/README.md](../ml/evaluation/README.md)
- [ml/inference/README.md](../ml/inference/README.md)
- [ml/models/README.md](../ml/models/README.md)
- [ml/notebooks/README.md](../ml/notebooks/README.md)
- [ml/training/README.md](../ml/training/README.md)
- [package-lock.json](../package-lock.json)
- [package.json](../package.json)
- [scripts/backend.mjs](../scripts/backend.mjs)
- [tests/README.md](../tests/README.md)
