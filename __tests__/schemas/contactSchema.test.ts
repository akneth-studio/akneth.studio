import { contactSchema } from '@/schemas/contactSchema';

describe('contactSchema', () => {
  it('should pass validation with valid data', () => {
    const validData = {
      name: 'Jan Kowalski',
      company: 'Firma XYZ',
      email: 'jan.kowalski@example.com',
      subject: 'Zapytanie ofertowe',
      message: 'Proszę o przesłanie oferty na nasze usługi.',
      recaptchaToken: 'token123',
    };

    expect(() => contactSchema.parse(validData)).not.toThrow();
  });

  it('should fail if name is missing or too short', () => {
    const invalidData1 = {
      name: '',
      email: 'jan.kowalski@example.com',
      subject: 'Zapytanie',
      message: 'Długa wiadomość tutaj...',
      recaptchaToken: 'token123',
    };
    expect(() => contactSchema.parse(invalidData1)).toThrow('Imię i nazwisko są wymagane');

    const invalidData2 = {
      email: 'jan.kowalski@example.com',
      subject: 'Zapytanie',
      message: 'Długa wiadomość tutaj...',
      recaptchaToken: 'token123',
    };
    expect(() => contactSchema.parse(invalidData2)).toThrow('Imię i nazwisko są wymagane');
  });

  it('should fail if email is invalid', () => {
    const invalidData = {
      name: 'Jan Kowalski',
      email: 'invalid-email',
      subject: 'Zapytanie',
      message: 'Długa wiadomość tutaj...',
      recaptchaToken: 'token123',
    };
    expect(() => contactSchema.parse(invalidData)).toThrow('Nieprawidłowy e-mail');
  });

  it('should fail if subject is missing or too short', () => {
    const invalidData1 = {
      name: 'Jan Kowalski',
      email: 'jan.kowalski@example.com',
      subject: '',
      message: 'Długa wiadomość tutaj...',
      recaptchaToken: 'token123',
    };
    expect(() => contactSchema.parse(invalidData1)).toThrow('Temat jest wymagany');

    const invalidData2 = {
      name: 'Jan Kowalski',
      email: 'jan.kowalski@example.com',
      message: 'Długa wiadomość tutaj...',
      recaptchaToken: 'token123',
    };
    expect(() => contactSchema.parse(invalidData2)).toThrow('Temat jest wymagany');
  });

  it('should fail if message is missing or too short', () => {
    const invalidData1 = {
      name: 'Jan Kowalski',
      email: 'jan.kowalski@example.com',
      subject: 'Zapytanie',
      message: '',
      recaptchaToken: 'token123',
    };
    expect(() => contactSchema.parse(invalidData1)).toThrow('Wiadomość musi mieć min. 10 znaków');

    const invalidData2 = {
      name: 'Jan Kowalski',
      email: 'jan.kowalski@example.com',
      subject: 'Zapytanie',
      recaptchaToken: 'token123',
    };
    expect(() => contactSchema.parse(invalidData2)).toThrow('Wiadomość musi mieć min. 10 znaków');
  });

  it('should fail if recaptchaToken is missing or empty', () => {
    const invalidData1 = {
      name: 'Jan Kowalski',
      email: 'jan.kowalski@example.com',
      subject: 'Zapytanie',
      message: 'Długa wiadomość tutaj...',
      recaptchaToken: '',
    };
    expect(() => contactSchema.parse(invalidData1)).toThrow('Brak tokena reCAPTCHA');

    const invalidData2 = {
      name: 'Jan Kowalski',
      email: 'jan.kowalski@example.com',
      subject: 'Zapytanie',
      message: 'Długa wiadomość tutaj...',
    };
    expect(() => contactSchema.parse(invalidData2)).toThrow('Brak tokena reCAPTCHA');
  });

  it('should allow company to be optional', () => {
    const validData = {
      name: 'Jan Kowalski',
      email: 'jan.kowalski@example.com',
      subject: 'Zapytanie',
      message: 'Długa wiadomość tutaj...',
      recaptchaToken: 'token123',
    };

    expect(() => contactSchema.parse(validData)).not.toThrow();
  });
});
