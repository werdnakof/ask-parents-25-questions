'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function PaymentCancelledPage() {
  const t = useTranslations('payment');
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Cancelled Icon */}
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('cancelledTitle')}
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {t('cancelledDescription')}
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <Link
            href={`/${locale}/dashboard`}
            className="block w-full px-6 py-3 bg-olive-500 hover:bg-olive-600 text-white font-medium rounded-lg transition-colors"
          >
            {t('goToDashboard')}
          </Link>
          <p className="text-sm text-gray-500">
            {t('tryAgainLater')}
          </p>
        </div>
      </div>
    </div>
  );
}
