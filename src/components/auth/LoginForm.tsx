'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmail } from '@/lib/firebase/auth';
import { GoogleSignInButton } from './GoogleSignInButton';

export function LoginForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmail(email, password);
      router.push(`/${locale}/dashboard`);
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      if (errorMessage.includes('invalid-credential') || errorMessage.includes('wrong-password')) {
        setError('Invalid email or password. Please try again.');
      } else if (errorMessage.includes('user-not-found')) {
        setError('No account found with this email.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        {t('login')}
      </h1>

      <GoogleSignInButton />

      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

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

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            {t('password')}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 min-h-[48px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent"
            placeholder="••••••••"
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
          {loading ? t('loading') || 'Loading...' : t('login')}
        </button>
      </form>

      <div className="mt-6 text-center space-y-2">
        <Link
          href={`/${locale}/reset-password`}
          className="text-sm text-olive-600 hover:text-olive-700"
        >
          {t('forgotPassword')}
        </Link>
        <p className="text-sm text-gray-600">
          {t('noAccount')}{' '}
          <Link href={`/${locale}/signup`} className="text-olive-600 hover:text-olive-700 font-medium">
            {t('signup')}
          </Link>
        </p>
      </div>
    </div>
  );
}
