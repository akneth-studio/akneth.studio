import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/suprabaseClient';
import { contactSchema } from '@/schemas/contactSchema';

export async function POST(req: NextRequest) {
  try {
    // Pobierz body tylko raz!
    const body = await req.json();

    // Walidacja i sanitacja danych przy pomocy Zod
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      // Zwróć szczegółowe błędy walidacji
      return NextResponse.json(
        { error: 'Niepoprawne dane', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { recaptchaToken, name, company, email, subject, message } = parsed.data;
    if (!body.consent) {
      return NextResponse.json({ error: 'Brak zgody na przetwarzanie danych.' }, { status: 400 });
    }

    // Weryfikacja reCAPTCHA
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptchaToken}`;

    const captchaRes = await fetch(verifyUrl, { method: 'POST' });
    const captchaData = await captchaRes.json();

    if (!captchaData.success || captchaData.score < 0.5) {
      return NextResponse.json({ error: 'reCAPTCHA failed' }, { status: 400 });
    }

    // Zapis do Supabase
    const { error } = await supabase.from('messages').insert([
      {
        name,
        company: company || null,
        email,
        subject,
        message,
        created_at: new Date().toISOString()
      }
    ]);

    if (error) {
      return NextResponse.json({ error: 'Błąd zapisu do bazy.' }, { status: 500 });
    }

    // TODO: Wysyłka e-maila potwierdzającego dla klienta

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Błąd serwera:', e);
    return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
  }
}
