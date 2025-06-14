import { z } from 'zod';

export const contactSchema = z.object({
    name: z.string().min(2, 'Imię i nazwisko są wymagane'),
    company: z.string().optional(),
    email: z.string().email('Nieprawidłowy e-mail'),
    subject: z.string().min(2, 'Temat jest wymagany'),
    message: z.string().min(10, 'Wiadomość musi mieć min. 10 znaków'),
    recaptchaToken: z.string().min(1, 'Brak tokena reCAPTCHA'),
});
