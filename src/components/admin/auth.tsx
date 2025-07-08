'use client'
import { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js';
import Spinner from 'react-bootstrap/Spinner';

interface AuthProps {
    children: ReactNode;
}

export default function Auth({ children }: AuthProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                router.push('/admin/login')
            } else {
                setUser(user)
                setLoading(false)
            }
        })
    }, [router])

    if (loading) return <div className="text-center py-5"><Spinner as='span' variant='dark' aria-hidden="true" animation="border" className='me-1'/>Ładowanie...</div>
    return <>{children}</>;
}