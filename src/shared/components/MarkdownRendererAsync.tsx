import { lazy, Suspense } from 'react';
import { Skeleton } from '@/widgets/common';

const MarkdownRendererLazy = lazy(() => import('./MarkdownRenderer').then(m => ({ default: m.MarkdownRenderer })));

interface MarkdownRendererLazyProps {
  content: string;
  className?: string;
}

export function MarkdownRendererAsync({ content, className }: MarkdownRendererLazyProps) {
  return (
    <Suspense fallback={<MarkdownSkeleton />}>
      <MarkdownRendererLazy content={content} className={className} />
    </Suspense>
  );
}

function MarkdownSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
      <div className="space-y-2 mt-6">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    </div>
  );
}
