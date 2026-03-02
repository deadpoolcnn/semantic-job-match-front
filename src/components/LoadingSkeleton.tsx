import { Skeleton } from '@/components/ui/skeleton';

export function LoadingSkeleton() {
  return (
    <div className="flex gap-6 mt-6">
      {/* Left panel skeleton */}
      <div className="w-3/5 space-y-5">
        {/* Radar skeleton */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <Skeleton className="h-5 w-32 mb-4" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>

        {/* Matrix skeleton */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <Skeleton className="h-5 w-40 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-7 w-28 shrink-0" />
                <Skeleton className="h-7 flex-1" />
                <Skeleton className="h-7 flex-1" />
                <Skeleton className="h-7 flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Skill gap skeleton */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <Skeleton className="h-5 w-36 mb-4" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-md" />
            ))}
          </div>
        </div>
      </div>

      {/* Right panel skeleton */}
      <div className="w-2/5 space-y-5">
        {/* Job detail skeleton */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex gap-4 mb-4">
            <Skeleton className="h-16 w-16 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-2.5 w-full rounded-full" />
                <Skeleton className="h-3 w-8 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* AI insight skeleton */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className={`h-4 ${i === 4 ? 'w-2/3' : 'w-full'}`} />
            ))}
          </div>
        </div>

        {/* Timeline skeleton */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <Skeleton className="h-5 w-32 mb-5" />
          <div className="space-y-6">
            {[1, 3, 5].map((y) => (
              <div key={y} className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
