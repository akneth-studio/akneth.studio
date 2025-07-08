'use client'
import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import BackButton from '@/components/admin/BackButton'
import Popup from '../Popup'

type Message = {
    id: string,
    name?: string,
    company?: string,
    email?: string,
    subject?: string,
    message?: string,
    created_at?: string,
    replied?: boolean,
    reply_text?: string,
    captcha_score?: number | string
}

export default function ReplyForm({ msg }: { msg: Message }) {
    const [reply, setReply] = useState(msg.reply_text || '')
    const [loading, setLoading] = useState(false)
    const [popup, setPopup] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
        show: false,
        type: 'success',
        message: ''
    });



    const basedata: { label: string; value: React.ReactNode }[] = [
        { label: 'Data', value: msg.created_at ? new Date(msg.created_at).toLocaleString('pl-PL') : '—' },
        { label: 'Imię i nazwisko', value: msg.name || <span className="text-muted">—</span> },
        { label: 'Firma', value: msg.company || <span className="text-muted">—</span> },
        {
            label: 'E-mail', value: msg.email
                ? <a href={`mailto:${msg.email}`}>{msg.email}</a>
                : <span className="text-muted">—</span>
        },
        { label: 'Temat', value: msg.subject || <span className="text-muted">—</span> },
        {
            label: 'Treść', value: msg.message
                ? <span style={{ whiteSpace: 'pre-line' }}>{msg.message}</span>
                : <span className="text-muted">—</span>
        },
        { label: 'reCaptcha score', value: msg.captcha_score ?? <span className="text-muted">—</span> },
    ]


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 1. Zapisz odpowiedź do bazy
            const saveRes = await fetch('/api/save-reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id: msg.id, reply }),
            });
            const saveData = await saveRes.json();
            if (!saveRes.ok || saveData.error) throw new Error('Błąd zapisu');

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
            });
            const emailData = await emailRes.json();
            if (!emailRes.ok || !emailData.success) throw new Error('Błąd wysyłki');

            setPopup({
                show: true,
                type: 'success',
                message: 'Odpowiedź została wysłana i zapisana.'
            });
        } catch (err) {
            setPopup({
                show: true,
                type: 'error',
                message: 'Błąd wysyłki lub zapisu.'
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <BackButton className="btn btn-outline-secondary mb-4" />
            <h1 className="mb-4">Szczegóły wiadomości</h1>
            <dl className="row">
                {basedata.map(({ label, value }) => (
                    <React.Fragment key={label}>
                        <dt className='col-sm-3'>{label}</dt>
                        <dd className='col-sm-9'>{value}</dd>
                    </React.Fragment>
                ))}
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
            </Form>
            <Popup
                show={popup.show}
                type={popup.type}
                message={popup.message}
                onClose={() => setPopup(p => ({ ...p, show: false }))}
            />
        </>
    )
}
