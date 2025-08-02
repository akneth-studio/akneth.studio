'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Table } from 'react-bootstrap'
import Auth from '@/components/admin/auth'
import CTAButton from '@/components/CTAButton'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Message = {
    id: string;
    name: string | null;
    company: string | null;
    email: string | null;
    subject: string | null;
    created_at: string;
    replied: boolean;
    is_read: boolean;
};

export default function MessagesList() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        supabase
            .from('messages')
            .select('id, name, company, email, subject, created_at, replied, is_read')
            .order('created_at', { ascending: false })
            .then(({ data }) => setMessages(data as Message[] || []));
    }, []);

    const handleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const markAsRead = async () => {
        if (selectedIds.length === 0) return;
        await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', selectedIds);
        // odśwież listę wiadomości po zmianie
        const { data } = await supabase
            .from('messages')
            .select('id, name, company, email, subject, created_at, replied, is_read')
            .order('created_at', { ascending: false });
        setMessages(data || []);
        setSelectedIds([]);
    };
    
    return (
        <>
            <Auth>
                <section className='messg'>
                    <h1 className="mb-4">Wszystkie wiadomości</h1>
                    {(!messages || messages.length === 0) ? (
                        <div className="alert alert-info">Brak wiadomości.</div>
                    ) : (
                        <>
                            <CTAButton
                                type="button"
                                text="Oznacz jako przeczytane"
                                variant="success"
                                className="mb-3"
                                onClick={markAsRead}
                                size='sm'
                                disabled={selectedIds.length === 0}
                            />
                            <Table responsive hover striped className='align-middle'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th></th>
                                        <th>Data</th>
                                        <th>Imię i nazwisko</th>
                                        <th>Firma</th>
                                        <th>E-mail</th>
                                        <th>Temat</th>
                                        <th>Odpowiedziano?</th>
                                        <th>Akcje</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.map(msg => (
                                        <tr key={msg.id}>
                                            <td>{msg.id}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    data-testid={`message-checkbox-${msg.id}`}
                                                    checked={selectedIds.includes(msg.id)}
                                                    onChange={() => handleSelect(msg.id)}
                                                />
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {msg.created_at
                                                    ? new Date(msg.created_at).toLocaleString('pl-PL', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                    : '—'}
                                            </td>
                                            <td>{msg.name || <span className="text-muted">—</span>}</td>
                                            <td>{msg.company || <span className="text-muted">—</span>}</td>
                                            <td>
                                                {msg.email ? (
                                                    <a href={`mailto:${msg.email}`}>{msg.email}</a>
                                                ) : (
                                                    <span className="text-muted">—</span>
                                                )}
                                            </td>
                                            <td>{msg.subject || <span className="text-muted">—</span>}</td>
                                            <td className='text-center'>
                                                {msg.replied
                                                    ? <span className="badge bg-success">Tak</span>
                                                    : <span className="badge bg-danger">Nie</span>
                                                }
                                            </td>
                                            <td>
                                                <Link href={`/admin/messages/${msg.id}`} className="btn btn-sm btn-outline-primary">
                                                    Podgląd / Odpowiedz
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}
                </section>
            </Auth>
        </>
    )
}

