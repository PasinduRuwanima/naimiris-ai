import { useEffect, useState } from 'react';
import { ArrowUpRight, RefreshCw, Server } from 'lucide-react';
import { getHealth } from '../lib/api';
import type { HealthResponse } from '../lib/api';

type HealthState = { status: 'checking' } | { status: 'available'; data: HealthResponse } | { status: 'unavailable' };

export function HealthCheck() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<HealthState>({ status: 'checking' });

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let active = true;
    getHealth(controller.signal).then(
      (data) => { if (active) setState({ status: 'available', data }); },
      () => { if (active) setState({ status: 'unavailable' }); },
    ).finally(() => clearTimeout(timeout));
    return () => { active = false; controller.abort(); clearTimeout(timeout); };
  }, [attempt]);

  return (
    <section className="health-card" aria-labelledby="health-heading">
      <div className="flex items-center justify-between gap-4">
        <span className="icon-box"><Server size={21} aria-hidden="true" /></span>
        <span className={`status-pill ${state.status}`}>
          <span aria-hidden="true" className="status-dot" />
          {state.status === 'checking' ? 'Checking connection' : state.status === 'available' ? 'Backend connected' : 'Backend unavailable'}
        </span>
      </div>
      <h2 id="health-heading">A connection you can verify.</h2>
      <div role="status" aria-live="polite" className="health-message">
        {state.status === 'checking' && <p>Contacting the backend health endpoint…</p>}
        {state.status === 'available' && <p>{state.data.service} · v{state.data.version}. The HTTP service is running. Model and chatbot services are not implemented yet.</p>}
        {state.status === 'unavailable' && <p>We couldn’t reach the backend. Start the FastAPI service and retry. Disease analysis and chat are not available in this phase.</p>}
      </div>
      <div className="health-actions">
        <button className="button button-dark" disabled={state.status === 'checking'} onClick={() => { setState({ status: 'checking' }); setAttempt((value) => value + 1); }}>
          <RefreshCw size={16} aria-hidden="true" /> Check connection
        </button>
        <a className="text-link" href="https://github.com/PasinduRuwanima/naimiris-ai" target="_blank" rel="noreferrer">View repository <ArrowUpRight size={16} aria-hidden="true" /></a>
      </div>
      <p className="endpoint-label">GET /api/health <span>· HTTP liveness only</span></p>
    </section>
  );
}
