'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/auth/AuthProvider';
import { useQuestions } from '@/lib/hooks/useQuestions';
import { useAnswers } from '@/lib/hooks/useAnswers';
import { useCustomQuestions } from '@/lib/hooks/useCustomQuestions';
import { getParent } from '@/lib/firebase/firestore';
import { QuestionList, AddQuestionModal } from '@/components/questions';
import { Button } from '@/components/ui';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { signOut } from '@/lib/firebase/auth';
import type { Parent } from '@/lib/types';

export default function ParentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const parentId = params.parentId as string;

  const t = useTranslations();
  const tParent = useTranslations('parent');
  const tAuth = useTranslations('auth');

  const { user } = useAuth();
  const { questions, getQuestionById } = useQuestions();
  const { answeredIds, loading: answersLoading } = useAnswers(parentId);
  const {
    customQuestions,
    selectedQuestions,
    loading: customLoading,
    hasReachedFreeLimit,
    isPremium,
    totalAddedCount,
    freeQuestionLimit,
    refetch: refetchCustomQuestions,
  } = useCustomQuestions(parentId);

  const [parent, setParent] = useState<Parent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  // Build the question list from user-added questions only (no pre-population)
  // Combines selectedQuestions (curated) and customQuestions (user-written)
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

    // Sort by order (when they were added)
    return questionList.sort((a, b) => a.order - b.order);
  }, [selectedQuestions, customQuestions, getQuestionById]);

  useEffect(() => {
    async function fetchParent() {
      if (!user || !parentId) {
        setLoading(false);
        return;
      }

      try {
        const parentData = await getParent(user.uid, parentId);
        setParent(parentData);
      } catch (err) {
        console.error('Error fetching parent:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchParent();
  }, [user, parentId]);

  const handleSignOut = async () => {
    await signOut();
    router.push(`/${locale}`);
  };

  if (loading || answersLoading || customLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
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

  if (!parent) {
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
          <div className="text-center py-12">
            <p className="text-gray-600">Parent not found</p>
            <Link href={`/${locale}/dashboard`} className="text-olive-600 hover:underline mt-4 inline-block">
              {t('common.back')} to Dashboard
            </Link>
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
        {/* Back Link */}
        <Link
          href={`/${locale}/dashboard`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('common.back')}
        </Link>

        {/* Parent Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Photo */}
              {parent.photoUrl ? (
                <Image
                  src={parent.photoUrl}
                  alt={parent.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-olive-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-semibold text-olive-600">
                    {parent.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Name and relationship */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{parent.name}</h1>
                <p className="text-gray-500">
                  {parent.relationship === 'mother' && tParent('mother')}
                  {parent.relationship === 'father' && tParent('father')}
                  {parent.relationship === 'other' && tParent('other')}
                </p>
              </div>
            </div>

            {/* View Story Button */}
            <Link href={`/${locale}/parent/${parentId}/summary`}>
              <Button variant="outline">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {tParent('viewStory')}
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Questions Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {tParent('questions')}
            {totalAddedCount > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({totalAddedCount}{!isPremium && `/${freeQuestionLimit}`})
              </span>
            )}
          </h2>
          {/* Add Question button - visible for all users */}
          <button
            onClick={() => setShowAddQuestion(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-olive-600 bg-olive-50 hover:bg-olive-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {tParent('addQuestion')}
          </button>
        </div>

        {/* Question List */}
        <QuestionList
          parentId={parentId}
          questions={userQuestions}
          answeredIds={answeredIds}
          isPremium={isPremium}
          hasReachedFreeLimit={hasReachedFreeLimit}
        />

        {/* Add Question Modal */}
        <AddQuestionModal
          parentId={parentId}
          isOpen={showAddQuestion}
          onClose={() => setShowAddQuestion(false)}
          onQuestionAdded={refetchCustomQuestions}
          hasReachedFreeLimit={hasReachedFreeLimit}
        />
      </main>
    </div>
  );
}
