'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { usePremiumStatus } from '@/lib/hooks/usePremiumStatus';
import { useQuestions } from '@/lib/hooks/useQuestions';
import { useAnswers } from '@/lib/hooks/useAnswers';
import { QuestionDetail } from '@/components/questions/QuestionDetail';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { signOut } from '@/lib/firebase/auth';

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const parentId = params.parentId as string;
  const questionId = params.questionId as string;

  const t = useTranslations('questions');
  const tAuth = useTranslations('auth');
  const tPremium = useTranslations('premium');

  const { user } = useAuth();
  const { isPremium } = usePremiumStatus();
  const { questions, canAccessQuestion, freeQuestionCount } = useQuestions();
  const { getAnswerForQuestion, saveQuestionAnswer, loading: answersLoading } = useAnswers(parentId);

  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  // Get accessible questions based on premium status
  const accessibleQuestions = useMemo(() => {
    if (isPremium) {
      return questions;
    }
    return questions.filter(q => q.isFree);
  }, [questions, isPremium]);

  // Find current question
  const currentQuestion = useMemo(() => {
    return questions.find(q => q.id === questionId);
  }, [questions, questionId]);

  // Calculate question number and navigation
  const questionIndex = useMemo(() => {
    return accessibleQuestions.findIndex(q => q.id === questionId);
  }, [accessibleQuestions, questionId]);

  const questionNumber = questionIndex + 1;
  const totalQuestions = accessibleQuestions.length;

  // Get prev/next question IDs
  const prevQuestionId = questionIndex > 0 ? accessibleQuestions[questionIndex - 1]?.id : null;
  const nextQuestionId = questionIndex < accessibleQuestions.length - 1
    ? accessibleQuestions[questionIndex + 1]?.id
    : null;

  // Check if next question is blocked (on question 25 for free users)
  const isOnLastFreeQuestion = !isPremium && questionId === `q${freeQuestionCount}`;
  const isNextBlocked = isOnLastFreeQuestion && !isPremium;

  // Get current answer
  const currentAnswer = getAnswerForQuestion(questionId);

  // Check if user can access this question
  const canAccess = canAccessQuestion(questionId);

  // Redirect if user can't access this question
  useEffect(() => {
    if (!answersLoading && !canAccess) {
      router.push(`/${locale}/parent/${parentId}`);
    }
  }, [canAccess, answersLoading, router, locale, parentId]);

  const handleSaveAnswer = useCallback(async (answerText: string) => {
    if (!currentQuestion) return;

    await saveQuestionAnswer(
      questionId,
      currentQuestion.text,
      locale,
      currentQuestion.isCustom,
      answerText
    );
  }, [questionId, currentQuestion, locale, saveQuestionAnswer]);

  const handleNextBlocked = useCallback(() => {
    setShowUpgradePrompt(true);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push(`/${locale}`);
  };

  if (!currentQuestion || answersLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link href={`/${locale}/dashboard`} className="text-xl font-semibold text-gray-900">
              Parent Stories
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-500"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/${locale}/dashboard`} className="text-xl font-semibold text-gray-900 hover:text-olive-600 transition-colors">
            Parent Stories
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {tAuth('logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back to Questions Link */}
        <Link
          href={`/${locale}/parent/${parentId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backToList')}
        </Link>

        {/* Question Detail */}
        <QuestionDetail
          parentId={parentId}
          question={currentQuestion}
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          currentAnswer={currentAnswer}
          prevQuestionId={prevQuestionId}
          nextQuestionId={nextQuestionId}
          onSaveAnswer={handleSaveAnswer}
          isNextBlocked={isNextBlocked}
          onNextBlocked={handleNextBlocked}
        />

        {/* Upgrade Prompt Modal */}
        {showUpgradePrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-olive-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tPremium('unlock')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {tPremium('description')}
                </p>
                <p className="text-olive-700 font-medium text-sm mb-6">
                  {tPremium('customFeature')}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUpgradePrompt(false)}
                    className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg transition-colors"
                  >
                    Maybe later
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-olive-500 hover:bg-olive-600 text-white font-medium rounded-lg transition-colors"
                  >
                    {tPremium('cta')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
