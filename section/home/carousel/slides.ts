export type CarouselSlide = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  offer: string;
  startingPrice: string;
  originalPrice?: string;
  perks: string[];
  quickPicks: Array<{
    label: string;
    href: string;
  }>;
  ctaLabel: string;
  ctaHref: string;
  image: string;
};

export const slides: CarouselSlide[] = [
  {
    id: "premium-blooms",
    eyebrow: "New Season Edit",
    title: "Premium Blooms",
    subtitle: "Handpicked flowers arranged to make every moment unforgettable.",
    offer: "Flat 15% Off",
    startingPrice: "From $49",
    originalPrice: "$58",
    perks: ["Same-day dispatch", "Luxury wrap included", "Freshness guarantee"],
    quickPicks: [
      { label: "Sunset Roses", href: "/collection/premium-blooms" },
      { label: "Peony Luxe", href: "/collection/premium-blooms" },
    ],
    ctaLabel: "Shop Blooms",
    ctaHref: "/collection/premium-blooms",
    image: "/collections/premium-blooms.jpg",
  },
  {
    id: "wedding-bouquets",
    eyebrow: "Bridal Bestsellers",
    title: "Wedding Bouquets",
    subtitle: "Elegant arrangements crafted for your perfect day.",
    offer: "Free Bridal Note Card",
    startingPrice: "From $79",
    perks: ["Custom color palettes", "Scheduled delivery", "Venue-ready finishing"],
    quickPicks: [
      { label: "Ivory Cascade", href: "/collection/wedding-bouquets" },
      { label: "Blush Whisper", href: "/collection/wedding-bouquets" },
    ],
    ctaLabel: "Explore Weddings",
    ctaHref: "/collection/wedding-bouquets",
    image: "/collections/wedding-bouquets.jpg",
  },
  {
    id: "gift-box",
    eyebrow: "Signature Gifting",
    title: "Curated Gift Boxes",
    subtitle: "Thoughtfully wrapped gifts that arrive ready to delight.",
    offer: "Buy 2 Get 1 Mini Gift",
    startingPrice: "From $35",
    perks: ["Premium packaging", "Gift-ready notes", "Perfect for surprises"],
    quickPicks: [
      { label: "Rose & Cocoa Box", href: "/collection/gift-box" },
      { label: "Tea Time Bloom Box", href: "/collection/gift-box" },
    ],
    ctaLabel: "Shop Gift Boxes",
    ctaHref: "/collection/gift-box",
    image: "/collections/gift-box.jpg",
  },
  {
    id: "customise",
    eyebrow: "Made Just For You",
    title: "Make It Yours",
    subtitle: "Personalise bouquets, colours, and messages for a one-of-a-kind gift.",
    offer: "Personalisation Included",
    startingPrice: "From $29",
    perks: ["Name charms", "Custom message ribbons", "Color-match your theme"],
    quickPicks: [
      { label: "Start Custom Bouquet", href: "/customise" },
      { label: "Build Gift Combo", href: "/customise" },
    ],
    ctaLabel: "Customise Now",
    ctaHref: "/customise",
    image: "/collections/jumbo-bouquets.jpg",
  },
];
