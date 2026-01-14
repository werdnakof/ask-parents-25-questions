'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface CustomQuestionFormProps {
  onSubmit: (text: string) => Promise<boolean>;
  canAddMore: boolean;
}

export function CustomQuestionForm({ onSubmit, canAddMore }: CustomQuestionFormProps) {
  const t = useTranslations('questions');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim() || !canAddMore || submitting) return;

    setSubmitting(true);
    setSuccess(false);

    try {
      const result = await onSubmit(text.trim());
      if (result) {
        setText('');
        setSuccess(true);
        // Hide success message after 2 seconds
        setTimeout(() => setSuccess(false), 2000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="custom-question" className="block text-sm font-medium text-gray-700 mb-2">
          {t('writeYourOwn')}
        </label>
        <textarea
          id="custom-question"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('customPlaceholder')}
          disabled={!canAddMore || submitting}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          rows={4}
          maxLength={500}
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-500">
            {text.length} / 500
          </p>
          {!canAddMore && (
            <p className="text-xs text-amber-600">
              {t('maxReached')}
            </p>
          )}
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {t('questionAdded')}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!text.trim() || !canAddMore || submitting}
        className="w-full px-4 py-3 bg-olive-500 hover:bg-olive-600 text-white font-medium rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Adding...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('addToList')}
          </>
        )}
      </button>

      {/* Tips */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Tips for great questions:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Ask about specific memories or events</li>
          <li>• Include context (e.g., "When you were my age...")</li>
          <li>• Ask about feelings, not just facts</li>
          <li>• Be curious and open-ended</li>
        </ul>
      </div>
    </form>
  );
}
