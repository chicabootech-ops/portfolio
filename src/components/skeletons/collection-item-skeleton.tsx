import { Skeleton } from "@/components/ui/skeleton";

export function CollectionItemSkeleton() {
  return (
    <div className="flex w-1/5 shrink-0 flex-col items-center gap-0.5 px-0 sm:w-1/4 sm:gap-2 sm:px-0.5 md:w-[12.5%] md:gap-2.5">
      <Skeleton className="size-12 rounded-full sm:size-18 md:size-21" />
      <Skeleton className="h-2.5 w-10 rounded-full sm:h-3 sm:w-14 md:w-16" />
    </div>
  );
}
