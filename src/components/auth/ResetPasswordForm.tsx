'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { resetPassword } from '@/lib/firebase/auth';

export function ResetPasswordForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      console.error('Reset password error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      if (errorMessage.includes('user-not-found')) {
        setError('No account found with this email address.');
      } else if (errorMessage.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-olive-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('checkEmail') || 'Check your email'}
          </h1>
          <p className="text-gray-600">
            {t('resetEmailSent') || `We've sent a password reset link to ${email}`}
          </p>
        </div>
        <Link
          href={`/${locale}/login`}
          className="text-olive-600 hover:text-olive-700 font-medium"
        >
          {t('backToLogin') || 'Back to login'}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
        {t('resetPassword') || 'Reset Password'}
      </h1>
      <p className="text-gray-600 mb-8 text-center">
        {t('resetPasswordDescription') || "Enter your email and we'll send you a link to reset your password."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            {t('email')}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 min-h-[48px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent"
            placeholder="you@example.com"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-olive-500 hover:bg-olive-600 text-white font-medium py-3 px-4 min-h-[48px] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t('loading') || 'Loading...' : t('sendResetLink') || 'Send Reset Link'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        {t('rememberPassword') || 'Remember your password?'}{' '}
        <Link href={`/${locale}/login`} className="text-olive-600 hover:text-olive-700 font-medium">
          {t('login')}
        </Link>
      </p>
    </div>
  );
}
