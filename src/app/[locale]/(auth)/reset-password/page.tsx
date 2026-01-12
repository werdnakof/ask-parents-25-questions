import { setRequestLocale } from 'next-intl/server';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ResetPasswordPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <ResetPasswordForm />
    </main>
  );
}
