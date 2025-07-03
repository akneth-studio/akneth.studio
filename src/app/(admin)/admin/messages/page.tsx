// app/(admin)/admin/messages/page.tsx
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function MessagesList() {
    const { data: messages } = await supabase
        .from('messages')
        .select('id, name, company, email, subject, created_at, replied')
        .order('created_at', { ascending: false })

    return (
        <section className='messg'>
            <h1 className="mb-4">Wszystkie wiadomości</h1>
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
                                <th>Odpowiedziano?</th>
                                <th>Akcje</th>
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
                                    <td>
                                        {msg.replied
                                            ? <span className="badge bg-success">Tak</span>
                                            : <span className="badge bg-secondary">Nie</span>
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
                    </table>
                </div>
            )}
        </section>
    )
}
