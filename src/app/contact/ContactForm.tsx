'use client'

import { useState } from 'react';
import styles from '@/styles/ContactForm.module.scss';
import Popup from '@/components/Popup';
import CTAButton from '@/components/CTAButton';
import { Form, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
// Import reCAPTCHA jeśli używasz np. react-google-recaptcha
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';


type ContactFormFields = {
    name: string;
    company: string;
    email: string;
    subject: string;
    message: string;
};

type ContactFormErrorKeys = keyof ContactFormFields | 'submit';
type ContactFormErrors = Partial<Record<ContactFormErrorKeys, string>>;

export function ContactForm() {
    // Hook do reCAPTCHA
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [form, setForm] = useState<ContactFormFields>({
        name: '',
        company: '',
        email: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState<ContactFormErrors>({});
    const [consent, setConsent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState<'success' | 'error'>('success');
    const [popupMessage, setPopupMessage] = useState('');

    // Obsługa zmiany pól
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setConsent(checked);

            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                // Usuwaj błąd, jeśli checkbox został zaznaczony
                if (checked) {
                    delete newErrors.consent;
                }
                return newErrors;
            });
            return;
        }

        setForm(prev => ({ ...prev, [name]: value }));

        // Walidacja pojedynczego pola na bieżąco
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };

            // Sprawdź aktualizowane pole
            switch (name) {
                case 'name':
                    if (!value.trim()) newErrors.name = 'Imię i nazwisko są wymagane';
                    else delete newErrors.name;
                    break;
                case 'email':
                    if (!value.match(/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/i)) newErrors.email = 'Nieprawidłowy e-mail';
                    else delete newErrors.email;
                    break;
                case 'subject':
                    if (!value.trim()) newErrors.subject = 'Temat jest wymagany';
                    else delete newErrors.subject;
                    break;
                case 'message':
                    if (!value.trim() || value.length < 10) newErrors.message = 'Wiadomość musi mieć min. 10 znaków';
                    else delete newErrors.message;
                    break;
                default:
                    break;
            }

            return newErrors;
        });
    };

    // Walidacja po stronie klienta
    const validate = () => {
        const newErrors: any = {};
        if (!form.name.trim()) newErrors.name = 'Imię i nazwisko są wymagane';
        if (!form.email.match(/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/i)) newErrors.email = 'Nieprawidłowy e-mail';
        if (!form.subject.trim()) newErrors.subject = 'Temat jest wymagany';
        if (!form.message.trim() || form.message.length < 10) newErrors.message = 'Wiadomość musi mieć min. 10 znaków';
        if (!consent) newErrors.consent = 'Musisz wyrazić zgodę na przetwarzanie danych';
        return newErrors;
    };

    // Obsługa wysyłki formularza
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        if (!executeRecaptcha) {
            console.log('Recaptcha not ready');
            return;
        }
        setIsSubmitting(true);

        // Integracja z reCAPTCHA (np. pobierz token i dołącz do payloadu)
        const recaptchaToken = await executeRecaptcha('contact_form_submit');
        // Sprawdź, czy token jest poprawny
        if (!recaptchaToken) {
            setIsSubmitting(false);
            setPopupType('error');
            setPopupMessage('Proszę potwierdzić, że nie jesteś robotem.');
            setShowPopup(true);
            return;
        }

        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                consent,
                recaptchaToken,
            }),
        });
        const data = await res.json();
        console.log('API response:', data);

        setIsSubmitting(false);

        if (res.ok) {
            setPopupType('success');
            setPopupMessage('Dziękujemy za kontakt! Odpowiemy najszybciej jak to możliwe.');
            setShowPopup(true);
            setForm({ name: '', company: '', email: '', subject: '', message: '' });
            setErrors({});
        } else {
            setPopupType('error');
            setPopupMessage('Nie udało się wysłać wiadomości. Spróbuj ponownie.');
            setShowPopup(true);
            setErrors({});
        }
    };

    return (
        <>

            <Form noValidate className={`${styles.form} mb-3`} onSubmit={handleSubmit} aria-label="Formularz kontaktowy">
                <h2 className="mb-4">Formularz kontaktowy</h2>
                <p className="mb-4">Wypełnij formularz, a skontaktujemy się z Tobą jak najszybciej.</p>
                <Row>
                    <Col xs={12} md={6}>
                        <Form.Floating className="mb-3">
                            <Form.Control
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Imię i nazwisko"
                                value={form.name}
                                onChange={handleChange}
                                required
                                isInvalid={!!errors.name}
                            />
                            <label htmlFor="name">Imię i nazwisko*</label>
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </Form.Floating>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Floating className="mb-3">
                            <Form.Control
                                id="company"
                                name="company"
                                type="text"
                                placeholder="Firma"
                                value={form.company}
                                onChange={handleChange}
                            />
                            <label htmlFor="company">Firma</label>
                        </Form.Floating>
                    </Col>
                </Row>
                <Form.Floating className="mb-3">
                    <Form.Control
                        id="email"
                        name="email"
                        type="email"
                        placeholder="E-mail"
                        value={form.email}
                        onChange={handleChange}
                        required
                        isInvalid={!!errors.email}
                    />
                    <label htmlFor="email">E-mail*</label>
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Floating>
                <Form.Floating className="mb-3">
                    <Form.Control
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="Temat"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        isInvalid={!!errors.subject}
                    />
                    <label htmlFor="subject">Temat*</label>
                    <Form.Control.Feedback type="invalid">{errors.subject}</Form.Control.Feedback>
                </Form.Floating>
                <Form.Floating className="mb-3">
                    <Form.Control
                        as="textarea"
                        id="message"
                        name="message"
                        placeholder="Treść wiadomości"
                        value={form.message}
                        onChange={handleChange}
                        style={{ height: '120px' }}
                        required
                        minLength={10}
                        isInvalid={!!errors.message}
                    />
                    <label htmlFor="message">Treść wiadomości*</label>
                    <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                </Form.Floating>
                <Form.Group className='my-3'>
                    <Form.Check
                        required
                        type='checkbox'
                        id='consent'
                        label={
                            <>
                                Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z <Link href="/policies/privacy" target="_blank" rel="noopener noreferrer">Polityką prywatności</Link>.
                            </>
                        }
                        checked={consent}
                        onChange={handleChange}
                        isInvalid={!!errors.consent}
                        feedback={errors.consent}
                    />
                </Form.Group>
                <div className="d-flex justify-content-end">
                    <CTAButton
                        type="submit"
                        text={isSubmitting ? 'Wysyłanie...' : 'Wyślij wiadomość'}
                        variant="primary"
                        disabled={isSubmitting}
                    />
                </div>
            </Form>
            {showPopup && <Popup message={popupMessage} show={showPopup} onClose={() => setShowPopup(false)} type={popupType} />}
        </>

    );
}

export default function ContactFormWrapper() {
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!recaptchaSiteKey) {
        return (
            <>
                <div className="alert alert-danger text-center my-4" role="alert">
                    Błąd konfiguracji reCAPTCHA. Skontaktuj się z administratorem strony.
                </div>
            </>
        );
    } else {
        return (
            <>
                <GoogleReCaptchaProvider
                    reCaptchaKey={recaptchaSiteKey!}
                    scriptProps={{
                        async: true,
                        defer: true,
                        appendTo: "head",
                        nonce: undefined,
                    }}
                >
                    <ContactForm />
                </GoogleReCaptchaProvider>
            </>
        )
    }
}