import { createClient } from '@supabase/supabase-js'
import Link from 'next/link';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Dashboard() {
    const { data: messages, error } = await supabase
        .from('messages')
        .select('id, name, company, email, subject, message, created_at, replied, reply_text')
        .order('created_at', { ascending: false })
        .limit(5)

    if (error) {
        return <div className="alert alert-danger">Błąd ładowania wiadomości: {error.message}</div>
    }

    return (
        <section className='messg'>
            <h2 className="mb-4">Wiadomości z formularza kontaktowego</h2>
            {(!messages || messages.length === 0) ? (
                <div className="alert alert-info">Brak wiadomości.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Imię i nazwisko</th>
                                <th>Firma</th>
                                <th>E-mail</th>
                                <th>Temat</th>
                                <th>Treść</th>
                                <th>Odpowiedziano?</th>
                                <th>Treść odpowiedzi</th>
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
                                    <td style={{ maxWidth: 320, whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                                        {msg.message || <span className="text-muted">—</span>}
                                    </td>
                                    <td>
                                        {msg.replied
                                            ? <span className="badge bg-success">Tak</span>
                                            : <span className="badge bg-secondary">Nie</span>
                                        }
                                    </td>
                                    <td style={{ maxWidth: 320, whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                                        {msg.reply_text || <span className="text-muted">—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="text-end mt-3">
                <Link href="/admin/messages" className="btn btn-outline-primary">
                    Więcej &rarr;
                </Link>
            </div>
        </section>
    )
}
