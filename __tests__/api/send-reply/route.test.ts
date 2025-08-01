/** @jest-environment node */

import { POST } from '@/app/api/send-reply/route';
import { NextRequest } from 'next/server';
import nodemailer from 'nodemailer';

const mockSendMail = jest.fn();
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail,
  })),
}));

describe('POST /api/send-reply', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'user@example.com';
    process.env.SMTP_PASS = 'password';
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const createRequest = (body: { to: string; subject: string; reply: string; name: string }) => {
    return new NextRequest('http://localhost/api/send-reply', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  };

  const mailData = {
    to: 'recipient@example.com',
    subject: 'Test Subject',
    reply: 'This is the reply content.\nWith a new line.',
    name: 'Test User',
  };

  it('should send an email successfully', async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: '123' });

    const req = createRequest(mailData);
    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(nodemailer.createTransport).toHaveBeenCalled();
    expect(mockSendMail).toHaveBeenCalled();
  });

  it('should construct the email correctly', async () => {
    mockSendMail.mockResolvedValueOnce({ messageId: '123' });

    const req = createRequest(mailData);
    await POST(req);

    const sentMailOptions = mockSendMail.mock.calls[0][0];
    expect(sentMailOptions.to).toBe(mailData.to);
    expect(sentMailOptions.subject).toBe(`Odpowiedź: ${mailData.subject}`);
    expect(sentMailOptions.text).toContain(`Dzień dobry, ${mailData.name}!`);
    expect(sentMailOptions.text).toContain(mailData.reply);
    expect(sentMailOptions.html).toContain(mailData.reply.replace(/\n/g, '<br>'));
  });

  it('should handle email sending failure', async () => {
    const errorMessage = 'Failed to send email';
    mockSendMail.mockRejectedValueOnce(new Error(errorMessage));

    const req = createRequest(mailData);
    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe('Błąd wysyłki maila.');
  });
});