import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Leaf, MessageCircle, Plus, Square, Sprout } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { DisclaimerBanner, ErrorState, LoadingState, PageHeader, SourceReferences } from '../components/ui';
import { ApiError, CHAT_UNAVAILABLE, sendChat } from '../lib/api';
import type { ChatTurn, Source } from '../lib/api';

interface Message extends ChatTurn { id: number; sources?: Source[] }
const questions = ['What is Nai Miris?', 'How can I grow Nai Miris at home?', 'Why are my chilli leaves turning yellow?', 'How can I prevent common chilli diseases?', 'නයි මිරිස් වගා කරන්නේ කොහොමද?', 'නයි මිරිස් කොළ කහ වෙන්නේ ඇයි?'];
export function ChatMessage({ message }: { message: Message }) { return <article className={`chat-message ${message.role}`}><span className="message-avatar">{message.role === 'assistant' ? <Sprout size={18} aria-hidden="true" /> : 'Y'}</span><div><span className="message-author">{message.role === 'assistant' ? 'NaiMiris Assistant' : 'You'}</span><p dir="auto">{message.content}</p>{message.sources && <SourceReferences sources={message.sources} />}</div></article>; }
export function ChatInput({ value, setValue, busy, onSubmit, onCancel }: { value: string; setValue: (value: string) => void; busy: boolean; onSubmit: () => void; onCancel: () => void }) { return <form className="chat-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}><label className="sr-only" htmlFor="chat-question">Your farming question</label><textarea id="chat-question" dir="auto" placeholder="Ask a farming question… / ඔබේ ප්‍රශ්නය ලියන්න…" value={value} maxLength={2000} rows={2} disabled={busy} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (!busy) onSubmit(); } }} /><div className="chat-form-bottom"><span>English & සිංහල <span aria-hidden="true">·</span> {value.length}/2000</span>{busy ? <button type="button" className="send-button" aria-label="Cancel request" onClick={onCancel}><Square size={16} aria-hidden="true" /></button> : <button className="send-button" aria-label="Send message" disabled={!value.trim()}><ArrowUp size={21} aria-hidden="true" /></button>}</div></form>; }
export function Chatbot() {
  const [params] = useSearchParams();
  const [input, setInput] = useState(() => (params.get('question') ?? '').slice(0, 2000));
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryMessages, setRetryMessages] = useState<Message[] | null>(null);
  const request = useRef<AbortController | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const id = useRef(0);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => { if (messages.length) end.current?.scrollIntoView({ block: 'nearest' }); }, [messages, busy]);
  async function submit(retry = false) {
    if (busy || (!retry && !input.trim())) return;
    const next = retry && retryMessages ? retryMessages : [...messages, { id: ++id.current, role: 'user' as const, content: input.trim() }];
    setMessages(next); setInput(''); setBusy(true); setError(null); setRetryMessages(next);
    const controller = new AbortController(); request.current = controller;
    try { const response = await sendChat(next.map(({ role, content }) => ({ role, content })), controller.signal); if (!controller.signal.aborted) { setMessages([...next, { id: ++id.current, role: 'assistant', content: response.answer, sources: response.sources }]); setRetryMessages(null); } }
    catch (reason) { if (!controller.signal.aborted) setError(reason instanceof ApiError ? reason.message : 'The assistant could not be reached. Please try again.'); }
    finally { if (request.current === controller) { setBusy(false); request.current = null; } }
  }
  function reset() { request.current?.abort(); request.current = null; setBusy(false); setMessages([]); setRetryMessages(null); setError(null); setInput(''); }
  return <div className="container page chat-page"><PageHeader eyebrow="YOUR AI FARMING COMPANION" title="Let’s talk about what’s growing.">A space for your questions, in the language that feels like home.</PageHeader><div className="chat-layout"><aside className="chat-sidebar"><span className="icon-box"><Leaf size={25} aria-hidden="true" /></span><h2>Curiosity is<br />a good place to start.</h2><p>Ask about growing, plant symptoms or the essentials of Nai Miris.</p><span className="label">ENGLISH + සිංහල</span><div className="sidebar-bottom"><Sprout size={25} aria-hidden="true" /><p>Built for helpful, source-grounded conversations.</p><small>Retrieval and AI service integration are pending.</small></div></aside><section className="chat-panel" aria-label="AI farming conversation"><header className="chat-header"><span className="icon-box"><MessageCircle size={19} aria-hidden="true" /></span><div><h2>NaiMiris Assistant</h2><span><span className="status-dot" /> Service not connected</span></div><button className="icon-button" aria-label="New conversation" onClick={reset}><Plus size={20} aria-hidden="true" /></button></header><div className="conversation" role="log" aria-label="Conversation messages" aria-live="polite">{messages.length ? messages.map((message) => <ChatMessage message={message} key={message.id} />) : <div className="chat-welcome"><span className="welcome-icon"><Sprout size={40} strokeWidth={1.4} aria-hidden="true" /></span><h2>What would you like to grow today?</h2><p>Start with a question, or let one of these take root.</p><div className="suggestion-grid">{questions.map((question) => <button key={question} dir="auto" onClick={() => { setInput(question); document.getElementById('chat-question')?.focus(); }}>{question}<span aria-hidden="true">↗</span></button>)}</div><p className="chat-unavailable">{CHAT_UNAVAILABLE}</p></div>}{busy && <LoadingState>Waiting for the assistant…</LoadingState>}<div ref={end} /></div>{error && <ErrorState message={error} onRetry={() => void submit(true)} />}<ChatInput value={input} setValue={setInput} busy={busy} onSubmit={() => void submit()} onCancel={() => { request.current?.abort(); request.current = null; setBusy(false); setError('Request cancelled. You can retry your question.'); }} /><p className="chat-privacy">Conversations stay in memory for this visit. Messages are sent only when you press Send.</p></section></div><DisclaimerBanner>AI answers, when available, may be incomplete. Confirm important growing decisions with a qualified local agricultural adviser.</DisclaimerBanner></div>;
}
