import PolicyView from '@/components/policies';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Polityka prywatności',
    description: 'Polityka prywatności AKNETH Studio Katarzyna Pawłowska-Malesa',
    keywords: [
        'Polityka prywatności',
        'Prywatność',
        'Przetwarzanie danych',
        'Cookies',
        'Ciasteczka',
        'Bezpieczeństwo danych'
    ],
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/policies/privacy`,
    }
};

export default function PrivacyPage() {
    return <PolicyView filename="privacy.md" />;
}