import {
  BestSellingSection,
  ShopByCollectionSection,
  TrendingGiftsSection,
} from "@/components/sections/home";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden pt-19 sm:pt-21 lg:pt-40 pb-16">
      <ShopByCollectionSection />
      <BestSellingSection />
      <TrendingGiftsSection />
    </main>
  );
}
