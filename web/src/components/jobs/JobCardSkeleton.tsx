import { Skeleton } from '../ui/Skeleton';

function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-3 mb-4">
        {/* Company logo */}
        <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          {/* Job title */}
          <Skeleton className="h-4 w-3/4" />
          {/* Company name */}
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      {/* Location + type line */}
      <Skeleton className="h-3 w-2/5 mb-3" />
      {/* Tags */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

export function JobCardSkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}