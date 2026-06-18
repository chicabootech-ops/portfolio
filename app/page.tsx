import { HeroCarousel } from "@/section/home/carousel";
import { ShopByCollection } from "@/section/home/collection";

export default function HomePage() {
  return (
    <main className="min-h-screen pt-36 md:pt-40 pb-16">
      <HeroCarousel />
      <ShopByCollection />
    </main>
  );
}
