'use client';

import { useState, useEffect } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';

const FAILED_ATTEMPTS_KEY = 'loginFailedAttempts';
const MAX_ATTEMPTS = 2;

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Funkcja do obsługi nieudanej próby logowania
  const handleFailedLoginAttempt = () => {
    const attempts = parseInt(sessionStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10) + 1;
    sessionStorage.setItem(FAILED_ATTEMPTS_KEY, attempts.toString());
    if (attempts >= MAX_ATTEMPTS) {
      notFound();
    }
  };

  // Sprawdzanie licznika przy ładowaniu komponentu
  useEffect(() => {
    const attempts = parseInt(sessionStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10);
    if (attempts >= MAX_ATTEMPTS) {
      notFound();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await supabase.auth.signInWithPassword({ email, password });
    const error = result?.error;
    if (error) {
      setError(error.message);
      handleFailedLoginAttempt();
    } else {
      sessionStorage.removeItem(FAILED_ATTEMPTS_KEY); // Reset licznika
      router.push('/admin');
    }
  };

  const handleGoogleLogin = async () => {
    const result = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth`,
      },
    });
    const error = result?.error;
    if (error) {
        setError(error.message);
        handleFailedLoginAttempt();
    }
  };

  // Nasłuchiwanie na błędy autoryzacji po powrocie z Google
  useEffect(() => {
    const authStateChange = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // W Supabase Auth masz listę autoryzowanych użytkowników.
        // Jeśli ktoś zaloguje się przez Google, a jego e-mail nie jest na liście
        // użytkowników w Twoim projekcie Supabase, to sesja i tak nie zostanie w pełni utworzona.
        // Poniższy kod sprawdza, czy po zalogowaniu na pewno jesteśmy w panelu admina.
        // Jeśli nie, to znaczy, że autoryzacja się nie powiodła.
        setTimeout(() => {
            if (window.location.pathname.includes('/login')) {
                setError('Użytkownik nieautoryzowany.');
                handleFailedLoginAttempt();
                supabase.auth.signOut();
            }
        }, 1000)
      }
    });

    if (authStateChange && authStateChange.data && authStateChange.data.subscription) {
      return () => {
        authStateChange.data.subscription.unsubscribe();
      };
    }
    return undefined;
  }, []);

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
  );
}
