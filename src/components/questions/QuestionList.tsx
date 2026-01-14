'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { QuestionListItem } from './QuestionListItem';
import { ProgressBar } from './ProgressBar';
import { UpgradePrompt } from './UpgradePrompt';
import type { QuestionItem } from '@/lib/hooks/useQuestions';

interface QuestionListProps {
  parentId: string;
  questions: QuestionItem[];
  answeredIds: Set<string>;
  isPremium: boolean;
  hasReachedFreeLimit?: boolean;
}

export function QuestionList({
  parentId,
  questions,
  answeredIds,
  isPremium,
  hasReachedFreeLimit = false,
}: QuestionListProps) {
  const t = useTranslations('premium');
  const tQuestions = useTranslations('questions');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const answeredCount = questions.filter(q => answeredIds.has(q.id)).length;

  // Empty state - no questions added yet
  if (questions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-olive-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {tQuestions('emptyState.title')}
        </h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          {tQuestions('emptyState.description')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <ProgressBar
        answered={answeredCount}
        total={questions.length}
      />

      {/* Question List */}
      <div className="space-y-2">
        {questions.map((question, index) => (
          <QuestionListItem
            key={question.id}
            parentId={parentId}
            questionId={question.id}
            questionNumber={index + 1}
            questionText={question.text}
            isAnswered={answeredIds.has(question.id)}
            isCustom={question.isCustom}
          />
        ))}
      </div>

      {/* Upgrade Prompt - shown when free user has reached 25 questions */}
      {hasReachedFreeLimit && (
        <div className="p-6 bg-gradient-to-r from-olive-50 to-olive-100 rounded-xl border border-olive-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-olive-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {t('unlock')}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {t('limitReached')}
              </p>
              <p className="text-olive-700 font-medium text-sm mb-1">
                {t('customFeature')}
              </p>
              <button
                onClick={() => setShowUpgradePrompt(true)}
                className="mt-3 px-4 py-2 bg-olive-500 hover:bg-olive-600 text-white font-medium rounded-lg transition-colors"
              >
                {t('cta')} - {t('price')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Prompt Modal */}
      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
      />
    </div>
  );
}
