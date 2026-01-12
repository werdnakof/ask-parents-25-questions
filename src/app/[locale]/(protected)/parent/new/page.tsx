'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { AddParentForm } from '@/components/parent';

export default function AddParentPage() {
  const t = useTranslations('parent');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {tCommon('back')}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {t('addParentTitle') || 'Add a Parent'}
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            {t('addParentDescription') || 'Add someone whose story you want to capture.'}
          </p>

          <AddParentForm />
        </div>
      </main>
    </div>
  );
}
