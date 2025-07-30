import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ReplyForm from '../src/components/admin/replyForm';
import '@testing-library/jest-dom';

// Mock Popup component to render popup when show is true
jest.mock('../Popup', () => {
  return function MockPopup(props: { show: boolean; message: string }) {
    if (!props.show) return null;
    return <div data-testid="popup">{props.message}</div>;
  };
});

const mockMsg = {
  id: '1',
  name: 'John Doe',
  company: 'Company A',
  email: 'john@example.com',
  subject: 'Test Subject',
  message: 'Test message',
  created_at: '2023-01-01T12:00:00Z',
  replied: false,
  reply_text: '',
  captcha_score: 0.9,
};

global.fetch = jest.fn();

describe('ReplyForm component', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Tłumimy console.log, aby uniknąć zaśmiecania wyników testów
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('renders message details and form', () => {
    render(<ReplyForm msg={mockMsg} />);
    expect(screen.getByText('Szczegóły wiadomości')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByLabelText('Odpowiedź do klienta')).toBeInTheDocument();
  });

  it('submits reply and shows success popup', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

    render(<ReplyForm msg={mockMsg} />);
    const textarea = screen.getByLabelText('Odpowiedź do klienta');
    fireEvent.change(textarea, { target: { value: 'Test reply' } });
    fireEvent.click(screen.getByRole('button', { name: /Wyślij odpowiedź/i }));

    await waitFor(() => {
      expect(screen.getByTestId('popup')).toHaveTextContent(/Odpowiedź została wysłana i zapisana./i);
    });
  });

  it('shows error popup on failed save', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Save error' })
      });

    render(<ReplyForm msg={mockMsg} />);
    const textarea = screen.getByLabelText('Odpowiedź do klienta');
    fireEvent.change(textarea, { target: { value: 'Test reply' } });
    fireEvent.click(screen.getByRole('button', { name: /Wyślij odpowiedź/i }));

    await waitFor(() => {
      expect(screen.getByTestId('popup')).toHaveTextContent(/Błąd wysyłki lub zapisu/i);
    });
  });

  it('shows error popup on failed email send', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ success: false })
      });

    render(<ReplyForm msg={mockMsg} />);
    const textarea = screen.getByLabelText('Odpowiedź do klienta');
    fireEvent.change(textarea, { target: { value: 'Test reply' } });
    fireEvent.click(screen.getByRole('button', { name: /Wyślij odpowiedź/i }));

    await waitFor(() => {
      expect(screen.getByTestId('popup')).toHaveTextContent(/Błąd wysyłki lub zapisu/i);
    });
  });
});
