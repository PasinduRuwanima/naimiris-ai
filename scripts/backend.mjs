import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const python = path.join(root, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
const commands = {
  dev: ['-m', 'uvicorn', 'naimiris_api.main:app', '--reload', '--reload-dir', 'backend/src', '--host', '127.0.0.1', '--port', '8000'],
  test: ['-m', 'pytest', 'backend/tests', '-q'],
};
const args = commands[process.argv[2]];
if (!args || !existsSync(python)) {
  console.error('Create .venv and install backend dependencies first. See README.md. Use dev or test.');
  process.exit(1);
}
const child = spawn(python, args, { cwd: root, stdio: 'inherit' });
child.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
child.on('exit', (code) => { process.exitCode = code ?? 1; });
