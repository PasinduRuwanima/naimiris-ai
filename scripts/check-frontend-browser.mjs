// Dependency-free browser smoke checks using an installed Chromium/Edge.
// Start the Vite server first. Override BROWSER_PATH on other platforms.
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';

const browser = process.env.BROWSER_PATH ?? 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const base = process.env.FRONTEND_URL ?? 'http://127.0.0.1:5173';
const profile = await mkdtemp(join(tmpdir(), 'naimiris-browser-'));
const child = spawn(browser, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
let socket;
const pending = new Map();
let seq = 0;
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function check(condition, message) { if (!condition) throw new Error(message); }
async function poll(fn, description) {
  for (let attempt = 0; attempt < 100; attempt++) {
    try { const result = await fn(); if (result) return result; } catch { /* Browser startup/navigation can be incomplete. */ }
    await pause(100);
  }
  throw new Error(`Timed out: ${description}`);
}
function command(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++seq;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 10000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function navigate(path) {
  await command('Page.navigate', { url: `${base}${path}` });
  await poll(() => evaluate(`location.pathname === ${JSON.stringify(path)} && document.readyState === 'complete' && !!document.querySelector('h1')`), path);
  await evaluate('document.fonts.ready');
}

try {
  child.on('error', (error) => console.error(error.message));
  const port = await poll(async () => (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0], 'browser startup');
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(targets.find((target) => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = ({ data }) => {
    const response = JSON.parse(data); const entry = pending.get(response.id);
    if (entry) { clearTimeout(entry.timer); pending.delete(response.id); if (response.error) entry.reject(new Error(response.error.message)); else entry.resolve(response.result); }
  };
  await command('Page.enable');
  const routes = ['/', '/about-nai-miris', '/growing-guide', '/disease-detector', '/disease-library', '/chatbot', '/about-project', '/disease-library/bacterial-spot'];
  let checked = 0;
  for (const width of [360, 390, 768, 1440]) {
    await command('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: false });
    for (const route of routes) {
      await navigate(route);
      const layout = await evaluate(`({width:innerWidth, overflow:document.documentElement.scrollWidth > innerWidth, headings:document.querySelectorAll('h1').length})`);
      check(layout.width === width && !layout.overflow && layout.headings === 1, `${route} at ${width}px: ${JSON.stringify(layout)}`);
      checked++;
    }
    await navigate('/');
    await poll(() => evaluate(`Array.from(document.querySelectorAll('main img')).every(img => img.complete && img.naturalWidth > 0)`), 'loaded home photograph');
    if (width === 390) {
      await evaluate(`document.querySelector('.menu-toggle').click()`);
      check(await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'true' && getComputedStyle(document.querySelector('.main-nav')).display !== 'none'`), 'Mobile menu did not open');
      await evaluate(`document.querySelector('.main-nav a[href="/disease-library"]').click()`);
      await poll(() => evaluate(`location.pathname === '/disease-library' && document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false'`), 'mobile navigation');
      console.log('PASS: mobile menu opens, navigates and closes');
    }
    if ([390, 1440].includes(width)) {
      await navigate('/');
      const screenshot = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      await writeFile(join(profile, `home-${width}.png`), Buffer.from(screenshot.data, 'base64'));
      // Copy requested QA images to an explicit directory; routine runs retain none.
      if (process.env.QA_SCREENSHOT_DIR) await writeFile(join(process.env.QA_SCREENSHOT_DIR, `home-${width}.png`), Buffer.from(screenshot.data, 'base64'));
    }
    console.log(`PASS: ${routes.length} routes at ${width}px, no horizontal overflow`);
  }
  console.log(`PASS: ${checked} route/viewport checks; images loaded; one h1 per page`);
} finally {
  if (socket?.readyState === WebSocket.OPEN) {
    try { await command('Browser.close'); } catch { /* Browser may close before acknowledgment. */ }
    socket.close();
  }
  if (!child.killed) child.kill();
  for (const entry of pending.values()) clearTimeout(entry.timer);
  check(dirname(resolve(profile)) === resolve(tmpdir()) && basename(profile).startsWith('naimiris-browser-'), 'Refusing to remove an unexpected profile path');
  await rm(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
}
