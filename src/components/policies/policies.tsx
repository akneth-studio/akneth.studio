import { fetchPolicyMarkDown } from '@/lib/fetchPolicyMd';
import matter from 'gray-matter';
import PolicyContent from './PolicyContent';

const vars = {
    siteURL: process.env.NEXT_PUBLIC_SITE_URL,
    street: process.env.NEXT_PUBLIC_ADDRESS_STREET,
    city: process.env.NEXT_PUBLIC_ADDRESS_CITY,
    phone: process.env.NEXT_PUBLIC_PHONE,
    mail: process.env.NEXT_PUBLIC_EMAIL
};

function injectVars(content: string, envVars: Record<string, string | undefined>) {
    return Object.entries(envVars).reduce(
        (acc, [key, val]) => acc.replaceAll(`{{${key}}}`, val ?? ''), content
    )
}

interface PolicyViewProps {
    filename: string // e.g. "privacy.md" lub "terms.md"
}

export default async function PolicyView({ filename }: PolicyViewProps) {
    const fileContent = await fetchPolicyMarkDown(filename);
    const { content, data } = matter(fileContent);
    const lastUpdated = data.lastUpdated || 'Nieznana data';
    const withVars = injectVars(content, vars);
    let h1Text: string;
    let bodyContent: string;

    const lines = withVars.split('\n');
    const firstLineIsH1 = lines.length > 0 && lines[0].startsWith('# ');

    if (data.title) {
        h1Text = data.title as string;
        bodyContent = firstLineIsH1 ? lines.slice(1).join('\n') : withVars;
    } else {
        if (firstLineIsH1) {
            h1Text = lines[0].replace(/^# /, '');
            bodyContent = lines.slice(1).join('\n');
        } else {
            h1Text = '';
            bodyContent = withVars;
        }
    }

    return <PolicyContent h1Text={h1Text} content={bodyContent} lastUpdated={lastUpdated} />;
}