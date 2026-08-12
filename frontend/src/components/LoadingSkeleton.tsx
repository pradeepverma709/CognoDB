import React from 'react';

export const LoadingSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-panel rounded-2xl overflow-hidden animate-pulse border border-slate-800">
          <div className="aspect-[2/3] w-full bg-slate-800/60" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-800/80 rounded w-3/4" />
            <div className="h-3 bg-slate-800/60 rounded w-1/2" />
            <div className="flex gap-2 pt-2">
              <div className="h-5 bg-slate-800/60 rounded w-12" />
              <div className="h-5 bg-slate-800/60 rounded w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
