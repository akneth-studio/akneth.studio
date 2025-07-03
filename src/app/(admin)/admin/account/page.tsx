'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'

export default function Account() {
    const [setUser] = useState<any>(null)
    const [displayName, setDisplayName] = useState('')
    const [newDisplayName, setNewDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
            setEmail(data.user?.email || '')
            setDisplayName(data.user?.user_metadata?.display_name || '')
        })
    }, [])

    // Zmiana e-maila
    const handleChangeEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage('')
        setError('')
        if (!newEmail || newEmail === email) {
            setError('Podaj nowy adres e-mail.')
            return
        }
        const { error } = await supabase.auth.updateUser({ email: newEmail })
        if (error) setError(error.message)
        else setMessage('E-mail został zmieniony. Sprawdź skrzynkę pocztową, by potwierdzić zmianę.')
    }

    // Zmiana hasła
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage('')
        setError('')
        if (password.length < 8) {
            setError('Hasło musi mieć co najmniej 8 znaków.')
            return
        }
        if (password !== confirm) {
            setError('Hasła muszą być identyczne.')
            return
        }
        const { error } = await supabase.auth.updateUser({ password })
        if (error) setError(error.message)
        else setMessage('Hasło zostało zmienione.')
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage('')
        setError('')
        if (!newDisplayName.trim()) {
            setError('Podaj nazwę konta.')
            return
        }
        const { error } = await supabase.auth.updateUser({ data: { display_name: newDisplayName } })
        if (error) setError('Błąd zapisu: ' + error.message)
        else {
            setMessage('Nazwa konta została zaktualizowana.')
            setDisplayName(newDisplayName)
            setNewDisplayName('')
        }
    }

    return (
        <>
            <Container className="py-5" style={{ maxWidth: 480 }}>
                <h2 className="mb-4 text-center">Moje konto</h2>
                <div className="mb-4">
                    <p><strong>E-mail:</strong> {email}</p>
                    <p><strong>Nazwa konta:</strong> {displayName}</p>
                </div>

                <Form onSubmit={handleSave} className="mb-4" >
                    <Form.Label>Twoja nazwa konta</Form.Label>
                    <Form.Control
                        type="text"
                        value={newDisplayName}
                        onChange={e => setNewDisplayName(e.target.value)}
                        placeholder="Imię i nazwisko lub pseudonim"
                        required
                    />
                    <Button type="submit" variant="primary" className="mt-3 w-100">
                        Zapisz nazwę konta
                    </Button>
                </Form>

                <Form onSubmit={handleChangeEmail} className="mb-4">
                    <Form.Label>Nowy e-mail</Form.Label>
                    <Form.Control
                        type="email"
                        value={newEmail}
                        onChange={e => setNewEmail(e.target.value)}
                        placeholder="Podaj nowy e-mail"
                    />
                    <Button type="submit" variant="primary" className="mt-2 w-100">
                        Zmień e-mail
                    </Button>
                </Form>

                <Form onSubmit={handleChangePassword} className="mb-4">
                    <Form.Label>Nowe hasło</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Nowe hasło"
                        minLength={8}
                    />
                    <Form.Label className="mt-2">Powtórz hasło</Form.Label>
                    <Form.Control
                        type="password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        placeholder="Powtórz nowe hasło"
                        minLength={8}
                    />
                    <Button type="submit" variant="primary" className="mt-2 w-100">
                        Zmień hasło
                    </Button>
                </Form>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
            </Container>
        </>
    )
}
