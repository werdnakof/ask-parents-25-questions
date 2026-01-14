'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

interface QuestionListItemProps {
  parentId: string;
  questionId: string;
  questionNumber: number;
  questionText: string;
  isAnswered: boolean;
  isCustom?: boolean;
  isLocked?: boolean;
}

export function QuestionListItem({
  parentId,
  questionId,
  questionNumber,
  questionText,
  isAnswered,
  isCustom = false,
  isLocked = false,
}: QuestionListItemProps) {
  const t = useTranslations('questions');
  const locale = useLocale();

  if (isLocked) {
    return (
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-60 cursor-not-allowed">
        <span className="flex-shrink-0 w-8 text-center font-medium text-gray-400">
          {questionNumber}
        </span>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <p className="text-gray-400 truncate">{questionText}</p>
          {isCustom && (
            <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-500 rounded">
              {t('customBadge')}
            </span>
          )}
        </div>
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/${locale}/parent/${parentId}/question/${questionId}`}
      className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
        isAnswered
          ? 'bg-olive-50 border-olive-200 hover:border-olive-300'
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <span className={`flex-shrink-0 w-8 text-center font-medium ${
        isAnswered ? 'text-olive-600' : 'text-gray-500'
      }`}>
        {questionNumber}
      </span>

      <div className="flex-1 min-w-0 flex items-center gap-2">
        <p className={`truncate ${isAnswered ? 'text-gray-700' : 'text-gray-900'}`}>
          {questionText}
        </p>
        {isCustom && (
          <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-olive-100 text-olive-700 rounded">
            {t('customBadge')}
          </span>
        )}
      </div>

      <div className="flex-shrink-0">
        {isAnswered ? (
          <div className="w-6 h-6 bg-olive-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
        )}
      </div>
    </Link>
  );
}
