'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/components/auth/AuthProvider';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tAuth = useTranslations('auth');
  const locale = useLocale();
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push(`/${locale}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Parent Stories</h1>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {tAuth('logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('title')}</h2>

        {/* Empty State */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-olive-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-6">{t('emptyState')}</p>
          <button className="bg-olive-500 hover:bg-olive-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            {t('addParent')}
          </button>
        </div>

        {/* Support Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>{t('supportLabel')}</p>
          <a
            href={`mailto:${t('supportEmail')}`}
            className="text-olive-600 hover:text-olive-700"
          >
            {t('supportEmail')}
          </a>
        </div>
      </main>
    </div>
  );
}
