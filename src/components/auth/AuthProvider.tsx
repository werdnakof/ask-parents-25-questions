'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

interface UserData {
  isPremium: boolean;
  preferredLocale: 'en' | 'zh' | 'es';
  displayName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isPremium: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isPremium: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen to user document changes for premium status
  useEffect(() => {
    if (!user) {
      setUserData(null);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(
      userRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setUserData({
            isPremium: data.isPremium ?? false,
            preferredLocale: data.preferredLocale ?? 'en',
            displayName: data.displayName ?? user.displayName ?? '',
            email: data.email ?? user.email ?? '',
          });
        } else {
          setUserData({
            isPremium: false,
            preferredLocale: 'en',
            displayName: user.displayName ?? '',
            email: user.email ?? '',
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to user document:', error);
        setLoading(false);
      }
    );

    return () => unsubscribeUser();
  }, [user]);

  const value = {
    user,
    userData,
    loading,
    isPremium: userData?.isPremium ?? false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
