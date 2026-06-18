import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type PageSkeletonProps = {
  titleWidth?: string;
  lines?: number;
  showCards?: boolean;
};

export function PageSkeleton({
  titleWidth = "w-48",
  lines = 2,
  showCards = false,
}: PageSkeletonProps) {
  return (
    <main className="min-h-screen pt-36 md:pt-40 px-6 md:px-8 pb-16">
      <Skeleton className={cn("h-9 rounded-md md:h-10", titleWidth)} />
      <div className="mt-4 flex max-w-xl flex-col gap-2">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            className={cn(
              "h-4 rounded-md",
              index === lines - 1 ? "w-4/5" : "w-full"
            )}
          />
        ))}
      </div>

      {showCards ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : null}
    </main>
  );
}
