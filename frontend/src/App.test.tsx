import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { App } from './App';

describe('foundation screen', () => {
  it('shows real health and clearly marks future capabilities', async () => {
    const payload = { status: 'ok', service: 'NaiMiris AI API', version: '0.1.0' };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(payload))));
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Healthier harvests.');
    expect(await screen.findByText('Backend connected')).toBeInTheDocument();
    expect(screen.getByText(/Nai Miris-specific performance has not been established/)).toBeInTheDocument();
    expect(screen.getAllByText(/· Planned/)).toHaveLength(3);
  });
  it('shows connectivity failure and allows a successful retry', async () => {
    const fetchMock = vi.fn().mockRejectedValueOnce(new TypeError('Network failure')).mockResolvedValueOnce(new Response(JSON.stringify({ status: 'ok', service: 'NaiMiris AI API', version: '0.1.0' })));
    vi.stubGlobal('fetch', fetchMock);
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(await screen.findByText('Backend unavailable')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Check connection' }));
    expect(await screen.findByText('Backend connected')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it('provides a usable fallback route', () => {
    render(<MemoryRouter initialEntries={['/missing']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the foundation' })).toHaveAttribute('href', '/');
  });
});
