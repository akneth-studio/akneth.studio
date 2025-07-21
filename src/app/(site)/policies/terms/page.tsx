import PolicyView from '@/components/policies';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Regulamin',
    description: 'Regulamin świadczenia usług za pomocą serwisu',
    keywords: [
        'Regulamin',
        'AKNETH Studio',
        'Regulamin świadczenia usług',
        'Regulamin serwisu'
    ],
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/policies/terms`,
    }
};

export default function TermsPage() {
    return <PolicyView filename="terms.md" />;
}