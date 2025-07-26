import PolicyView from '@/components/policies/policies';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Obowiązek informacyjny RODO',
    description: 'Strona opisująca obowiązek informacyjny RODO',
    keywords: [
        'RODO',
        'AKNETH Studio',
        'Obowiązek informacyjny',
        'Obowiązek informacyjny RODO'
    ],
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/policies/rodo`,
    }
};

export default function RodoPage() {
    return <PolicyView filename="rodo.md" />;
}