import { getTranslations } from 'next-intl/server';

type Props = {
  locale: string;
};

export async function StructuredData({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'landing' });

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Parent Stories',
    description: t('subtitle'),
    url: 'https://ask-parents-25-questions.vercel.app',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Plan',
        price: '0',
        priceCurrency: 'USD',
        description: '25 curated questions to capture your parents\' stories',
      },
      {
        '@type': 'Offer',
        name: 'Premium Plan',
        price: '9.99',
        priceCurrency: 'USD',
        description: '100 questions plus custom question feature',
      },
    ],
    creator: {
      '@type': 'Organization',
      name: 'Parent Stories',
      email: 'askparents25questions@gmail.com',
    },
  };

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [1, 2, 3, 4, 5].map((num) => ({
      '@type': 'Question',
      name: t(`faq.q${num}.question`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`faq.q${num}.answer`),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
    </>
  );
}
