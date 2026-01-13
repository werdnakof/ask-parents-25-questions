'use client';

import { useTranslations } from 'next-intl';

interface ProgressBarProps {
  answered: number;
  total: number;
  className?: string;
}

export function ProgressBar({ answered, total, className = '' }: ProgressBarProps) {
  const t = useTranslations('questions');
  const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div className={className}>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-600">
          {t('progress', { count: answered, total })}
        </span>
        <span className="text-gray-500">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-olive-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
