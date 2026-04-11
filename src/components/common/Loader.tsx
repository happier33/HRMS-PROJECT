import React from 'react';

// ── Spinner Loader ──
interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullPage?: boolean;
}

const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

export const Loader: React.FC<LoaderProps> = ({ size = 'md', text, fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg className={`${sizeMap[size]} animate-spin-slow text-primary`} viewBox="0 0 24 24" fill="none">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      {text && <p className="text-sm text-muted-foreground font-medium">{text}</p>}
    </div>
  );

  if (fullPage) {
    return <div className="flex items-center justify-center min-h-[400px]">{content}</div>;
  }
  return content;
};

// ── Skeleton ──
interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-shimmer rounded-md ${className}`} />
);

// ── Skeleton Card ──
export const SkeletonCard: React.FC = () => (
  <div className="hrms-stat-card space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-10 rounded-xl" />
    </div>
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-3 w-20" />
  </div>
);

// ── Table Skeleton ──
export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    <Skeleton className="h-10 w-full rounded-lg" />
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-14 w-full rounded-lg" />
    ))}
  </div>
);

export default Loader;
