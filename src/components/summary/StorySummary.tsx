'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { QuestionAnswerBlock } from './QuestionAnswerBlock';
import type { QuestionItem } from '@/lib/hooks/useQuestions';
import type { Answer } from '@/lib/types';

interface StorySummaryProps {
  parentName: string;
  questions: QuestionItem[];
  answers: Answer[];
}

export function StorySummary({ parentName, questions, answers }: StorySummaryProps) {
  const t = useTranslations('summary');

  // Create a map of answers by questionId for quick lookup
  const answersMap = useMemo(() => {
    const map = new Map<string, Answer>();
    answers.forEach((answer) => {
      map.set(answer.questionId, answer);
    });
    return map;
  }, [answers]);

  // Get only answered questions, in order
  const answeredQuestions = useMemo(() => {
    return questions
      .filter((q) => answersMap.has(q.id))
      .map((q, index) => ({
        question: q,
        answer: answersMap.get(q.id)!,
        number: index + 1,
      }));
  }, [questions, answersMap]);

  if (answeredQuestions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <p className="text-gray-500">{t('noAnswers')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Question/Answer Blocks */}
      {answeredQuestions.map(({ question, answer, number }) => (
        <QuestionAnswerBlock
          key={question.id}
          questionNumber={number}
          questionText={question.text}
          answer={answer.answer}
        />
      ))}

      {/* Footer - for print */}
      <div className="hidden print:block text-center mt-8 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Created with Parent Stories • {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
