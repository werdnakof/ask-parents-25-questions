'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useDebounce } from '@/lib/hooks/useDebounce';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AnswerTextareaProps {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
}

export function AnswerTextarea({
  initialValue,
  onSave,
  placeholder,
  disabled = false,
}: AnswerTextareaProps) {
  const t = useTranslations('questions');
  const [value, setValue] = useState(initialValue);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSavedValue, setLastSavedValue] = useState(initialValue);

  // Update value when initialValue changes (e.g., navigating between questions)
  useEffect(() => {
    setValue(initialValue);
    setLastSavedValue(initialValue);
    setSaveStatus('idle');
  }, [initialValue]);

  const performSave = useCallback(async (textToSave: string) => {
    // Don't save if value hasn't changed from last saved
    if (textToSave === lastSavedValue) {
      return;
    }

    // Don't save empty values if there was no previous answer
    if (!textToSave.trim() && !lastSavedValue.trim()) {
      return;
    }

    try {
      setSaveStatus('saving');
      await onSave(textToSave);
      setLastSavedValue(textToSave);
      setSaveStatus('saved');

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setSaveStatus((current) => (current === 'saved' ? 'idle' : current));
      }, 2000);
    } catch (err) {
      console.error('Error saving answer:', err);
      setSaveStatus('error');
      toast.error(t('saveError'));
    }
  }, [onSave, lastSavedValue, t]);

  // Debounced save function (1 second delay)
  const debouncedSave = useDebounce(performSave, 1000);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSave(newValue);
  };

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder || t('placeholder')}
        disabled={disabled}
        className={`w-full min-h-[200px] p-4 border rounded-lg resize-y transition-colors ${
          disabled
            ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-white border-gray-300 focus:border-olive-500 focus:ring-2 focus:ring-olive-500/20 focus:outline-none'
        }`}
        rows={8}
      />

      {/* Save Status Indicator */}
      <div className="flex justify-end">
        {saveStatus === 'saving' && (
          <span className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t('saving')}
          </span>
        )}
        {saveStatus === 'saved' && (
          <span className="flex items-center gap-2 text-sm text-olive-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('saved')}
          </span>
        )}
        {saveStatus === 'error' && (
          <span className="flex items-center gap-2 text-sm text-red-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Error saving
          </span>
        )}
      </div>
    </div>
  );
}
