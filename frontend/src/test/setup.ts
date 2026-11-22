import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
  URL.createObjectURL ??= () => 'blob:test';
  URL.revokeObjectURL ??= () => {};
});

afterEach(cleanup);
