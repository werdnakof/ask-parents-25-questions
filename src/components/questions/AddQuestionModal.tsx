'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { CuratedQuestionPicker } from './CuratedQuestionPicker';
import { CustomQuestionForm } from './CustomQuestionForm';
import { UpgradePrompt } from './UpgradePrompt';
import { useCustomQuestions } from '@/lib/hooks/useCustomQuestions';

interface AddQuestionModalProps {
  parentId: string;
  isOpen: boolean;
  onClose: () => void;
  onQuestionAdded?: () => void;
  hasReachedFreeLimit?: boolean;
}

type Tab = 'curated' | 'custom';

export function AddQuestionModal({
  parentId,
  isOpen,
  onClose,
  onQuestionAdded,
  hasReachedFreeLimit: hasReachedFreeLimitProp,
}: AddQuestionModalProps) {
  const t = useTranslations('questions');
  const tPremium = useTranslations('premium');
  const [activeTab, setActiveTab] = useState<Tab>('curated');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const {
    addCustom,
    addSelected,
    isQuestionSelected,
    totalAddedCount,
    questionLimit,
    freeQuestionLimit,
    canAddMore,
    hasReachedFreeLimit: hasReachedFreeLimitHook,
    isPremium,
  } = useCustomQuestions(parentId);

  // Use prop if provided, otherwise use hook value
  const hasReachedFreeLimit = hasReachedFreeLimitProp ?? hasReachedFreeLimitHook;

  const handleAddCurated = async (questionId: string) => {
    const success = await addSelected(questionId);
    if (success) {
      toast.success(t('questionAdded'));
      if (onQuestionAdded) {
        onQuestionAdded();
      }
    } else {
      toast.error(t('addError'));
    }
    return success;
  };

  const handleAddCustom = async (text: string) => {
    const questionId = await addCustom(text);
    if (questionId) {
      toast.success(t('questionAdded'));
      if (onQuestionAdded) {
        onQuestionAdded();
      }
    } else {
      toast.error(t('addError'));
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
          {totalAddedCount} {t('questionsAdded')}
          {!canAddMore && (
            <span className="text-amber-600 ml-2">({t('maxReached')})</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Show upgrade prompt when free user reaches limit */}
          {hasReachedFreeLimit ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-olive-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {tPremium('unlock')}
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-4">
                {tPremium('limitReached')}
              </p>
              <button
                onClick={() => setShowUpgradePrompt(true)}
                className="px-6 py-3 bg-olive-500 hover:bg-olive-600 text-white font-medium rounded-lg transition-colors"
              >
                {tPremium('cta')} - {tPremium('price')}
              </button>
            </div>
          ) : activeTab === 'curated' ? (
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

      {/* Upgrade Prompt Modal */}
      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
      />
    </div>
  );
}
