import Link from 'next/link';
import { Table } from 'react-bootstrap';
import { supabase } from '@/utils/supabase/client';

export default async function MessagesPreview() {
    const { data: messages, error } = await supabase
        .from('messages')
        .select('id, name, company, email, subject, message, created_at, replied, reply_text')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        return <div className="alert alert-danger">Błąd ładowania wiadomości: {error.message}</div>;
    }

    return (
        <>
            <section className='messg'>
                <h2 className="mb-4">Wiadomości z formularza kontaktowego</h2>
                {(!messages || messages.length === 0) ? (
                    <div className="alert alert-info">Brak wiadomości.</div>
                ) : (
                    <Table striped responsive className='align-middle'>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Imię i nazwisko</th>
                                <th>Firma</th>
                                <th>E-mail</th>
                                <th>Temat</th>
                                <th>Odpowiedziano?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(msg => (
                                <tr key={msg.id}>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        {msg.created_at
                                            ? new Date(msg.created_at).toLocaleString('pl-PL', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                timeZone: 'Europe/Warsaw'
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
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
                <div className="text-end mt-3">
                    <Link href="/admin/messages" className="btn btn-outline-primary">
                        Więcej &rarr;
                    </Link>
                </div>
            </section>
        </>
    );
}
