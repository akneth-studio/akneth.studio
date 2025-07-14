'use client'

import CTAButton from '@/components/CTAButton'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import Summary from '@/components/admin/Summary'

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [displayName, setDisplayName] = useState<string>('');

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
            setDisplayName(data.user?.user_metadata?.display_name || '')
        })
    }, [])

    const username = () => {
        if (user) return displayName;
        return 'Użytkowniku';
    };

    return (
        <>
            <h1 className='text-center'>PANEL ADMINA</h1>
            <div className='text-center'>
                Witaj, <span className='fw-bold'>{username()}</span>!
            </div>
            {/* Tutaj Twój panel admina */}
            {!user ? (
                <div className='align-items-center'>
                    <h2 className='text-center'>Panel admina – dostęp tylko po zalogowaniu.</h2>
                    <div className='text-center'>
                        <CTAButton
                            type='button'
                            text='Zaloguj się'
                            variant='outline-primary'
                            to='/admin/login'
                            size='lg'
                            className='m-2'
                        />
                        <CTAButton
                            type='button'
                            text='Strona główna'
                            variant='primary'
                            to='/'
                            size='lg'
                            className='m-2'
                        />
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className='text-center'>Jesteś zalogowany jako admin.</h2>
                    {/* Tu możesz dodać inne elementy widoczne tylko dla zalogowanych */}
                    <Summary />
                </div>
            )}
        </>

    )
}
