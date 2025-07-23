import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const host = request.headers.get('host') || ''
    // Jeśli host zaczyna się na 'admin.'
    if (host.startsWith('admin.')) {
        // Odcinamy 'admin.' i konstruujemy główny adres domeny
        const mainDomain = host.replace(/^admin\./, '')
        const redirectUrl = `${mainDomain}/admin`
        return NextResponse.redirect(redirectUrl, 308)
    }
    // Dla innych – bez przekierowania
    return NextResponse.next()
}

export const config = {
    matcher: '/:path*' // Działa na każdej trasie
}
