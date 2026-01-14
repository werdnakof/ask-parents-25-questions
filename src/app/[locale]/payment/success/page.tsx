'use client';

import { useEffect, useState, Suspense } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

function PaymentSuccessContent() {
  const t = useTranslations('payment');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(5);

  const sessionId = searchParams.get('session_id');

  // Auto-redirect to dashboard after countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push(`/${locale}/dashboard`);
    }
  }, [countdown, router, locale]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('successTitle')}
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {t('successDescription')}
        </p>

        {/* Features unlocked */}
        <div className="bg-olive-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-medium text-olive-800 mb-2">{t('unlocked')}</h3>
          <ul className="text-sm text-olive-700 space-y-1">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-olive-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('feature1')}
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-olive-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('feature2')}
            </li>
          </ul>
        </div>

        {/* Redirect notice */}
        <p className="text-sm text-gray-500 mb-4">
          {t('redirecting', { seconds: countdown })}
        </p>

        {/* Button */}
        <Link
          href={`/${locale}/dashboard`}
          className="inline-block w-full px-6 py-3 bg-olive-500 hover:bg-olive-600 text-white font-medium rounded-lg transition-colors"
        >
          {t('goToDashboard')}
        </Link>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-500"></div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
