'use client';

import { useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { AnswerTextarea } from './AnswerTextarea';
import { QuestionNavigation } from './QuestionNavigation';
import type { QuestionItem } from '@/lib/hooks/useQuestions';
import type { Answer } from '@/lib/types';

interface QuestionDetailProps {
  parentId: string;
  question: QuestionItem;
  questionNumber: number;
  totalQuestions: number;
  currentAnswer?: Answer;
  prevQuestionId: string | null;
  nextQuestionId: string | null;
  onSaveAnswer: (answer: string) => Promise<void>;
  isNextBlocked?: boolean;
  onNextBlocked?: () => void;
}

export function QuestionDetail({
  parentId,
  question,
  questionNumber,
  totalQuestions,
  currentAnswer,
  prevQuestionId,
  nextQuestionId,
  onSaveAnswer,
  isNextBlocked = false,
  onNextBlocked,
}: QuestionDetailProps) {
  const t = useTranslations('questions');

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
      {/* Question Number */}
      <div className="text-sm text-gray-500 mb-4">
        {t('questionOf', { current: questionNumber, total: totalQuestions })}
      </div>

      {/* Question Text */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6 leading-relaxed">
        &ldquo;{question.text}&rdquo;
      </h2>

      {/* Custom Badge */}
      {question.isCustom && (
        <span className="inline-block mb-4 px-2 py-1 text-xs font-medium bg-olive-100 text-olive-700 rounded">
          {t('customBadge')}
        </span>
      )}

      {/* Answer Textarea */}
      <AnswerTextarea
        initialValue={currentAnswer?.answer || ''}
        onSave={onSaveAnswer}
      />

      {/* Navigation */}
      <QuestionNavigation
        parentId={parentId}
        prevQuestionId={prevQuestionId}
        nextQuestionId={nextQuestionId}
        isNextBlocked={isNextBlocked}
        onNextBlocked={onNextBlocked}
      />
    </div>
  );
}
