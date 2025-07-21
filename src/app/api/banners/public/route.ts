import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
    const now = new Date().toISOString();

    // Pobierz tylko widoczne i aktualne banery
    const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('visible', true)
        .lte('announce_from', now)
        .gte('date_end', now);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}