'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'
import { BsPerson, BsColumnsGap, BsBlockquoteLeft, BsBoxArrowLeft, BsHouse, BsBoxArrowInRight, BsChatRightText, BsAirplane } from 'react-icons/bs'
import { Nav, Dropdown, ButtonGroup, Button } from 'react-bootstrap'
import { BiSolidUserAccount } from 'react-icons/bi'

const adminNav = [
    {
        href: '/admin',
        label: 'Home',
        icon: BsHouse,
    },
    {
        href: '/admin/dashboard',
        label: 'Dashboard',
        icon: BsColumnsGap,
    },
    {
        href: '/admin/messages',
        label: 'Contact Form',
        icon: BsChatRightText,
    },
    {
        href: '/admin/content',
        label: 'Treści',
        icon: BsBlockquoteLeft,
    },
    {
        href: '/admin/vacation',
        label: 'Bannery',
        icon: BsAirplane,
    },
    {
        href: '/admin/account',
        label: 'Konto',
        icon: BiSolidUserAccount,
    }
]

const sideImage = [
    {
        id: 'desktop-logo',
        src: '/img/logo_akneth_w.svg',
        alt: undefined,
        width: 200,
        height: 100,
        class: 'd-none d-md-block'
    },
    {
        id: 'mobile-logo',
        src: '/img/logo_revert.svg',
        alt: undefined,
        width: 50,
        height: 50,
        class: 'd-block d-md-none'
    }
]

export default function AdminSidebar() {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [displayName, setDisplayName] = useState<string>('')
    const [unreadCount, setUnreadCount] = useState<number>(0)

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
            setDisplayName(data.user?.user_metadata?.display_name || '')
        })
    }, [setUser, setDisplayName])

    useEffect(() => {
        supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('is_read', false)
            .then(({ count }) => setUnreadCount(count || 0))
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }
    return (
        <>
            <aside className="admin-sidebar p-3 d-flex flex-column flex-shrink-0">
                <div>
                    <div className="logo mb-2">
                        {/* Możesz wstawić tu logo z /public lub SVG */}
                        {sideImage.map(item => (
                            <Image
                                key={item.id}
                                src={item.src}
                                alt={typeof item.alt === 'string' ? item.alt : 'AKNETH Studio'}
                                width={item.width}
                                height={item.height}
                                className={item.class}
                            />
                        ))}
                    </div>
                    <hr />
                    <Nav as='ul' className='flex-column'>
                        {adminNav.map(item => {
                            const Icon = item.icon
                            return (
                                <Nav.Item as='li' key={item.href}>
                                    <Nav.Link as={Link} href={item.href} className='d-flex align-items-center'>
                                        <Icon className='me-2' />
                                        <span className='sidelabel'>{item.label}</span>
                                        {item.href === '/admin/messages' && unreadCount > 0 && (
                                            <span className="badge bg-danger ms-2">{unreadCount}</span>
                                        )}
                                    </Nav.Link>
                                </Nav.Item>
                            )
                        })}
                    </Nav>
                </div>
                {/* Sekcja na dole sidebara */}

                <div className="mt-auto pt-4">
                    <hr />
                    {user ? (
                        <Dropdown
                            align='end'
                            as={ButtonGroup}
                        >
                            <Dropdown.Toggle
                                variant='outline-secondary'
                                className='w-100 d-flex align-items-center'
                                id='dropdown-account'
                            >
                                <BiSolidUserAccount className='me-md-2' />
                                <span className='sidelabel'>
                                    {displayName || 'Twoje konto'}
                                </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    as={ButtonGroup}
                                    onClick={() => router.push('/admin/account')}
                                    className='btn d-flex align-items-center'
                                >
                                    <BsPerson className="me-2" />
                                    Konto
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item
                                    as='button'
                                    className='d-flex align-items-center'
                                    onClick={handleLogout}
                                >
                                    <BsBoxArrowLeft className='me-2' />
                                    Wyloguj się
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Button
                            className='w-100 d-flex align-items-center justify-content-center'
                            variant='outline-secondary'
                            style={{ cursor: 'pointer' }}
                            onClick={() => router.push('/admin/login')}
                        >
                            <BsBoxArrowInRight className='me-md-2' />
                            <span className='sidelabel'>Zaloguj się</span>
                        </Button>
                    )}
                </div>
            </aside>
        </>
    )
}