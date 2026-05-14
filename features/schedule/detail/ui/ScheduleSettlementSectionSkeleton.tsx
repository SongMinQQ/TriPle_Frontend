import { Skeleton } from "@/shared/ui/skeleton";

export function ScheduleSettlementSectionSkeleton() {
  return (
    <section className="flex flex-col gap-6" aria-label="여행 정산 로딩">
      <div>
        <Skeleton className="h-5 w-20" />
        <Skeleton className="mt-3 h-12 w-full rounded-lg" />
      </div>

      <div>
        <Skeleton className="h-5 w-36" />
        <div className="mt-3 flex flex-wrap gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-5 w-24" />
            <div className="mt-2 flex gap-3">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </section>
  );
}
