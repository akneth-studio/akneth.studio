'use client'
import { useEffect } from 'react'
import { useRouter, notFound } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'

export default function AuthCallback() {
    const router = useRouter()
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                notFound()
                return
            }
            const res = await fetch('/api/check-admin', { credentials: 'include' })
            if (!res.ok) {
                notFound()
                return
            }
            const { allowed } = await res.json()
            if (allowed) {
                router.replace('/admin')
            } else {
                notFound()
            }
        }
        checkUser()
    }, [router])
    return (
        <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span>Logowanie...</span>
        </div>
    )
}
