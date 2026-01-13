'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { getAnswers, getAnswer, saveAnswer } from '@/lib/firebase/firestore';
import type { Answer } from '@/lib/types';

export function useAnswers(parentId: string) {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnswers = useCallback(async () => {
    if (!user || !parentId) {
      setAnswers([]);
      setAnsweredIds(new Set());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedAnswers = await getAnswers(user.uid, parentId);
      setAnswers(fetchedAnswers);

      // Build a set of answered question IDs for quick lookup
      const ids = new Set(fetchedAnswers.map(a => a.questionId));
      setAnsweredIds(ids);
    } catch (err) {
      console.error('Error fetching answers:', err);
      setError('Failed to load answers');
    } finally {
      setLoading(false);
    }
  }, [user, parentId]);

  useEffect(() => {
    fetchAnswers();
  }, [fetchAnswers]);

  const isAnswered = useCallback((questionId: string): boolean => {
    return answeredIds.has(questionId);
  }, [answeredIds]);

  const getAnswerForQuestion = useCallback((questionId: string): Answer | undefined => {
    return answers.find(a => a.questionId === questionId);
  }, [answers]);

  const saveQuestionAnswer = useCallback(async (
    questionId: string,
    questionText: string,
    questionTextLocale: string | null,
    isCustomQuestion: boolean,
    answerText: string
  ) => {
    if (!user || !parentId) {
      throw new Error('User not authenticated');
    }

    await saveAnswer(
      user.uid,
      parentId,
      questionId,
      questionText,
      questionTextLocale,
      isCustomQuestion,
      answerText
    );

    // Update local state
    setAnsweredIds(prev => new Set(prev).add(questionId));

    // Refresh answers to get the updated data
    await fetchAnswers();
  }, [user, parentId, fetchAnswers]);

  return {
    answers,
    answeredIds,
    answeredCount: answeredIds.size,
    loading,
    error,
    isAnswered,
    getAnswerForQuestion,
    saveQuestionAnswer,
    refreshAnswers: fetchAnswers,
  };
}
