import React from "react";
import { motion } from "motion/react";

export const SkeletonCard = () => {
  return (
    <div className="glass rounded-[32px] p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-[var(--card-border)] rounded animate-pulse" />
            <div className="h-3 w-32 bg-[var(--card-border)]/50 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-12 h-12 rounded-full border-4 border-[var(--card-border)] flex items-center justify-center">
          <div className="w-6 h-6 bg-[var(--card-border)] rounded-full animate-pulse" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-2 w-20 bg-green-500/20 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-[var(--card-border)] rounded animate-pulse" />
            <div className="h-3 w-[90%] bg-[var(--card-border)] rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-2 w-20 bg-orange-500/20 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-[var(--card-border)] rounded animate-pulse" />
            <div className="h-3 w-[85%] bg-[var(--card-border)] rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const AnalysisSkeleton = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-[var(--card-border)]">
        <div className="space-y-4 text-center md:text-left">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-[var(--card-border)] rounded animate-pulse mx-auto md:mx-0" />
            <div className="h-4 w-48 bg-[var(--card-border)]/50 rounded animate-pulse mx-auto md:mx-0" />
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="h-12 w-24 bg-[var(--card-border)] rounded animate-pulse" />
            <div className="w-40 h-2 bg-[var(--card-border)] rounded-full" />
            <div className="h-2 w-20 bg-[var(--card-border)]/30 rounded" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      <div className="glass rounded-[32px] p-8 h-[400px] flex flex-col">
        <div className="h-6 w-48 bg-[var(--card-border)] rounded animate-pulse mx-auto mb-8" />
        <div className="flex-grow flex items-end justify-around gap-4 px-8">
          <div className="w-12 h-[60%] bg-blue-500/20 rounded animate-pulse" />
          <div className="w-12 h-[80%] bg-purple-500/20 rounded animate-pulse" />
          <div className="w-12 h-[40%] bg-orange-500/20 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};
