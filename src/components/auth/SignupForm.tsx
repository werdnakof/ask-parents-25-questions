'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUpWithEmail } from '@/lib/firebase/auth';
import { createUser } from '@/lib/firebase/firestore';
import { GoogleSignInButton } from './GoogleSignInButton';

export function SignupForm() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const user = await signUpWithEmail(email, password, name);

      // Create user document in Firestore
      await createUser(user.uid, {
        email: user.email || '',
        displayName: name,
      });

      router.push(`/${locale}/dashboard`);
    } catch (err: unknown) {
      console.error('Signup error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
      if (errorMessage.includes('email-already-in-use')) {
        setError('An account with this email already exists.');
      } else if (errorMessage.includes('weak-password')) {
        setError('Password is too weak. Please use a stronger password.');
      } else if (errorMessage.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        {t('signup')}
      </h1>

      <GoogleSignInButton />

      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {t('name') || 'Name'}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 min-h-[48px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent"
            placeholder="Your name"
          />
        </div>

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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            {t('confirmPassword') || 'Confirm Password'}
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? t('loading') || 'Loading...' : t('signup')}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        {t('hasAccount')}{' '}
        <Link href={`/${locale}/login`} className="text-olive-600 hover:text-olive-700 font-medium">
          {t('login')}
        </Link>
      </p>
    </div>
  );
}
