'use client'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

type Message = {
    id: string,
    name?: string,
    company?: string,
    email?: string,
    subject?: string,
    message?: string,
    created_at?: string,
    replied?: boolean,
    reply_text?: string
}

export default function ReplyForm({ msg }: { msg: Message }) {
    const [reply, setReply] = useState(msg.reply_text || '')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'ok' | 'err' | ''>('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setStatus('')

        // 1. Zapisz odpowiedź do bazy
        const { error } = await fetch('/api/save-reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id: msg.id, reply }),
        }).then(res => res.json())

        if (error) {
            setStatus('err')
            setLoading(false)
            return
        }

        // 2. Wyślij maila do klienta
        const emailRes = await fetch('/api/send-reply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: msg.email,
                subject: msg.subject,
                reply,
                name: msg.name,
            }),
        }).then(res => res.json())

        if (emailRes.success) setStatus('ok')
        else setStatus('err')
        setLoading(false)
    }

    return (
        <>
            <h1 className="mb-4">Szczegóły wiadomości</h1>
            <dl className="row">
                <dt className="col-sm-3">Data</dt>
                <dd className="col-sm-9">{msg.created_at ? new Date(msg.created_at).toLocaleString('pl-PL') : '—'}</dd>
                <dt className="col-sm-3">Imię i nazwisko</dt>
                <dd className="col-sm-9">{msg.name || <span className="text-muted">—</span>}</dd>
                <dt className="col-sm-3">Firma</dt>
                <dd className="col-sm-9">{msg.company || <span className="text-muted">—</span>}</dd>
                <dt className="col-sm-3">E-mail</dt>
                <dd className="col-sm-9">
                    {msg.email ? <a href={`mailto:${msg.email}`}>{msg.email}</a> : <span className="text-muted">—</span>}
                </dd>
                <dt className="col-sm-3">Temat</dt>
                <dd className="col-sm-9">{msg.subject || <span className="text-muted">—</span>}</dd>
                <dt className="col-sm-3">Treść</dt>
                <dd className="col-sm-9" style={{ whiteSpace: 'pre-line' }}>{msg.message || <span className="text-muted">—</span>}</dd>
            </dl>
            <Form onSubmit={handleSubmit} className="mt-4">
                <Form.Group>
                    <Form.Label>Odpowiedź do klienta</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        value={reply}
                        onChange={e => setReply(e.target.value)}
                        placeholder="Wpisz treść odpowiedzi"
                        required
                        disabled={loading}
                    />
                </Form.Group>

                {/* PODGLĄD WIADOMOŚCI */}
                <div
                    className="mt-3 p-3 border rounded bg-light"
                    dangerouslySetInnerHTML={{
                        __html: `
      <div style="color:#555;font-size:1em;">
        <strong>Podgląd odpowiedzi:</strong><br>
        <br>
        Dzień dobry${msg.name ? `, ${msg.name}` : ''}!<br><br>
        ${reply.replace(/\n/g, '<br>')}<br><br>
        Pozdrawiam,<br>
        <b>AKNETH Studio</b><br>
        Katarzyna Pawłowska-Malesa<br>
        tel: +48 690 973 352<br>
        <a href="https://akneth-studio.vercel.app" target="_blank">https://akneth-studio.vercel.app</a>
      </div>
    `
                    }}
                />

                <Button type="submit" className="mt-2" variant="primary" disabled={loading}>
                    {loading ? 'Wysyłanie...' : 'Wyślij odpowiedź'}
                </Button>
                {status === 'ok' && <div className="alert alert-success mt-3">Odpowiedź została wysłana i zapisana.</div>}
                {status === 'err' && <div className="alert alert-danger mt-3">Błąd wysyłki lub zapisu.</div>}
            </Form>
        </>
    )
}
