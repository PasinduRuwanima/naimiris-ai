import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Info, LoaderCircle, Sprout } from 'lucide-react';
import { Link } from 'react-router';
import { safeSourceUrl } from '../lib/api';
import type { Source } from '../lib/api';

export function Brand() { return <span className="brand"><span className="brand-icon"><Sprout size={24} aria-hidden="true" /></span><span>NaiMiris<span className="brand-ai"> AI</span><small>ROOTED IN SRI LANKA</small></span></span>; }
export function ButtonLink({ to, children, secondary = false }: { to: string; children: ReactNode; secondary?: boolean }) { return <Link className={`button ${secondary ? 'button-light' : 'button-dark'}`} to={to}>{children}<ArrowRight size={16} aria-hidden="true" /></Link>; }
export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) { return <header className="page-header"><p className="eyebrow"><span />{eyebrow}</p><h1>{title}</h1><p className="page-intro">{children}</p></header>; }
export function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) { return <div className="section-heading"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{children && <p>{children}</p>}</div>; }
export function DisclaimerBanner({ children }: { children?: ReactNode }) { return <aside className="disclaimer"><Info size={19} aria-hidden="true" /><p>{children ?? 'Educational information, not a diagnosis. Local Nai Miris validation is pending. For plant health decisions, consult a qualified agricultural adviser.'}</p></aside>; }
export function SourceReferences({ sources }: { sources: Source[] }) { return <ul className="source-list">{sources.filter((source) => safeSourceUrl(source.url)).map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<ArrowUpRight size={14} aria-hidden="true" /></a></li>)}</ul>; }
export function LoadingState({ children }: { children: ReactNode }) { return <div className="loading-state" role="status"><LoaderCircle className="spin" size={20} aria-hidden="true" />{children}</div>; }
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) { return <div className="error-state" role="alert"><p>{message}</p>{onRetry && <button className="text-button" onClick={onRetry}>Try again <ArrowRight size={14} aria-hidden="true" /></button>}</div>; }
export function EmptyState({ title, children }: { title: string; children: ReactNode }) { return <div className="empty-state"><Sprout size={32} aria-hidden="true" /><h2>{title}</h2><p>{children}</p></div>; }
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Frontend render failed', error, info.componentStack); }
  render() { return this.state.failed ? <main className="container page"><h1>Let’s get you growing again.</h1><p>Something went wrong while opening this page.</p><button className="button button-dark" onClick={() => location.assign('/')}>Return home</button></main> : this.props.children; }
}
