import { useEffect, useRef, useState } from 'react';
import { ImagePlus, RefreshCw, Upload, X } from 'lucide-react';
import { IMAGE_TYPES, MAX_UPLOAD_MB, validateImage } from '../lib/upload';

export function ImageUploader({ file, onChange, onError }: { file: File | null; onChange: (file: File | null) => void; onError: (message: string | null) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState('');
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    if (!file) { setPreview(''); return; }
    const url = URL.createObjectURL(file); setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  function select(files: FileList | null) {
    if (!files?.length) return;
    if (files.length !== 1) { onError('Choose one image at a time.'); return; }
    const chosen = files[0]; if (!chosen) return;
    const error = validateImage(chosen); onError(error);
    // Invalid replacements clear the old image so it cannot be analyzed by mistake.
    onChange(error ? null : chosen);
  }
  return <div className="uploader"><input ref={input} id="plant-image" className="sr-only" tabIndex={-1} aria-label="Choose plant image" type="file" accept={IMAGE_TYPES.join(',')} onChange={(event) => { select(event.target.files); event.target.value = ''; }} />
    {file && preview ? <div className="preview-wrap"><img className="image-preview" src={preview} alt={`Selected plant image: ${file.name}`} onError={() => { onChange(null); onError('This image could not be opened. Choose another JPEG, PNG, or WebP.'); }} /><div className="preview-meta"><span>{file.name}<small>{(file.size / 1024 / 1024).toFixed(2)} MB · Ready to upload</small></span><button className="icon-button" aria-label="Remove image" onClick={() => { onChange(null); onError(null); }}><X size={19} aria-hidden="true" /></button></div><button className="text-button" onClick={() => input.current?.click()}><RefreshCw size={15} aria-hidden="true" /> Replace image</button></div>
      : <div className={`drop-zone ${dragging ? 'dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); select(event.dataTransfer.files); }}><span className="upload-icon"><ImagePlus size={33} strokeWidth={1.5} aria-hidden="true" /></span><h3>Give your plant a closer look.</h3><p>Drag and drop a plant photo here,<br />or choose one from your device.</p><button className="button button-dark" onClick={() => input.current?.click()}><Upload size={16} aria-hidden="true" /> Browse files</button><small>JPEG, PNG or WebP · Up to {MAX_UPLOAD_MB} MB</small></div>}
  </div>;
}
