'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { usePremiumStatus } from './usePremiumStatus';

export type QuestionCategory =
  | 'childhood'
  | 'family'
  | 'education'
  | 'love'
  | 'parenthood'
  | 'values'
  | 'dreams'
  | 'legacy';

export interface QuestionItem {
  id: string;
  text: string;
  category: QuestionCategory;
  isFree: boolean;
  isCustom: boolean;
}

export interface CategoryInfo {
  id: QuestionCategory;
  name: string;
  questionCount: number;
  freeCount: number;
}

const FREE_QUESTION_COUNT = 25;
const TOTAL_QUESTION_COUNT = 100;

// Question IDs that are free (q1-q25)
const FREE_QUESTION_IDS = Array.from({ length: FREE_QUESTION_COUNT }, (_, i) => `q${i + 1}`);

export function useQuestions() {
  const t = useTranslations('questions_data');
  const { isPremium, loading: premiumLoading } = usePremiumStatus();

  const questions = useMemo(() => {
    const questionList: QuestionItem[] = [];

    for (let i = 1; i <= TOTAL_QUESTION_COUNT; i++) {
      const questionId = `q${i}`;
      try {
        const text = t(`questions.${questionId}.text`);
        const category = t(`questions.${questionId}.category`) as QuestionCategory;

        questionList.push({
          id: questionId,
          text,
          category,
          isFree: FREE_QUESTION_IDS.includes(questionId),
          isCustom: false,
        });
      } catch {
        // Question doesn't exist in translations
        break;
      }
    }

    return questionList;
  }, [t]);

  const categories = useMemo(() => {
    const categoryMap = new Map<QuestionCategory, CategoryInfo>();

    // Get category names from translations
    const categoryIds: QuestionCategory[] = [
      'childhood',
      'family',
      'education',
      'love',
      'parenthood',
      'values',
      'dreams',
      'legacy',
    ];

    categoryIds.forEach((categoryId) => {
      try {
        const name = t(`categories.${categoryId}`);
        categoryMap.set(categoryId, {
          id: categoryId,
          name,
          questionCount: 0,
          freeCount: 0,
        });
      } catch {
        // Category doesn't exist
      }
    });

    // Count questions per category
    questions.forEach((question) => {
      const category = categoryMap.get(question.category);
      if (category) {
        category.questionCount++;
        if (question.isFree) {
          category.freeCount++;
        }
      }
    });

    return Array.from(categoryMap.values());
  }, [questions, t]);

  const getQuestionById = (id: string): QuestionItem | undefined => {
    return questions.find((q) => q.id === id);
  };

  const getQuestionsByCategory = (category: QuestionCategory): QuestionItem[] => {
    return questions.filter((q) => q.category === category);
  };

  const getFreeQuestions = (): QuestionItem[] => {
    return questions.filter((q) => q.isFree);
  };

  const getPremiumQuestions = (): QuestionItem[] => {
    return questions.filter((q) => !q.isFree);
  };

  const getAccessibleQuestions = (): QuestionItem[] => {
    if (isPremium) {
      return questions;
    }
    return getFreeQuestions();
  };

  const canAccessQuestion = (questionId: string): boolean => {
    if (isPremium) return true;
    return FREE_QUESTION_IDS.includes(questionId);
  };

  return {
    questions,
    categories,
    loading: premiumLoading,
    isPremium,
    freeQuestionCount: FREE_QUESTION_COUNT,
    totalQuestionCount: TOTAL_QUESTION_COUNT,
    getQuestionById,
    getQuestionsByCategory,
    getFreeQuestions,
    getPremiumQuestions,
    getAccessibleQuestions,
    canAccessQuestion,
  };
}
