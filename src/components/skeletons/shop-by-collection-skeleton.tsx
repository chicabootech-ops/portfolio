import { Skeleton } from "@/components/ui/skeleton";
import { CollectionItemSkeleton } from "./collection-item-skeleton";

export function ShopByCollectionSkeleton() {
  return (
    <section className="w-full pt-4 pb-6 md:w-screen md:border md:border-b-0 md:pt-10 md:pb-8">
      <div className="mb-5 flex flex-col items-center gap-1.5 md:mb-7">
        <Skeleton className="h-5 w-52 rounded-md md:h-6 md:w-60" />
        <Skeleton className="h-px w-10 rounded-full" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-4 gap-5 px-4 sm:gap-6 sm:px-6 md:gap-7 lg:grid-cols-[repeat(auto-fit,minmax(7rem,1fr))] lg:gap-x-3 lg:gap-y-4 lg:px-10 xl:gap-x-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <CollectionItemSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
