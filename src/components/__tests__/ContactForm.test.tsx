import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ContactFormWrapper from '../contact/ContactForm';
import '@testing-library/jest-dom';

jest.mock('react-google-recaptcha-v3', () => ({
  GoogleReCaptchaProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useGoogleReCaptcha: () => ({
    executeRecaptcha: jest.fn().mockResolvedValue('mock-token'),
  }),
}));

global.fetch = jest.fn();

describe('ContactForm component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 'test-key';
  });

  it('renders form fields and submit button when reCAPTCHA key is set', () => {
    render(<ContactFormWrapper />);
    expect(screen.getByLabelText(/imię i nazwisko\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/temat\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/treść wiadomości\*/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /wyślij wiadomość/i })).toBeInTheDocument();
  });

  it('shows error alert when reCAPTCHA key is missing', () => {
    delete process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    render(<ContactFormWrapper />);
    expect(screen.getByRole('alert')).toHaveTextContent(/błąd konfiguracji recaptcha/i);
  });

  it('validates form and shows errors on submit with empty fields', async () => {
    render(<ContactFormWrapper />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /wyślij wiadomość/i }));
    });
    expect(screen.getByText(/imię i nazwisko są wymagane/i)).toBeInTheDocument();
    expect(screen.getByText(/nieprawidłowy e-mail/i)).toBeInTheDocument();
    expect(screen.getByText(/temat jest wymagany/i)).toBeInTheDocument();
    expect(screen.getByText(/wiadomość musi mieć min. 10 znaków/i)).toBeInTheDocument();
    expect(screen.getByText(/musisz wyrazić zgodę/i)).toBeInTheDocument();
  });

  it('submits form successfully and shows success popup', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    render(<ContactFormWrapper />);
    fireEvent.change(screen.getByLabelText(/imię i nazwisko\*/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/e-mail\*/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/temat\*/i), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByLabelText(/treść wiadomości\*/i), { target: { value: 'This is a test message.' } });
    fireEvent.click(screen.getByLabelText(/wyrażam zgodę/i));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /wyślij wiadomość/i }));
    });
    await waitFor(() => {
      expect(screen.getByText(/dziękujemy za kontakt/i)).toBeInTheDocument();
    });
  });

  it('shows error popup on failed submission', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Submission failed' }),
    });
    render(<ContactFormWrapper />);
    fireEvent.change(screen.getByLabelText(/imię i nazwisko\*/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/e-mail\*/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/temat\*/i), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByLabelText(/treść wiadomości\*/i), { target: { value: 'This is a test message.' } });
    fireEvent.click(screen.getByLabelText(/wyrażam zgodę/i));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /wyślij wiadomość/i }));
    });
    await waitFor(() => {
      expect(screen.getByText(/nie udało się wysłać wiadomości/i)).toBeInTheDocument();
    });
  });
});
