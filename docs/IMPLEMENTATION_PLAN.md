# Implementation plan

## Inspection and scope — 22 November 2026

The supplied GitHub repository was inspected with `git ls-remote` and cloned into
the empty workspace. Git reported an empty repository; no existing application,
configuration, or user files were present. Node 24.13.0, npm 11.6.2, and Python
3.12.4 are available locally. The supported backend minimum is Python 3.11.

The authorized implementation is **Phase 1 only**. This phase establishes a
running foundation; it does not implement the educational product, disease
classification, chatbot, database persistence, or deployment.

## Architecture and integration boundaries

- `frontend/`: React, TypeScript, Vite, Tailwind CSS, React Router, and Lucide.
  Vite proxies `/api` to FastAPI in development. A public `VITE_API_BASE_URL`
  controls the API origin for a separately hosted frontend.
- `backend/`: installable FastAPI package, environment settings, typed health
  response, explicit CORS allowlist, consistent API error envelope, and pytest.
- `ml/`: documented workspaces for configuration, data tooling, architectures,
  training, evaluation, inference, and future Colab notebooks. No heavy ML
  dependencies or fabricated checkpoints are installed during setup.
- `datasets/metadata/`: future audit manifests; image datasets remain external.
- `knowledge_base/`: future approved documents and source metadata.
- `tests/`: cross-service tests when integrations exist. Component and API tests
  remain beside their respective projects.
- `docs/`: architecture, research safeguards, audit, methodology, and operations.

TanStack Query, React Hook Form/Zod, SQLAlchemy, Supabase, LLM SDKs, and ML
libraries will be added only when their associated functionality is implemented.
This avoids unused dependencies and unneeded credentials in Phase 1.

## Prioritized checklist

### Phase 1 — repository and foundation

- [x] Inspect the local folder and linked repository before writing code.
- [x] Record architecture, assumptions, risks, and phase boundaries.
- [x] Initialize strict TypeScript frontend and accessible foundation screen.
- [x] Initialize FastAPI service with settings, health endpoint, and API tests.
- [x] Create ML, dataset, knowledge, and integration-test workspaces.
- [x] Add environment examples, ignore rules, and development scripts.
- [x] Install compatible dependencies and record reproducible lock files.
- [x] Run frontend component tests and production build.
- [x] Run backend tests and probe the running health endpoint.
- [x] Record actual results and remaining limitations.

### Later phases — require a subsequent instruction

2. Design system, navigation, bilingual educational pages, and reviewed sources.
3. Core APIs, secure image validation, disease schemas, and service contracts.
4. Inspect dataset documentation and actual files; audit licenses, labels,
   duplicates, provenance, and splitting before any training.
5. Train and compare Custom CNN, MobileNetV3, EfficientNet-B0, and ResNet50 on
   identical splits; report only measured results.
6. Integrate a real checkpoint, uncertainty handling, and explicit unavailable
   responses when a validated model artifact cannot be loaded.
7. Add bilingual source-grounded RAG and configured server-side LLM access.
8. Complete integration/security/accessibility checks and prepare verified
   Vercel, Render, and optional Supabase deployment.

## Assumptions and missing inputs

- No approved agricultural corpus, licensed image collection, model artifact,
  experiment results, LLM credentials, or Supabase credentials were supplied.
- The repository is the intended monorepo and its empty default branch is the
  starting point. No commits or remote pushes are required for this phase.
- Basic educational access will not require an account. Uploaded images must
  not be retained by default. Chat persistence will require explicit controls.
- English and Sinhala Unicode must be preserved throughout future content and
  API work. This setup does not claim a complete translated interface.

## Risks and gates

- Candidate public datasets may have incompatible licenses, labels, domains,
  duplicates, and augmented images. Availability alone is not approval to use.
- Public chilli images do not establish performance on Sri Lankan Nai Miris.
  Local independent evaluation remains a release gate for that claim.
- Agricultural content needs verified source attribution and expert review;
  pesticide doses and fertilizer rates must not be improvised.
- Browser environment variables are public. All LLM/database private keys and
  model storage credentials belong exclusively on the backend.
- Dataset and model sizes can exceed Git and hosting resource limits. Use
  external artifact storage and document checksums and resource needs later.
- Health indicates that the HTTP service is running, not ML/RAG readiness.
