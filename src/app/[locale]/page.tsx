import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations('landing');

  return (
    <div className="min-h-screen">
      <header className="absolute top-0 right-0 p-4">
        <LanguageSwitcher />
      </header>
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-xl text-gray-600 mb-8 text-center max-w-xl">
          {t('subtitle')}
        </p>
        <button className="bg-olive-500 hover:bg-olive-600 text-white font-medium py-3 px-8 rounded-lg transition-colors">
          {t('cta')}
        </button>
      </main>
    </div>
  );
}
