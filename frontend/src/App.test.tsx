import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { CHAT_UNAVAILABLE, PREDICTION_UNAVAILABLE } from './lib/api';

function open(path = '/') { return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>); }
const image = () => new File(['plant'], 'leaf.png', { type: 'image/png' });
function upload(file = image()) { fireEvent.change(screen.getByLabelText('Choose plant image'), { target: { files: [file] } }); }
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 404 })));
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-plant');
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
});

describe('application navigation', () => {
  it('renders the homepage and honest research status', () => {
    open();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Grow HealthierNai Miris withthe Power of AI.');
    expect(screen.getByText(/No trained model is connected yet/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Detect Plant Disease/ })).toHaveAttribute('href', '/disease-detector');
  });
  it('navigates to the growing guide and marks the active route', () => {
    open(); fireEvent.click(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByText('Growing Guide'));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Grow your knowledge.');
    expect(screen.getByRole('navigation', { name: 'Growing guide sections' })).toBeInTheDocument();
    expect(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByText('Growing Guide')).toHaveAttribute('aria-current', 'page');
    expect(screen.getAllByText(/STEP \d/)).toHaveLength(14);
  });
  it('opens mobile navigation and closes it with Escape and after navigation', () => {
    open(); fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(screen.getByRole('button', { name: 'Close navigation' })).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(screen.getByRole('navigation', { name: 'Main navigation' }), { key: 'Escape' });
    expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByText('About Nai Miris'));
    expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('A small chilli.');
  });
  it('shows a usable fallback route', () => { open('/missing'); expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument(); expect(screen.getByRole('link', { name: /Back to home/ })).toHaveAttribute('href', '/'); });
  it('preserves real health checking and successful retry on the project page', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new TypeError('Network failure')).mockResolvedValueOnce(new Response(JSON.stringify({ status: 'ok', service: 'NaiMiris AI API', version: '0.1.0' }))));
    open('/about-project'); expect(await screen.findByText('Backend unavailable')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Check connection' }));
    expect(await screen.findByText('Backend connected')).toBeInTheDocument();
    expect(screen.getByText(/No training, evaluation, accuracy/)).toBeInTheDocument();
  });
});
describe('image upload and analysis', () => {
  it('validates image type and size', () => {
    open('/disease-detector');
    expect(screen.getByRole('button', { name: /Analyze Image/ })).toBeDisabled();
    upload(new File(['bad'], 'bad.svg', { type: 'image/svg+xml' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Choose a JPEG, PNG, or WebP');
    const large = image(); Object.defineProperty(large, 'size', { value: 6 * 1024 * 1024 }); upload(large);
    expect(screen.getByRole('alert')).toHaveTextContent('too large');
    expect(screen.getByRole('button', { name: /Analyze Image/ })).toBeDisabled();
  });
  it('previews, replaces and removes an image and revokes its object URL', () => {
    open('/disease-detector'); upload();
    expect(screen.getByRole('img', { name: /Selected plant image: leaf.png/ })).toHaveAttribute('src', 'blob:test-plant');
    expect(screen.getByRole('button', { name: /Analyze Image/ })).toBeEnabled();
    upload(new File(['other'], 'other.webp', { type: 'image/webp' }));
    expect(screen.getByRole('img', { name: /other.webp/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove image' }));
    expect(screen.queryByRole('img', { name: /Selected/ })).not.toBeInTheDocument();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-plant');
  });
  it('accepts a dropped file and handles unreadable images', () => {
    open('/disease-detector'); fireEvent.drop(screen.getByText('Give your plant a closer look.').closest('.drop-zone')!, { dataTransfer: { files: [image()] } });
    fireEvent.error(screen.getByRole('img', { name: /Selected/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('could not be opened');
    expect(screen.getByRole('button', { name: /Analyze Image/ })).toBeDisabled();
  });
  it('shows the actual unavailable endpoint response without a prediction', async () => {
    open('/disease-detector'); upload(); fireEvent.click(screen.getByRole('button', { name: /Analyze Image/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent(PREDICTION_UNAVAILABLE);
    expect(screen.queryByRole('region', { name: 'Prediction result' })).not.toBeInTheDocument();
    const call = vi.mocked(fetch).mock.calls[0]; expect(call?.[0]).toBe('/api/predict');
    expect((call?.[1]?.body as FormData).get('image')).toBeInstanceOf(File);
  });
  it('cancels analysis and ignores a late response', async () => {
    let resolve!: (response: Response) => void;
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>((done) => { resolve = done; })));
    open('/disease-detector'); upload(); fireEvent.click(screen.getByRole('button', { name: /Analyze Image/ }));
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel analysis' }));
    resolve(new Response('{}', { status: 404 }));
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
describe('AI chat interface', () => {
  it('supports Sinhala suggestions, input and an honest unavailable response', async () => {
    open('/chatbot'); expect(screen.getByText(CHAT_UNAVAILABLE)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /නයි මිරිස් වගා කරන්නේ කොහොමද/ }));
    expect(screen.getByRole('textbox', { name: 'Your farming question' })).toHaveValue('නයි මිරිස් වගා කරන්නේ කොහොමද?');
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(CHAT_UNAVAILABLE);
    expect(within(screen.getByRole('log')).getByText('නයි මිරිස් වගා කරන්නේ කොහොමද?')).toBeInTheDocument();
    expect(within(screen.getByRole('log')).queryByText('NaiMiris Assistant')).not.toBeInTheDocument();
    expect(JSON.parse(vi.mocked(fetch).mock.calls[0]?.[1]?.body as string).messages[0].content).toBe('නයි මිරිස් වගා කරන්නේ කොහොමද?');
  });
  it('blocks blank messages and retries without duplicating the user message', async () => {
    open('/chatbot'); expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Why are leaves yellow?' } });
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    await screen.findByRole('alert'); fireEvent.click(screen.getByRole('button', { name: /Try again/ }));
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(within(screen.getByRole('log')).getAllByText('Why are leaves yellow?')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'New conversation' }));
    expect(screen.getByText('What would you like to grow today?')).toBeInTheDocument();
  });
  it('prefills questions from library links without automatically sending', () => { open('/chatbot?question=Tell%20me%20about%20aphids'); expect(screen.getByRole('textbox')).toHaveValue('Tell me about aphids'); expect(fetch).not.toHaveBeenCalled(); });
});
describe('disease library', () => {
  it('searches, filters and clears an empty result', () => {
    open('/disease-library'); expect(screen.getByText('6 topics to explore · General pepper references')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Bacterial' }));
    expect(screen.getByRole('heading', { name: 'Bacterial spot' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Powdery mildew' })).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'no-matches' } });
    expect(screen.getByText('No matching topics yet')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByRole('heading', { name: 'Powdery mildew' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'honeydew' } });
    expect(screen.getByRole('heading', { name: 'Aphids & curled growth' })).toBeInTheDocument();
  });
  it('opens a detail view with symptoms and references', () => {
    open('/disease-library'); fireEvent.click(screen.getByRole('link', { name: /Bacterial spot/ }));
    expect(screen.getByRole('heading', { name: 'Symptoms to observe' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /UC IPM · Bacterial spot/ })).toHaveAttribute('href', 'https://ipm.ucanr.edu/agriculture/peppers/bacterial-spot/');
  });
});
