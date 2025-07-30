import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ReplyForm from '../admin/replyForm';
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

function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

describe('ReplyForm component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Wyślij odpowiedź/i }));
      await flushPromises();
    });

    await waitFor(() => {
      expect(screen.getByText(/Odpowiedź została wysłana i zapisana./i)).toBeInTheDocument();
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
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Wyślij odpowiedź/i }));
      await flushPromises();
    });

    await waitFor(() => {
      const popup = screen.queryByTestId('popup');
      expect(popup).not.toBeNull();
      if (popup) {
        expect(popup.textContent).toMatch(/Błąd wysyłki lub zapisu/i);
      }
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
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Wyślij odpowiedź/i }));
      await flushPromises();
    });

    await waitFor(() => {
      const popup = screen.queryByTestId('popup');
      expect(popup).not.toBeNull();
      if (popup) {
        expect(popup.textContent).toMatch(/Błąd wysyłki lub zapisu/i);
      }
    });
  });
});
