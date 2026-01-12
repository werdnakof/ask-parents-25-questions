'use client';

import { useAuth } from '@/components/auth/AuthProvider';

/**
 * Hook to check if the current user has premium status
 * Returns { isPremium, loading }
 */
export function usePremiumStatus() {
  const { isPremium, loading } = useAuth();

  return {
    isPremium,
    loading,
  };
}
