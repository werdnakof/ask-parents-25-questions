'use client';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

// Pre-built skeleton components for common patterns

export function ParentCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-4">
        {/* Photo skeleton */}
        <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />

        {/* Content skeleton */}
        <div className="flex-1 min-w-0">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-20 mb-3" />
          {/* Progress bar skeleton */}
          <Skeleton className="h-2 w-full rounded-full mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
      <ParentCardSkeleton />
      <ParentCardSkeleton />
    </div>
  );
}

export function QuestionListItemSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
      {/* Question number */}
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />

      {/* Question text */}
      <div className="flex-1">
        <Skeleton className="h-4 w-full max-w-md" />
      </div>

      {/* Checkbox */}
      <Skeleton className="w-6 h-6 rounded flex-shrink-0" />
    </div>
  );
}

export function QuestionListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <QuestionListItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function ParentHeaderSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Photo */}
          <Skeleton className="w-20 h-20 rounded-full" />

          {/* Name and relationship */}
          <div>
            <Skeleton className="h-7 w-40 mb-2" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Button */}
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}

export function QuestionDetailSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Question number */}
      <Skeleton className="h-4 w-32 mb-4" />

      {/* Question text */}
      <Skeleton className="h-8 w-full max-w-2xl mb-2" />
      <Skeleton className="h-8 w-3/4 mb-6" />

      {/* Answer textarea */}
      <Skeleton className="h-40 w-full rounded-lg mb-4" />

      {/* Save indicator */}
      <Skeleton className="h-4 w-20 mb-6" />

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <Skeleton className="h-10 w-28 rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  );
}
