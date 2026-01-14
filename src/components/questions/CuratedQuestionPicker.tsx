'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useQuestions, type QuestionCategory } from '@/lib/hooks/useQuestions';

interface CuratedQuestionPickerProps {
  onSelect: (questionId: string) => Promise<boolean>;
  isSelected: (questionId: string) => boolean;
  canAddMore: boolean;
}

export function CuratedQuestionPicker({
  onSelect,
  isSelected,
  canAddMore,
}: CuratedQuestionPickerProps) {
  const t = useTranslations('questions');
  const { questions, categories } = useQuestions();

  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'all'>('all');
  const [addingId, setAddingId] = useState<string | null>(null);

  // Filter by category - show all curated questions (users add what they want)
  const filteredQuestions = useMemo(() => {
    if (selectedCategory === 'all') {
      return questions;
    }
    return questions.filter((q) => q.category === selectedCategory);
  }, [questions, selectedCategory]);

  const handleSelect = async (questionId: string) => {
    if (!canAddMore || isSelected(questionId)) return;

    setAddingId(questionId);
    try {
      await onSelect(questionId);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
            selectedCategory === 'all'
              ? 'bg-olive-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              selectedCategory === category.id
                ? 'bg-olive-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-2">
        {filteredQuestions.map((question) => {
          const selected = isSelected(question.id);
          const adding = addingId === question.id;

          return (
            <div
              key={question.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                selected
                  ? 'bg-olive-50 border-olive-200'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex-1">
                <p className="text-gray-900">{question.text}</p>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {categories.find((c) => c.id === question.category)?.name}
                </p>
              </div>
              <button
                onClick={() => handleSelect(question.id)}
                disabled={!canAddMore || selected || adding}
                className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  selected
                    ? 'bg-olive-100 text-olive-700 cursor-default'
                    : adding
                    ? 'bg-gray-100 text-gray-400 cursor-wait'
                    : canAddMore
                    ? 'bg-olive-500 text-white hover:bg-olive-600'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {selected ? (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Added
                  </span>
                ) : adding ? (
                  'Adding...'
                ) : (
                  t('addToList')
                )}
              </button>
            </div>
          );
        })}
      </div>

      {filteredQuestions.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No questions in this category
        </p>
      )}
    </div>
  );
}
