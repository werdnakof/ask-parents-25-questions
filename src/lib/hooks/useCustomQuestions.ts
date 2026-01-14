'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { usePremiumStatus } from './usePremiumStatus';
import {
  addCustomQuestion,
  getCustomQuestions,
  deleteCustomQuestion,
  addSelectedQuestion,
  getSelectedQuestions,
  deleteSelectedQuestion,
} from '@/lib/firebase/firestore';
import type { CustomQuestion, SelectedQuestion } from '@/lib/types';

// Free users can add up to 25 questions, premium users unlimited (up to 100 total)
const FREE_QUESTION_LIMIT = 25;
const MAX_TOTAL_QUESTIONS = 100;

export interface CustomQuestionItem {
  id: string;
  text: string;
  isCustom: true;
  order: number;
  createdAt?: Date;
}

export interface SelectedQuestionItem {
  questionId: string;
  order: number;
  addedAt?: Date;
}

export function useCustomQuestions(parentId: string) {
  const { user } = useAuth();
  const { isPremium, loading: premiumLoading } = usePremiumStatus();
  const [customQuestions, setCustomQuestions] = useState<CustomQuestionItem[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<SelectedQuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch custom questions and selected questions
  const fetchQuestions = useCallback(async () => {
    if (!user || !parentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [customData, selectedData] = await Promise.all([
        getCustomQuestions(user.uid, parentId),
        getSelectedQuestions(user.uid, parentId),
      ]);

      setCustomQuestions(
        customData.map((q) => ({
          id: q.id,
          text: q.text,
          isCustom: true as const,
          order: q.order,
          createdAt: q.createdAt,
        }))
      );

      setSelectedQuestions(
        selectedData.map((q) => ({
          questionId: q.questionId,
          order: q.order,
          addedAt: q.addedAt,
        }))
      );
    } catch (err) {
      console.error('Error fetching custom questions:', err);
      setError('Failed to load custom questions');
    } finally {
      setLoading(false);
    }
  }, [user, parentId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Add a custom question (user-written)
  const addCustom = useCallback(
    async (text: string): Promise<string | null> => {
      if (!user || !parentId) return null;

      try {
        // Generate a unique ID for the custom question
        const questionId = `custom_${Date.now()}`;

        // Get the next order number
        const maxOrder = Math.max(
          0,
          ...customQuestions.map((q) => q.order),
          ...selectedQuestions.map((q) => q.order)
        );
        const order = maxOrder + 1;

        await addCustomQuestion(user.uid, parentId, questionId, text, order);

        // Update local state
        setCustomQuestions((prev) => [
          ...prev,
          {
            id: questionId,
            text,
            isCustom: true,
            order,
            createdAt: new Date(),
          },
        ]);

        return questionId;
      } catch (err) {
        console.error('Error adding custom question:', err);
        setError('Failed to add custom question');
        return null;
      }
    },
    [user, parentId, customQuestions, selectedQuestions]
  );

  // Add a selected curated question
  const addSelected = useCallback(
    async (questionId: string): Promise<boolean> => {
      if (!user || !parentId) return false;

      // Check if already selected
      if (selectedQuestions.some((q) => q.questionId === questionId)) {
        return false;
      }

      try {
        // Get the next order number
        const maxOrder = Math.max(
          0,
          ...customQuestions.map((q) => q.order),
          ...selectedQuestions.map((q) => q.order)
        );
        const order = maxOrder + 1;

        await addSelectedQuestion(user.uid, parentId, questionId, order);

        // Update local state
        setSelectedQuestions((prev) => [
          ...prev,
          {
            questionId,
            order,
            addedAt: new Date(),
          },
        ]);

        return true;
      } catch (err) {
        console.error('Error adding selected question:', err);
        setError('Failed to add question');
        return false;
      }
    },
    [user, parentId, customQuestions, selectedQuestions]
  );

  // Delete a custom question
  const deleteCustom = useCallback(
    async (questionId: string): Promise<boolean> => {
      if (!user || !parentId) return false;

      try {
        await deleteCustomQuestion(user.uid, parentId, questionId);

        // Update local state
        setCustomQuestions((prev) => prev.filter((q) => q.id !== questionId));

        return true;
      } catch (err) {
        console.error('Error deleting custom question:', err);
        setError('Failed to delete question');
        return false;
      }
    },
    [user, parentId]
  );

  // Delete a selected question
  const deleteSelected = useCallback(
    async (questionId: string): Promise<boolean> => {
      if (!user || !parentId) return false;

      try {
        await deleteSelectedQuestion(user.uid, parentId, questionId);

        // Update local state
        setSelectedQuestions((prev) => prev.filter((q) => q.questionId !== questionId));

        return true;
      } catch (err) {
        console.error('Error deleting selected question:', err);
        setError('Failed to delete question');
        return false;
      }
    },
    [user, parentId]
  );

  // Check if a curated question is already selected
  const isQuestionSelected = useCallback(
    (questionId: string): boolean => {
      return selectedQuestions.some((q) => q.questionId === questionId);
    },
    [selectedQuestions]
  );

  // Get total count of added questions (custom + selected)
  const totalAddedCount = customQuestions.length + selectedQuestions.length;

  // Determine question limit based on premium status
  const questionLimit = isPremium ? MAX_TOTAL_QUESTIONS : FREE_QUESTION_LIMIT;
  const canAddMore = totalAddedCount < questionLimit;
  const hasReachedFreeLimit = !isPremium && totalAddedCount >= FREE_QUESTION_LIMIT;

  return {
    customQuestions,
    selectedQuestions,
    loading: loading || premiumLoading,
    error,
    addCustom,
    addSelected,
    deleteCustom,
    deleteSelected,
    isQuestionSelected,
    totalAddedCount,
    questionLimit,
    freeQuestionLimit: FREE_QUESTION_LIMIT,
    canAddMore,
    hasReachedFreeLimit,
    isPremium,
    refetch: fetchQuestions,
  };
}
