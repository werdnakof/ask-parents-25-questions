import { setRequestLocale } from 'next-intl/server';
import { SignupForm } from '@/components/auth/SignupForm';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SignupPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gray-50">
      <SignupForm />
    </main>
  );
}
