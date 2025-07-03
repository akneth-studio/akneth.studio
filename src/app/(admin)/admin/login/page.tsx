'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import { Container, Form, Row, Col, Button } from 'react-bootstrap'

const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: typeof window !== 'undefined'
                ? `${window.location.origin}/admin`
                : undefined,
        }
    })
}

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError(error.message)
        else router.push('/admin')
    }

    return (
        <>
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <Form onSubmit={handleLogin} className="p-4 rounded shadow bg-white" style={{ minWidth: 340, maxWidth: 400, width: '100%' }}>
                    <h2 className="mb-4 text-center">Logowanie do panelu admina</h2>
                    <Form.Group as={Row} className="mb-3" controlId="adminEmail">
                        <Form.Label column sm={4}>E-mail</Form.Label>
                        <Col sm={8}>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoFocus
                                placeholder="Wpisz e-mail"
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="adminPassword">
                        <Form.Label column sm={4}>Hasło</Form.Label>
                        <Col sm={8}>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                placeholder="Wpisz hasło"
                            />
                        </Col>
                    </Form.Group>
                    {error && <div className="alert alert-danger py-2">{error}</div>}
                    <Button type="submit" variant="primary" className="w-100 mt-2">
                        Zaloguj się
                    </Button>
                    <Button
                        variant="outline-danger"
                        className="w-100 mt-3"
                        onClick={handleGoogleLogin}
                        type="button"
                    >
                        Zaloguj przez Google
                    </Button>
                </Form>
            </Container>
        </>
    )
}
