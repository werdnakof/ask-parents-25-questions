'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/auth/AuthProvider';
import { useQuestions } from '@/lib/hooks/useQuestions';
import { useCustomQuestions } from '@/lib/hooks/useCustomQuestions';
import { useAnswers } from '@/lib/hooks/useAnswers';
import { getParent } from '@/lib/firebase/firestore';
import { StorySummary } from '@/components/summary';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { signOut } from '@/lib/firebase/auth';
import type { Parent } from '@/lib/types';

export default function SummaryPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const parentId = params.parentId as string;

  const t = useTranslations('summary');
  const tAuth = useTranslations('auth');
  const tCommon = useTranslations('common');

  const { user } = useAuth();
  const { getQuestionById } = useQuestions();
  const { customQuestions, selectedQuestions, loading: customLoading } = useCustomQuestions(parentId);
  const { answers, loading: answersLoading } = useAnswers(parentId);

  const [parent, setParent] = useState<Parent | null>(null);
  const [loading, setLoading] = useState(true);

  // Build the user's question list from selected + custom questions
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

  const handlePrint = () => {
    window.print();
  };

  if (loading || answersLoading || customLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 print:hidden">
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

  if (!parent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 print:hidden">
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
              {tCommon('back')} to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Header - hidden when printing */}
      <header className="bg-white border-b border-gray-200 print:hidden">
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
      <main className="max-w-4xl mx-auto px-4 py-8 print:py-0">
        {/* Back Link - hidden when printing */}
        <Link
          href={`/${locale}/parent/${parentId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors print:hidden"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {tCommon('back')}
        </Link>

        {/* Story Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 print:border-0 print:p-0 print:mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Photo */}
              {parent.photoUrl ? (
                <Image
                  src={parent.photoUrl}
                  alt={parent.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover print:w-16 print:h-16"
                />
              ) : (
                <div className="w-20 h-20 bg-olive-100 rounded-full flex items-center justify-center print:w-16 print:h-16 print:bg-gray-100">
                  <span className="text-3xl font-semibold text-olive-600 print:text-2xl print:text-gray-600">
                    {parent.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 print:text-3xl">
                  {t('title', { name: parent.name })}
                </h1>
                <p className="text-gray-500 mt-1">
                  {answers.length} questions answered
                </p>
              </div>
            </div>

            {/* Print Button - hidden when printing */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-olive-600 bg-olive-50 hover:bg-olive-100 rounded-lg transition-colors print:hidden"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              {t('print')}
            </button>
          </div>
        </div>

        {/* Story Summary */}
        <StorySummary
          parentName={parent.name}
          questions={userQuestions}
          answers={answers}
        />
      </main>
    </div>
  );
}
