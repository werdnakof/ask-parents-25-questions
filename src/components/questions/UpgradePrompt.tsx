'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/components/auth/AuthProvider';
import { getStripe } from '@/lib/stripe/client';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradePrompt({ isOpen, onClose }: UpgradePromptProps) {
  const t = useTranslations('premium');
  const locale = useLocale();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Get the user's ID token
      const idToken = await user.getIdToken();

      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ locale }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create checkout session');
      }

      const { sessionUrl } = await response.json();

      // Redirect to Stripe Checkout
      if (sessionUrl) {
        window.location.href = sessionUrl;
      }
    } catch (err) {
      console.error('Error starting checkout:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-olive-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('unlock')}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-4">
            {t('description')}
          </p>

          {/* Custom feature highlight */}
          <p className="text-olive-700 font-medium text-sm mb-6">
            {t('customFeature')}
          </p>

          {/* Error message */}
          {error && (
            <p className="text-red-600 text-sm mb-4">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg transition-colors disabled:opacity-50"
            >
              Maybe later
            </button>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-olive-500 hover:bg-olive-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  {t('cta')} - {t('price')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
