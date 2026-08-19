import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
  columns?: number;
  type?: 'table' | 'card' | 'details';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  rows = 5,
  columns = 4,
  type = 'table',
}) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs animate-pulse space-y-3">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-3 bg-slate-100 rounded w-3/4"></div>
            <div className="h-3 bg-slate-100 rounded w-2/3"></div>
            <div className="pt-2 flex justify-end gap-2">
              <div className="h-7 w-14 bg-slate-100 rounded"></div>
              <div className="h-7 w-14 bg-slate-100 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'details') {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        <div className="space-y-3 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-slate-100">
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
      {/* Header skeleton */}
      <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-slate-200 rounded animate-pulse ${
              i === 0 ? 'w-1/4' : i === columns - 1 ? 'w-24 ml-auto' : 'w-1/5'
            }`}
          />
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rIndex) => (
          <div key={rIndex} className="px-6 py-4 flex items-center gap-4 animate-pulse">
            {Array.from({ length: columns }).map((_, cIndex) => (
              <div
                key={cIndex}
                className={`h-4.5 rounded ${
                  cIndex % 2 === 0 ? 'bg-slate-200/80' : 'bg-slate-100'
                } ${
                  cIndex === 0
                    ? 'w-1/3 font-medium'
                    : cIndex === columns - 1
                    ? 'w-20 ml-auto flex gap-2'
                    : 'w-1/4'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
