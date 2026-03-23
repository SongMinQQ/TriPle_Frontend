import { Skeleton } from "@/shared/ui/skeleton";

export function ScheduleDetailOverviewSkeleton() {
  return (
    <section>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-7 w-48" />
          <div className="mt-2 flex gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>

      <div className="mt-6">
        <Skeleton className="h-5 w-24" />
        <div className="mt-3 flex flex-col gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-40" />
        </div>
      </div>
    </section>
  );
}
