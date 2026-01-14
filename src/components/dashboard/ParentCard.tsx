'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

export interface Parent {
  id: string;
  name: string;
  relationship: 'mother' | 'father' | 'other';
  photoUrl?: string | null;
  answeredCount: number;
  totalQuestions: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ParentCardProps {
  parent: Parent;
}

export function ParentCard({ parent }: ParentCardProps) {
  const t = useTranslations('dashboard');
  const tParent = useTranslations('parent');
  const locale = useLocale();

  const progressPercentage = parent.totalQuestions > 0
    ? Math.round((parent.answeredCount / parent.totalQuestions) * 100)
    : 0;

  const getRelationshipLabel = (relationship: string) => {
    switch (relationship) {
      case 'mother':
        return tParent('mother');
      case 'father':
        return tParent('father');
      default:
        return tParent('other');
    }
  };

  return (
    <Link
      href={`/${locale}/parent/${parent.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Photo */}
        <div className="flex-shrink-0">
          {parent.photoUrl ? (
            <Image
              src={parent.photoUrl}
              alt={parent.name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-olive-600">
                {parent.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {parent.name}
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            {getRelationshipLabel(parent.relationship)}
          </p>

          {/* Progress */}
          <div className="space-y-1">
            <div className="text-sm">
              <span className="text-gray-600">
                {t('questionsAnswered', {
                  count: parent.answeredCount,
                  total: parent.totalQuestions,
                })}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-olive-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 self-center">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
