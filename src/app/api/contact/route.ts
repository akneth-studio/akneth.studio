import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/suprabaseClient';
import { contactSchema } from '@/schemas/contactSchema';
import { withBetterStack, BetterStackRequest } from '@logtail/next';

const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 m"), // max 3 requesty na minutę
});

export const POST = withBetterStack(async (req: BetterStackRequest) => {
  req.log.info('Wysyłanie formularza; rozpoczynamy przetwarzanie...');
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    const { success } = await ratelimit.limit(ip);
    if (!success) {
      req.log.warn("Rate limit exceeded", { ip: ip });
      return NextResponse.json({ error: "Zbyt wiele prób. Spróbuj później." }, { status: 429 });
    }

    // Pobierz body tylko raz!
    const body = await req.json();

    // Walidacja i sanitacja danych przy pomocy Zod
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      req.log.warn("Invalid data", { details: parsed.error.flatten() });
      // Zwróć szczegółowe błędy walidacji
      return NextResponse.json(
        { error: 'Niepoprawne dane', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { recaptchaToken, name, company, email, subject, message } = parsed.data;
    if (!body.consent) {
      req.log.warn("No consent for data processing", { user: name, mail: email });
      return NextResponse.json({ error: 'Brak zgody na przetwarzanie danych.' }, { status: 400 });
    }

    // Weryfikacja reCAPTCHA
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptchaToken}`;

    const captchaRes = await fetch(verifyUrl, { method: 'POST' });
    const captchaData = await captchaRes.json();

    if (!captchaData.success || captchaData.score < 0.5 || captchaData.action !== 'contact_form_submit') {
      req.log.warn("reCAPTCHA failed or action mismatch", { user: name, mail: email, score: captchaData.score, action: captchaData.action });
      return NextResponse.json({ error: 'reCAPTCHA failed or action mismatch' }, { status: 400 });
    }


    // Zapis do Supabase
    const { error } = await supabase.from('messages').insert([
      {
        name,
        company: company || null,
        email,
        subject,
        message,
        created_at: new Date().toISOString(),
        captcha_score: captchaData.score
      }
    ]);

    const log = req.log.with({ scope: 'user' });
    log.info('User sent message', { user: name, mail: email });

    if (error) {
      req.log.error('Błąd zapisu do bazy', { err: error, status: '400', user: name, mail: email });
      return NextResponse.json({ error: 'Błąd zapisu do bazy.' }, { status: 500 });
    }

    // FIXIT: Wysyłka e-maila potwierdzającego dla klienta

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Błąd serwera:', e);
    req.log.error('Błąd serwera', { error: e, status: '500' });
    return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 });
  }
})
