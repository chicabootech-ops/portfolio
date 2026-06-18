import { Skeleton } from "@/components/ui/skeleton";
import { CollectionItemSkeleton } from "./collection-item-skeleton";

export function ShopByCollectionSkeleton() {
  return (
    <section className="w-full py-2 md:w-screen md:border md:border-b-0 md:py-12">
      <Skeleton className="mx-auto mb-8 h-4 w-48 rounded-md md:mb-8 md:w-56" />

      <div className="flex overflow-hidden px-3 sm:px-4 md:px-16 lg:px-20">
        {Array.from({ length: 8 }).map((_, index) => (
          <CollectionItemSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
