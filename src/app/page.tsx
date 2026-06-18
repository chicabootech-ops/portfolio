import {
  BestSellingSection,
  ShopByCollectionSection,
  TrendingGiftsSection,
} from "@/components/sections/home";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden pt-36 md:pt-40 pb-16">
      <ShopByCollectionSection />
      <BestSellingSection />
      <TrendingGiftsSection />
    </main>
  );
}
