# Development and future deployment

Nothing has been deployed. Vercel, Render, and Supabase integration are Phase 8.

## Local setup

Use Node 24 LTS with npm and Python 3.11+ (verified locally on Python 3.12.4).
Follow [the root setup commands](../README.md). The root `.env` is read by the
backend only when commands run from the repository root. Vite reads
`frontend/.env.local`; use the separate frontend example.

The default frontend URL is `http://localhost:5173`; backend is
`http://localhost:8000`. Vite proxies `/api` to the backend locally. For a
separate backend origin set `VITE_API_BASE_URL` to its HTTPS origin, without
`/api`. This value is public and must never contain credentials.

`NAIMIRIS_CORS_ORIGINS` is a JSON array of allowed browser origins. Defaults
allow only the local frontend on localhost and 127.0.0.1, port 5173. Add an exact
production origin in deployment; avoid `*`. Credentials are disabled.

## Intended production commands — unverified on hosting

| Service | Configuration |
| --- | --- |
| Vercel frontend | Repository root; install `npm ci`; build `npm run build`; output `frontend/dist`; configure SPA rewrites when additional routes ship |
| Render backend | From repository root: `pip install ./backend`; start `uvicorn naimiris_api.main:app --host 0.0.0.0 --port $PORT`; health path `/api/health` |
| Supabase | Not required for Phase 1; future migrations and server-side secrets must be reviewed before persistence |

Phase 8 must add hosting configurations, verify HTTPS endpoints and CORS, and
record the deployed revision. Real model serving will additionally need an
external artifact URI/checksum, private access credentials if applicable,
documented CPU/RAM needs, startup timeouts, and explicit unavailable behavior.
No checkpoint location or resource measurements are currently available.

Troubleshooting: if the UI reports the backend unavailable, start the backend
and check `/api/health`. Check exact CORS origins when bypassing the Vite proxy.
Use `.venv` Python to avoid global dependency conflicts. Network restrictions
may require approval to download packages. Never commit `.env` files or keys.
