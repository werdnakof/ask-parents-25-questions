import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { StructuredData } from '@/components/seo/StructuredData';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('landing');

  return (
    <>
      <StructuredData locale={locale} />
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <span className="text-xl font-semibold text-gray-900">Parent Stories</span>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link
                href={`/${locale}/login`}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                {t('login')}
              </Link>
              <Link
                href={`/${locale}/signup`}
                className="bg-olive-500 hover:bg-olive-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {t('getStarted')}
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
            <Link
              href={`/${locale}/signup`}
              className="inline-block bg-olive-500 hover:bg-olive-600 text-white font-medium py-4 px-8 rounded-lg transition-colors text-lg"
            >
              {t('cta')}
            </Link>
            <p className="mt-4 text-sm text-gray-500">{t('freeToStart')}</p>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t('howItWorks.title')}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="text-center">
                  <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-olive-600">{step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t(`howItWorks.step${step}.title`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`howItWorks.step${step}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample Questions Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              {t('sampleQuestions.title')}
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              {t('sampleQuestions.subtitle')}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-olive-300 transition-colors"
                >
                  <p className="text-gray-800">{t(`sampleQuestions.q${num}`)}</p>
                </div>
              ))}
            </div>
            <p className="text-center mt-8 text-gray-500">
              {t('sampleQuestions.andMore')}
            </p>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t('pricing.title')}
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Free Plan */}
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('pricing.free.name')}
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {t('pricing.free.price')}
                </div>
                <ul className="space-y-3 mb-8">
                  {[1, 2, 3].map((num) => (
                    <li key={num} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-olive-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{t(`pricing.free.feature${num}`)}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/signup`}
                  className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {t('pricing.free.cta')}
                </Link>
              </div>

              {/* Premium Plan */}
              <div className="bg-white border-2 border-olive-500 rounded-xl p-8 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-olive-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                  {t('pricing.premium.badge')}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('pricing.premium.name')}
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {t('pricing.premium.price')}
                </div>
                <p className="text-sm text-gray-500 mb-4">{t('pricing.premium.oneTime')}</p>
                <ul className="space-y-3 mb-8">
                  {[1, 2, 3, 4].map((num) => (
                    <li key={num} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-olive-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{t(`pricing.premium.feature${num}`)}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/signup`}
                  className="block w-full text-center bg-olive-500 hover:bg-olive-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {t('pricing.premium.cta')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t('faq.title')}
            </h2>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t(`faq.q${num}.question`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`faq.q${num}.answer`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 bg-olive-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('finalCta.title')}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('finalCta.subtitle')}
            </p>
            <Link
              href={`/${locale}/signup`}
              className="inline-block bg-olive-500 hover:bg-olive-600 text-white font-medium py-4 px-8 rounded-lg transition-colors text-lg"
            >
              {t('cta')}
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-gray-200">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Parent Stories. {t('footer.rights')}
            </p>
            <div className="flex items-center gap-6">
              <a href="mailto:askparents25questions@gmail.com" className="text-sm text-gray-500 hover:text-gray-700">
                {t('footer.contact')}
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
