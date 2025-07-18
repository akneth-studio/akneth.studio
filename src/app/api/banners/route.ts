import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order("date_start", { ascending: false });
    if (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch banners' }), { status: 500 });
    }
    return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { mode, announce_from, date_start, date_end, visible } = body;
    const { error } = await supabase
        .from('banners')
        .insert({
            mode, announce_from, date_start, date_end, visible
        });
    if (error) return new Response(JSON.stringify({ error }), { status: 500 });
    return new Response(JSON.stringify({ success: true }), { status: 201 });
}

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { id, ...fields } = body;
    const { error } = await supabase
        .from('banners')
        .update({
            ...fields
        })
        .eq('id', id);
    if (error) return new Response(JSON.stringify({ error }), { status: 500 });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export async function DELETE(request: NextRequest) {
    const { id } = await request.json();
    const { error } = await supabase
        .from("banners")
        .delete()
        .eq("id", id);
    if (error) return new Response(JSON.stringify({ error }), { status: 500 });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
}