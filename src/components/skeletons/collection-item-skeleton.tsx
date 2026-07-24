import { Skeleton } from "@/components/ui/skeleton";

export function CollectionItemSkeleton() {
  return (
    <div className="flex w-full max-w-36 flex-col items-center gap-2.5">
      <Skeleton className="size-[4.5rem] rounded-full sm:size-20 md:size-[5.5rem] lg:size-22 xl:size-24" />
      <Skeleton className="h-10.5 w-full rounded-md md:h-11" />
    </div>
  );
}
