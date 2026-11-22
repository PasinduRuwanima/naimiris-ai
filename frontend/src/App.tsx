import { ArrowRight, FlaskConical, Leaf, MessageCircle, ScanLine, Sprout } from 'lucide-react';
import { Link, Route, Routes } from 'react-router';
import { HealthCheck } from './components/HealthCheck';

const plannedFeatures = [
  { icon: Sprout, title: 'Learn to grow', text: 'Source-attributed guidance for Sri Lankan growers.', phase: 'Phase 2' },
  { icon: ScanLine, title: 'Understand plant health', text: 'Image analysis with a real model and clear uncertainty.', phase: 'Phases 4–6' },
  { icon: MessageCircle, title: 'Ask in your language', text: 'English and Sinhala answers grounded in reviewed sources.', phase: 'Phase 7' },
];

function Foundation() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span /> ROOTED IN SRI LANKA</p>
          <h1 id="hero-title">Better knowledge.<br /><span>Healthier harvests.</span></h1>
          <p className="hero-description">Building a thoughtful companion for Nai Miris growers — bringing cultivation knowledge, plant health research, and intelligent advice together.</p>
          <a className="button button-dark" href="#foundation">Explore the foundation <ArrowRight size={17} aria-hidden="true" /></a>
          <p className="sinhala" lang="si">නයි මිරිස් වගාවට දැනුම සහ තාක්ෂණය</p>
        </div>
        <div className="plant-art" role="img" aria-label="Stylized green chilli plant illustration">
          <span className="art-orbit orbit-one" /><span className="art-orbit orbit-two" />
          <svg viewBox="0 0 400 400" aria-hidden="true">
            <path d="M204 350C181 285 220 202 191 68M201 268C157 237 129 201 106 153M203 223C248 194 265 155 284 109" fill="none" stroke="#315a33" strokeWidth="7" strokeLinecap="round" />
            <path d="M195 164C133 161 125 101 142 75C184 84 207 118 195 164Z" fill="#61874c" />
            <path d="M210 230C216 170 261 145 292 153C281 205 249 231 210 230Z" fill="#315e37" />
            <path d="M166 242C117 254 76 229 65 199C112 180 155 199 166 242Z" fill="#80a15b" />
            <path d="M195 103C216 72 241 65 261 71C249 100 226 112 195 103Z" fill="#3c7040" />
            <path d="M278 110C268 125 273 135 283 140" fill="none" stroke="#315a33" strokeWidth="6" />
            <path d="M282 133C301 127 316 145 305 166C295 188 277 205 256 218C269 195 273 176 269 157C266 145 273 136 282 133Z" fill="#be4936" />
            <path d="M109 151C100 163 101 177 111 182" fill="none" stroke="#315a33" strokeWidth="6" />
            <path d="M110 176C127 173 139 187 133 206C125 232 100 252 79 257C94 242 99 220 98 201C96 188 101 179 110 176Z" fill="#dc6a42" />
            <path d="M150 326H253L243 365H160Z" fill="#c6b18c" /><path d="M145 320H258V334H145Z" fill="#b69d75" />
          </svg>
          <span className="art-caption"><Leaf size={15} aria-hidden="true" /> Small plant. Meaningful possibilities.</span>
          <span className="art-label">Nai Miris <span>නයි මිරිස්</span></span>
        </div>
      </section>
      <section id="foundation" className="foundation-section" aria-labelledby="foundation-title">
        <div className="section-intro">
          <p className="eyebrow">THE FIRST SEED</p>
          <h2 id="foundation-title">Good systems start<br />with strong roots.</h2>
          <p>This is the Phase 1 development foundation. The frontend and backend are ready to build on; farming features will arrive in the following phases.</p>
          <span className="phase-label"><FlaskConical size={16} aria-hidden="true" /> Research in progress</span>
        </div>
        <HealthCheck />
      </section>
      <section className="roadmap" aria-labelledby="roadmap-title">
        <div className="roadmap-heading"><h2 id="roadmap-title">What we’re growing toward</h2><span>Planned capabilities</span></div>
        <div className="feature-grid">
          {plannedFeatures.map(({ icon: Icon, title, text, phase }) => (
            <article className="feature-card" key={title}>
              <Icon className="feature-icon" size={24} aria-hidden="true" /><span className="feature-phase">{phase} · Planned</span>
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <aside className="research-note"><FlaskConical size={22} aria-hidden="true" /><p><strong>Honest research, from day one.</strong> No trained model is connected. Nai Miris-specific performance has not been established. This foundation does not provide agricultural diagnoses or treatment advice.</p></aside>
    </>
  );
}

export function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="NaiMiris AI home"><span className="brand-icon"><Sprout size={24} aria-hidden="true" /></span><span>NaiMiris<span className="brand-ai"> AI</span></span></Link>
        <span className="header-caption">Knowledge for a growing future</span>
        <span className="header-badge">Phase 1 <span>· Foundation</span></span>
      </header>
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Foundation />} />
          <Route path="*" element={<section className="not-found"><p className="eyebrow">404</p><h1>Page not found</h1><p>This page hasn’t taken root yet.</p><Link className="button button-dark" to="/">Back to the foundation</Link></section>} />
        </Routes>
      </main>
      <footer className="site-footer"><span><strong>NaiMiris AI</strong> · A Sri Lankan farming research project</span><span>Built with care. Growing responsibly.</span></footer>
    </div>
  );
}
