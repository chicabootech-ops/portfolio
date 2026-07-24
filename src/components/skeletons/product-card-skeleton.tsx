import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <article className="flex w-[10.5rem] shrink-0 flex-col gap-3.5 sm:w-[12rem] md:w-[14.5rem]">
      <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
      <div className="flex flex-col gap-1.5 px-1">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-10 rounded-md" />
          <Skeleton className="h-3 w-8 rounded-md" />
        </div>
      </div>
    </article>
  );
}
