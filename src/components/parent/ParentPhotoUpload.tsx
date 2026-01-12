'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface ParentPhotoUploadProps {
  currentPhotoUrl?: string | null;
  onPhotoSelect: (file: File | null) => void;
  name?: string;
}

export function ParentPhotoUpload({ currentPhotoUrl, onPhotoSelect, name }: ParentPhotoUploadProps) {
  const t = useTranslations('parent');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      setPreviewUrl(null);
      onPhotoSelect(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onPhotoSelect(file);
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    onPhotoSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayUrl = previewUrl || currentPhotoUrl;
  const initial = name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="flex flex-col items-center">
      {/* Photo Preview */}
      <div className="relative mb-4">
        {displayUrl ? (
          <div className="relative">
            <Image
              src={displayUrl}
              alt={name || 'Parent photo'}
              width={120}
              height={120}
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
              aria-label="Remove photo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="w-28 h-28 bg-olive-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <span className="text-4xl font-semibold text-olive-600">{initial}</span>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="photo-upload"
      />
      <label
        htmlFor="photo-upload"
        className="cursor-pointer text-sm text-olive-600 hover:text-olive-700 font-medium flex items-center gap-1 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {displayUrl ? 'Change Photo' : t('addPhoto')}
      </label>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
