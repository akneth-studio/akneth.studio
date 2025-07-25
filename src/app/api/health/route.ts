import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClientServ';
import { supabase as supabaseAuth } from '@/lib/suprabaseClient';

export async function GET(req: NextRequest) {
    const errors: Record<string, string> = {};

    const sup_mail = process.env.SUPABASE_MAIL;
    const sup_password = process.env.SUPABASE_PASSWORD;

    const healthChecks = [
        // Sprawdzenie tabeli 'messages'
        async () => {
            const { error } = await supabase.from('messages').select('id', { count: 'exact', head: true });
            if (error) {
                errors.messages = `Błąd odczytu z tabeli 'messages': ${error.message}`;
            }
        },

        // Sprawdzenie tabeli 'banners'
        async () => {
            const { error } = await supabase.from('banners').select('id', { count: 'exact', head: true });
            if (error) {
                errors.banners = `Błąd odczytu z tabeli 'banners': ${error.message}`;
            }
        },

        // Sprawdzenie bucketa 'cms'
        async () => {
            const { error } = await supabase.storage.from('cms').list('', { limit: 1 });
            if (error) {
                errors.bucketCMS = `Błąd odczytu z bucketa 'cms': ${error.message}`;
            }
        },

        // Sprawdzenie autoryzacji
        async () => {
            if (!sup_mail || !sup_password) {
                errors.auth = 'Brak zmiennych środowiskowych SUPABASE_MAIL lub SUPABASE_PASSWORD.';
                return;
            }
            const { data, error } = await supabaseAuth.auth.signInWithPassword({
                email: sup_mail,
                password: sup_password,
            });

            if (error) {
                errors.auth = `Logowanie nie powiodło się: ${error.message}`;
            } else if (!data.session) {
                errors.auth = 'Logowanie powiodło się, ale nie otrzymano sesji.';
            } else {
                // Sesja jest, więc autoryzacja działa. Wyloguj, aby nie zostawiać sesji.
                await supabaseAuth.auth.signOut();
            }
        },
    ];

    await Promise.all(healthChecks.map(check => check()));

    const hasErrors = Object.keys(errors).length > 0;
    const status = hasErrors ? 500 : 200;

    return NextResponse.json({
        status: hasErrors ? 'error' : 'ok',
        ...(hasErrors && { errors }),
    }, { status });
}