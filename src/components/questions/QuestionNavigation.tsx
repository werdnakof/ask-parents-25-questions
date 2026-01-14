'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

interface QuestionNavigationProps {
  parentId: string;
  prevQuestionId: string | null;
  nextQuestionId: string | null;
  onNextBlocked?: () => void;
  isNextBlocked?: boolean;
}

export function QuestionNavigation({
  parentId,
  prevQuestionId,
  nextQuestionId,
  onNextBlocked,
  isNextBlocked = false,
}: QuestionNavigationProps) {
  const t = useTranslations('common');
  const locale = useLocale();

  const handleNextClick = (e: React.MouseEvent) => {
    if (isNextBlocked && onNextBlocked) {
      e.preventDefault();
      onNextBlocked();
    }
  };

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
      {/* Previous Button */}
      {prevQuestionId ? (
        <Link
          href={`/${locale}/parent/${parentId}/question/${prevQuestionId}`}
          className="flex items-center gap-2 px-4 py-3 min-h-[44px] text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('previous')}
        </Link>
      ) : (
        <div className="flex items-center gap-2 px-4 py-3 min-h-[44px] text-gray-300 cursor-not-allowed">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('previous')}
        </div>
      )}

      {/* Next Button */}
      {nextQuestionId ? (
        <Link
          href={isNextBlocked ? '#' : `/${locale}/parent/${parentId}/question/${nextQuestionId}`}
          onClick={handleNextClick}
          className={`flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-lg transition-colors ${
            isNextBlocked
              ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          {t('next')}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <div className="flex items-center gap-2 px-4 py-3 min-h-[44px] text-gray-300 cursor-not-allowed">
          {t('next')}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );
}
