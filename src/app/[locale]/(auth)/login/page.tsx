import { setRequestLocale } from 'next-intl/server';
import { LoginForm } from '@/components/auth/LoginForm';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gray-50">
      <LoginForm />
    </main>
  );
}
