import { Skeleton } from "@/components/ui/skeleton";
import { ProductCardSkeleton } from "./product-card-skeleton";

export function BestSellingSkeleton() {
  return (
    <section className="w-full py-12 md:w-screen md:py-16">
      <Skeleton className="mx-auto mb-10 h-4 w-40 rounded-md md:mb-12 md:w-48" />

      <div className="flex gap-8 overflow-hidden px-6 sm:gap-10 md:gap-12 md:px-16 lg:px-20">
        {Array.from({ length: 5 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>

      <div className="mt-10 flex justify-center md:mt-12">
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </section>
  );
}
