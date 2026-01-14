'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useParents } from '@/lib/hooks/useParents';
import { ParentPhotoUpload } from './ParentPhotoUpload';
import { Button, Input } from '@/components/ui';

type Relationship = 'mother' | 'father' | 'other';

export function AddParentForm() {
  const t = useTranslations('parent');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const { addParent } = useParents();

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<Relationship>('mother');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }

    setLoading(true);

    try {
      await addParent({
        name: name.trim(),
        relationship,
        photoFile: photoFile || undefined,
      });

      toast.success(t('parentAdded'));
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      console.error('Error adding parent:', err);
      const errorMessage = t('addParentError');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const relationships: { value: Relationship; label: string }[] = [
    { value: 'mother', label: t('mother') },
    { value: 'father', label: t('father') },
    { value: 'other', label: t('other') },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo Upload */}
      <div className="flex justify-center">
        <ParentPhotoUpload
          onPhotoSelect={setPhotoFile}
          name={name}
        />
      </div>

      {/* Name Input */}
      <Input
        label={t('nameLabel') || 'Name'}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('namePlaceholder') || 'Enter their name'}
        required
      />

      {/* Relationship Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('relationshipLabel') || 'Relationship'}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {relationships.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRelationship(value)}
              className={`
                py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all
                ${relationship === value
                  ? 'border-olive-500 bg-olive-50 text-olive-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          {tCommon('cancel')}
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="flex-1"
        >
          {t('addParentButton') || 'Add Parent'}
        </Button>
      </div>
    </form>
  );
}
