'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CuratedQuestionPicker } from './CuratedQuestionPicker';
import { CustomQuestionForm } from './CustomQuestionForm';
import { useCustomQuestions } from '@/lib/hooks/useCustomQuestions';

interface AddQuestionModalProps {
  parentId: string;
  isOpen: boolean;
  onClose: () => void;
  onQuestionAdded?: () => void;
}

type Tab = 'curated' | 'custom';

export function AddQuestionModal({
  parentId,
  isOpen,
  onClose,
  onQuestionAdded,
}: AddQuestionModalProps) {
  const t = useTranslations('questions');
  const [activeTab, setActiveTab] = useState<Tab>('curated');

  const {
    customQuestions,
    selectedQuestions,
    addCustom,
    addSelected,
    isQuestionSelected,
    totalAddedCount,
    maxAddedQuestions,
    canAddMore,
  } = useCustomQuestions(parentId);

  const handleAddCurated = async (questionId: string) => {
    const success = await addSelected(questionId);
    if (success && onQuestionAdded) {
      onQuestionAdded();
    }
    return success;
  };

  const handleAddCustom = async (text: string) => {
    const questionId = await addCustom(text);
    if (questionId && onQuestionAdded) {
      onQuestionAdded();
    }
    return !!questionId;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('addQuestion')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('curated')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'curated'
                ? 'text-olive-600 border-b-2 border-olive-500 bg-olive-50/50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('ourQuestions')}
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'custom'
                ? 'text-olive-600 border-b-2 border-olive-500 bg-olive-50/50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('writeYourOwn')}
          </button>
        </div>

        {/* Counter */}
        <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600">
          {totalAddedCount} / {maxAddedQuestions} {t('addQuestion').toLowerCase()}s added
          {!canAddMore && (
            <span className="text-amber-600 ml-2">({t('maxReached')})</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'curated' ? (
            <CuratedQuestionPicker
              onSelect={handleAddCurated}
              isSelected={isQuestionSelected}
              canAddMore={canAddMore}
            />
          ) : (
            <CustomQuestionForm
              onSubmit={handleAddCustom}
              canAddMore={canAddMore}
            />
          )}
        </div>
      </div>
    </div>
  );
}
