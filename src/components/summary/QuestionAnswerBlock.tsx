'use client';

import { useTranslations } from 'next-intl';

interface QuestionAnswerBlockProps {
  questionNumber: number;
  questionText: string;
  answer: string;
  isCustom?: boolean;
}

export function QuestionAnswerBlock({
  questionNumber,
  questionText,
  answer,
  isCustom = false,
}: QuestionAnswerBlockProps) {
  const t = useTranslations('questions');

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 print:border-0 print:p-4 print:break-inside-avoid">
      {/* Question */}
      <div className="flex items-start gap-3 mb-4">
        <span className="flex-shrink-0 w-8 h-8 bg-olive-100 rounded-full flex items-center justify-center text-sm font-medium text-olive-700 print:bg-gray-100">
          {questionNumber}
        </span>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">
            {questionText}
          </h3>
          {isCustom && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-olive-100 text-olive-700 rounded print:bg-gray-100">
              {t('customBadge')}
            </span>
          )}
        </div>
      </div>

      {/* Answer */}
      <div className="pl-11">
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}
