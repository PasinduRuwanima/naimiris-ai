import { useEffect, useRef, useState } from 'react';
import { Camera, Check, LockKeyhole, ScanLine, ShieldCheck } from 'lucide-react';
import { ImageUploader } from '../components/ImageUploader';
import { ButtonLink, DisclaimerBanner, ErrorState, LoadingState, PageHeader } from '../components/ui';
import { ApiError, PREDICTION_UNAVAILABLE, predictImage } from '../lib/api';
import type { PredictionResponse } from '../lib/api';
import { DiseaseDetails } from './Learn';

export function PredictionResult({ result }: { result: PredictionResponse }) { return <section className="prediction-result" aria-label="Prediction result"><p className="eyebrow">MODEL OUTPUT · REVIEW WITH CARE</p><h2>{result.condition}</h2><dl className="result-metadata"><div><dt>Model score</dt><dd>{(result.score * 100).toFixed(1)}%</dd></div><div><dt>Model version</dt><dd>{result.model_version}</dd></div></dl><DisclaimerBanner>{result.warning} A model score is not a calibrated probability or confirmed diagnosis.</DisclaimerBanner><p>{result.disease.description}</p><DiseaseDetails item={result.disease} /><ButtonLink to={`/chatbot?question=${encodeURIComponent(`Explain ${result.condition} and its uncertainty.`)}`}>Ask AI Chatbot</ButtonLink></section>; }
export function Detector() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  function changeFile(next: File | null) { request.current?.abort(); request.current = null; setBusy(false); setFile(next); setResult(null); }
  async function analyze() {
    if (!file) return;
    request.current?.abort(); const controller = new AbortController(); request.current = controller;
    setBusy(true); setError(null); setResult(null);
    try { const output = await predictImage(file, controller.signal); if (!controller.signal.aborted) setResult(output); }
    catch (reason) { if (!controller.signal.aborted) setError(reason instanceof ApiError ? reason.message : 'Unable to analyze this image. Please try again.'); }
    finally { if (request.current === controller) { setBusy(false); request.current = null; } }
  }
  return <div className="container page"><PageHeader eyebrow="AI DISEASE DETECTION" title="Healthy plants start with a closer look.">Upload a clear plant photo and prepare for image-based analysis. A starting point for understanding, with uncertainty always in view.</PageHeader><div className="capability-note"><span className="status-dot" /><div><strong>Model connection pending</strong><p>{PREDICTION_UNAVAILABLE}</p></div></div><div className="detector-layout"><section className="upload-panel"><div className="panel-title"><span className="step-number">01</span><div><h2>Upload your plant image</h2><p>One clear image is a good place to start.</p></div></div><ImageUploader file={file} onChange={changeFile} onError={setError} />{error && <ErrorState message={error} />}{busy ? <div className="analyze-progress"><LoadingState>Requesting plant analysis…</LoadingState><progress aria-label="Analysis in progress" /><button className="text-button" onClick={() => { request.current?.abort(); request.current = null; setBusy(false); }}>Cancel analysis</button></div> : <button className="button button-dark analyze-button" disabled={!file} onClick={() => void analyze()}><ScanLine size={18} aria-hidden="true" /> Analyze Image</button>}<p className="privacy-note"><LockKeyhole size={13} aria-hidden="true" /> Preview stays on your device until you choose Analyze Image.</p></section><aside className="photo-tips"><span className="icon-box"><Camera size={25} aria-hidden="true" /></span><h2>A good photo makes a difference.</h2><ul>{['Use natural, even light.', 'Keep the affected area sharp and in focus.', 'Include the whole leaf where possible.', 'Avoid heavy shadows, filters and blurry images.'].map((tip) => <li key={tip}><Check size={16} aria-hidden="true" />{tip}</li>)}</ul><div className="tip-note"><ShieldCheck size={21} aria-hidden="true" /><p>A photograph cannot tell the whole story. Growing conditions, symptom history and expert review still matter.</p></div></aside></div>{result && <PredictionResult result={result} />}<DisclaimerBanner>No trained classifier or validated local performance is available yet. Do not select a pesticide or treatment from an image alone.</DisclaimerBanner></div>;
}
