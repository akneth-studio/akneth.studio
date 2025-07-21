import PolicyView from '@/components/policies/policies';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const policiesConfig = {
  terms: {
    filename: 'terms.md',
    title: 'Regulamin',
    description: 'Regulamin świadczenia usług za pomocą serwisu',
    keywords: ['Regulamin', 'AKNETH Studio', 'Regulamin świadczenia usług', 'Regulamin serwisu'],
  },
  privacy: {
    filename: 'privacy.md',
    title: 'Polityka prywatności',
    description: 'Polityka prywatności AKNETH Studio Katarzyna Pawłowska-Malesa',
    keywords: ['Polityka prywatności', 'Prywatność', 'Przetwarzanie danych', 'Cookies', 'Ciasteczka', 'Bezpieczeństwo danych'],
  },
  rodo: {
    filename: 'rodo.md',
    title: 'Obowiązek informacyjny RODO',
    description: 'Strona opisująca obowiązek informacyjny RODO',
    keywords: ['RODO', 'AKNETH Studio', 'Obowiązek informacyjny', 'Obowiązek informacyjny RODO'],
  },
};

type Props = {
  params: {
    slug: keyof typeof policiesConfig;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const policy = policiesConfig[slug];

  if (!policy) {
    return notFound();
  }

  return {
    title: policy.title,
    description: policy.description,
    keywords: policy.keywords,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/policies/${slug}`,
    },
  };
}

export default async function PolicyPage({ params }: Props) {
  const slug = params.slug;
  const policy = policiesConfig[slug];

  if (!policy) {
    return notFound();
  }

  return <PolicyView filename={policy.filename} />;
}

export async function generateStaticParams() {
  return Object.keys(policiesConfig).map((slug) => ({
    slug,
  }));
}