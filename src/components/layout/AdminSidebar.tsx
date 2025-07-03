'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import { BsPerson } from 'react-icons/bs'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminSidebar() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [displayName, setDisplayName] = useState<string>('')

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
            setDisplayName(data.user?.user_metadata?.display_name || '')
        })
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }
    return (
        <aside className="admin-sidebar p-3 d-flex flex-column">
            <div>
                <div className="logo mb-4">
                    {/* Możesz wstawić tu logo z /public lub SVG */}
                    <Image src="/img/logo_revert.svg" alt="AKNETH Studio" width={125} height={100}/>
                </div>
                <nav>
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link href="/admin" className="nav-link">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/messages" className="nav-link">Wiadomości</Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/admin/content" className="nav-link">Treści</Link>
                        </li>
                        {/* Dodaj kolejne sekcje panelu */}

                    </ul>

                </nav>
            </div>
            {/* Sekcja na dole sidebara */}
            {user && (
                <div className="mt-auto pt-4 border-top">
                    <Link href="/admin/account" className="nav-link mb-2" aria-label={displayName || 'Twoje konto'} title='Ustawienia konta'>
                        <BsPerson className='me-2' />
                        {displayName || 'Twoje konto'}
                    </Link>
                    <button onClick={handleLogout} className="btn btn-outline-secondary w-100">
                        Wyloguj się
                    </button>
                </div>
            )}
        </aside>
    )
}