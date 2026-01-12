'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/components/auth/AuthProvider';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { SupportFooter } from '@/components/ui/SupportFooter';
import { ParentCard } from '@/components/dashboard/ParentCard';
import { Button } from '@/components/ui';
import { useParents } from '@/lib/hooks/useParents';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tAuth = useTranslations('auth');
  const locale = useLocale();
  const { user } = useAuth();
  const router = useRouter();
  const { parents, loading: isLoading, error } = useParents();

  const handleSignOut = async () => {
    await signOut();
    router.push(`/${locale}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/${locale}`} className="text-xl font-semibold text-gray-900 hover:text-olive-600 transition-colors">
            Parent Stories
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {tAuth('logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Title and Add Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
          {parents.length > 0 && (
            <Link href={`/${locale}/parent/new`}>
              <Button variant="primary" size="sm">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t('addParent')}
                </span>
              </Button>
            </Link>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-500"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && parents.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-olive-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('emptyStateTitle') || 'No parents added yet'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {t('emptyState')}
            </p>
            <Link href={`/${locale}/parent/new`}>
              <Button variant="primary">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t('addParent')}
                </span>
              </Button>
            </Link>
          </div>
        )}

        {/* Parent Cards Grid */}
        {!isLoading && parents.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {parents.map((parent) => (
              <ParentCard key={parent.id} parent={parent} />
            ))}
          </div>
        )}

        {/* Support Footer */}
        <SupportFooter className="mt-12" />
      </main>
    </div>
  );
}
