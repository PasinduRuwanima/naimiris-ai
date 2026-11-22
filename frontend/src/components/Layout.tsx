import { useEffect, useRef, useState } from 'react';
import { Leaf, Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router';
import { Brand } from './ui';
import { references } from '../data/content';

export const navigation = [['/', 'Home'], ['/about-nai-miris', 'About Nai Miris'], ['/growing-guide', 'Growing Guide'], ['/disease-detector', 'Disease Detector'], ['/disease-library', 'Disease Library'], ['/chatbot', 'AI Chatbot'], ['/about-project', 'About Project']] as const;
export function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);
  return <header className="site-header"><div className="container header-inner">
    <Link to="/" aria-label="NaiMiris AI home"><Brand /></Link>
    <button ref={toggle} className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
    <nav id="primary-navigation" aria-label="Main navigation" className={open ? 'main-nav is-open' : 'main-nav'} onKeyDown={(event) => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } }}>
      {navigation.map(([to, title]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `${isActive ? 'active ' : ''}${to === '/chatbot' ? 'nav-chat' : ''}`}>{title}{to === '/chatbot' && <Leaf size={13} aria-hidden="true" />}</NavLink>)}
    </nav>
  </div></header>;
}
export function RouteEffects() {
  const { pathname, hash } = useLocation();
  const initial = useRef(true);
  useEffect(() => {
    const title = navigation.find(([path]) => path === pathname)?.[1] ?? 'Disease reference';
    document.title = `${title} · NaiMiris AI`;
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
    else if (!initial.current) { window.scrollTo({ top: 0, behavior: 'instant' }); document.getElementById('main')?.focus({ preventScroll: true }); }
    initial.current = false;
  }, [pathname, hash]);
  return null;
}
export function Footer() { return <footer className="site-footer"><div className="container"><div className="footer-grid">
  <div><Link to="/" aria-label="NaiMiris AI home"><Brand /></Link><p>A little knowledge.<br />A healthier growing future.</p><span className="footer-origin"><span /> Made for Sri Lankan growers</span></div>
  <div><h2>Explore</h2>{navigation.slice(1, 5).map(([to, title]) => <Link key={to} to={to}>{title}</Link>)}</div>
  <div><h2>Learn & connect</h2><Link to="/chatbot">AI Farming Assistant</Link><Link to="/about-project">About the research</Link><a href={references.umd.url} target="_blank" rel="noreferrer">Pepper growing resources ↗</a><a href={references.ipm.url} target="_blank" rel="noreferrer">Plant health resources ↗</a></div>
  <div><h2>Growing responsibly</h2><p>Educational guidance supports, and does not replace, local agricultural expertise. AI services await integration and local validation.</p><Link to="/about-project#sources">Sources & acknowledgments ↗</Link></div>
  </div><div className="footer-bottom"><span>© {new Date().getFullYear()} NaiMiris AI. A farming research project.</span><span>Rooted in knowledge. Growing with care.</span></div></div></footer>; }
