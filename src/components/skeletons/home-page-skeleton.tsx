import { BestSellingSkeleton } from "./best-selling-skeleton";
import { ShopByCollectionSkeleton } from "./shop-by-collection-skeleton";

export function HomePageSkeleton() {
  return (
    <main className="min-h-screen overflow-x-hidden pt-19 sm:pt-21 lg:pt-40 pb-16">
      <ShopByCollectionSkeleton />
      <BestSellingSkeleton />
      <BestSellingSkeleton />
    </main>
  );
}
