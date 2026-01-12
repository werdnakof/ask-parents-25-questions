'use client';

import { useTranslations } from 'next-intl';

interface SupportFooterProps {
  className?: string;
}

export function SupportFooter({ className = '' }: SupportFooterProps) {
  const t = useTranslations('dashboard');

  const supportEmail = t('supportEmail');

  return (
    <div className={`text-center text-sm text-gray-500 ${className}`}>
      <p>{t('supportLabel')}</p>
      <a
        href={`mailto:${supportEmail}`}
        className="text-olive-600 hover:text-olive-700 transition-colors"
      >
        {supportEmail}
      </a>
    </div>
  );
}
