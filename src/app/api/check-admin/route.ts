import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ALLOWED_ADMINS = process.env.ALLOWED_ADMINS?.split(',').map(e => e.trim().toLowerCase()) || []

export async function GET(request: NextRequest) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { global: { headers: { cookie: request.cookies.toString() } } }
    )
    const { data: { user } } = await supabase.auth.getUser()
    if (user && user.email && ALLOWED_ADMINS.includes(user.email.toLowerCase())) {
        return NextResponse.json({ allowed: true })
    }
    return NextResponse.json({ allowed: false }, { status: 403 })
}
