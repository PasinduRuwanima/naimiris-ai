# Current limitations

- Phase 2 delivers the frontend experience, not a functioning AI advisory system.
- Only `GET /api/health` exists on the backend. Predictions, disease APIs and chat
  have typed frontend proposals but no backend implementations. HTTP liveness
  does not establish AI readiness.
- Image upload validation/preview and chat input work. Requests to unavailable
  services show errors; no predictions, model scores or AI answers are fabricated.
- Upload size defaults to a provisional 5 MB, configurable via `VITE_MAX_UPLOAD_MB`.
  Server-side byte limits, signature validation, decoded image limits, rate limits
  and privacy enforcement are Phase 3 work. Frontend MIME checks are not security.
- Sources were consulted for general pepper education and botanical context.
  Local agricultural expert review, cultivar identity, recommended inputs and
  complete Sinhala translations remain pending. No chemical doses or precise
  local fertilizer/watering/spacing/harvest prescriptions are published.
- The stock photograph is illustrative general chilli imagery, not verified
  Sri Lankan Nai Miris. Library images are labeled illustrations, not clinical
  examples. See [source record](PHASE_2_SOURCES.md).
- No dataset files have been audited or used. No training, model comparison,
  checkpoint or local performance claim exists. Candidate landing-page checks
  are not dataset inspection or license approval.
- No LLM, retrieval corpus, database, authentication or persistent user storage
  is configured. Images are sent only on Analyze, messages only on Send. Local
  previews and conversations are temporary in-memory state. A configured future
  backend's retention policies must be verified separately.
- Responsive behavior, keyboard menu behavior and component flows were checked;
  a full screen-reader, assistive-device and production security audit is pending.
- There is no existing lint configuration or lint script. Strict TypeScript,
  tests, a production build and editor diagnostics are the current code checks.
- Production deployment is outside this phase. BrowserRouter hosting needs an
  SPA fallback; same-origin `/api` routing needs a production reverse proxy or
  a configured public API base URL.
