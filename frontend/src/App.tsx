import { Route, Routes } from 'react-router';
import { Footer, Navbar, RouteEffects } from './components/Layout';
import { ButtonLink, ErrorBoundary } from './components/ui';
import { Home } from './pages/Home';
import { AboutNaiMiris, DiseaseDetailPage, DiseaseLibrary, GrowingGuide } from './pages/Learn';
import { Detector } from './pages/Detector';
import { Chatbot } from './pages/Chatbot';
import { AboutProject } from './pages/AboutProject';

export function App() {
  return <ErrorBoundary><a className="skip-link" href="#main">Skip to content</a><Navbar /><RouteEffects /><main id="main" tabIndex={-1}><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about-nai-miris" element={<AboutNaiMiris />} />
    <Route path="/growing-guide" element={<GrowingGuide />} />
    <Route path="/disease-detector" element={<Detector />} />
    <Route path="/disease-library" element={<DiseaseLibrary />} />
    <Route path="/disease-library/:id" element={<DiseaseDetailPage />} />
    <Route path="/chatbot" element={<Chatbot />} />
    <Route path="/about-project" element={<AboutProject />} />
    <Route path="*" element={<section className="container page not-found"><p className="eyebrow">404 · A LITTLE OFF THE GARDEN PATH</p><h1>Page not found</h1><p>Let’s find somewhere better to grow.</p><ButtonLink to="/">Back to home</ButtonLink></section>} />
  </Routes></main><Footer /></ErrorBoundary>;
}
