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
    const [firstLine, ...restContent] = withVars.split('\n');
    const h1Text = firstLine.replace(/^# /, '');
    const bodyContent = restContent.join('\n');

    return <PolicyContent h1Text={h1Text} content={bodyContent} lastUpdated={lastUpdated} />;
}