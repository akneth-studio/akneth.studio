'use client'
import { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import Spinner from 'react-bootstrap/Spinner';

interface AuthProps {
    children: ReactNode;
}

export default function Auth({ children }: AuthProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser()
                if (error) {
                    console.error('Auth check failed:', error)
                    router.push('/admin/login')
                    return
                }
                if (!user) {
                    router.push('/admin/login')
                } else {
                    setLoading(false)
                }
            } catch (error) {
                console.error('Auth check error:', error)
                router.push('/admin/login')
            }
        }
        checkAuth()
    }, [router])
    if (loading) return <div className="text-center py-5"><Spinner as='span' variant='dark' aria-hidden="true" animation="border" size='sm' className='me-2'/>Ładowanie...</div>
    return <>{children}</>;
}