'use client';

import { useEffect, useCallback, useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { useQuestions } from '@/lib/hooks/useQuestions';
import { useCustomQuestions } from '@/lib/hooks/useCustomQuestions';
import { useAnswers } from '@/lib/hooks/useAnswers';
import { QuestionDetail } from '@/components/questions/QuestionDetail';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { QuestionDetailSkeleton } from '@/components/ui';
import { signOut } from '@/lib/firebase/auth';

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const parentId = params.parentId as string;
  const questionId = params.questionId as string;

  const t = useTranslations('questions');
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');

  useAuth(); // Auth check handled by layout
  const { questions, getQuestionById } = useQuestions();
  const {
    customQuestions,
    selectedQuestions,
    deleteCustom,
    deleteSelected,
    loading: customLoading,
  } = useCustomQuestions(parentId);
  const { getAnswerForQuestion, saveQuestionAnswer, loading: answersLoading } = useAnswers(parentId);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Build the user's question list from selected + custom questions (same as parent page)
  const userQuestions = useMemo(() => {
    const questionList: Array<{
      id: string;
      text: string;
      category: 'childhood' | 'family' | 'education' | 'love' | 'parenthood' | 'values' | 'dreams' | 'legacy';
      isFree: boolean;
      isCustom: boolean;
      order: number;
    }> = [];

    // Add selected curated questions
    selectedQuestions.forEach((selected) => {
      const curatedQuestion = getQuestionById(selected.questionId);
      if (curatedQuestion) {
        questionList.push({
          ...curatedQuestion,
          order: selected.order,
        });
      }
    });

    // Add custom questions
    customQuestions.forEach((customQ) => {
      questionList.push({
        id: customQ.id,
        text: customQ.text,
        category: 'legacy' as const,
        isFree: false,
        isCustom: true,
        order: customQ.order,
      });
    });

    // Sort by order
    return questionList.sort((a, b) => a.order - b.order);
  }, [selectedQuestions, customQuestions, getQuestionById]);

  // Find current question in user's list
  const currentQuestion = useMemo(() => {
    return userQuestions.find(q => q.id === questionId);
  }, [userQuestions, questionId]);

  // Calculate question number and navigation
  const questionIndex = useMemo(() => {
    return userQuestions.findIndex(q => q.id === questionId);
  }, [userQuestions, questionId]);

  const questionNumber = questionIndex + 1;
  const totalQuestions = userQuestions.length;

  // Get prev/next question IDs
  const prevQuestionId = questionIndex > 0 ? userQuestions[questionIndex - 1]?.id : null;
  const nextQuestionId = questionIndex < userQuestions.length - 1
    ? userQuestions[questionIndex + 1]?.id
    : null;

  // Get current answer
  const currentAnswer = getAnswerForQuestion(questionId);

  // Check if user can access this question (must be in their selectedQuestions or customQuestions)
  const canAccess = useMemo(() => {
    return userQuestions.some(q => q.id === questionId);
  }, [userQuestions, questionId]);

  // Redirect if user can't access this question (not in their list)
  useEffect(() => {
    if (!answersLoading && !customLoading && !canAccess) {
      router.push(`/${locale}/parent/${parentId}`);
    }
  }, [canAccess, answersLoading, customLoading, router, locale, parentId]);

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

  const handleDeleteQuestion = useCallback(async () => {
    if (!currentQuestion) return;

    setIsDeleting(true);
    try {
      // Delete from the appropriate collection (also deletes the answer)
      if (currentQuestion.isCustom) {
        await deleteCustom(questionId);
      } else {
        await deleteSelected(questionId);
      }

      // Redirect to parent page
      router.push(`/${locale}/parent/${parentId}`);
    } catch (error) {
      console.error('Error deleting question:', error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, [currentQuestion, questionId, deleteCustom, deleteSelected, router, locale, parentId]);

  const handleSignOut = async () => {
    await signOut();
    router.push(`/${locale}`);
  };

  if (!currentQuestion || answersLoading || customLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href={`/${locale}/dashboard`} className="text-xl font-semibold text-gray-900">
              Parent Stories
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Back to Questions Link Skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-28 bg-gray-200 rounded-lg animate-pulse" />
          </div>

          {/* Question Detail Skeleton */}
          <QuestionDetailSkeleton />
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
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/${locale}/parent/${parentId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('backToList')}
          </Link>

          {/* Delete Button */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t('deleteCustom')}
          </button>
        </div>

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
        />
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('deleteCustom')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('deleteConfirm')}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                {tCommon('cancel')}
              </button>
              <button
                onClick={handleDeleteQuestion}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? '...' : t('deleteCustom')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
