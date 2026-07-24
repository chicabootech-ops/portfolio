export const siteConfig = {
  name: "Chic A Boo",
  description: "Bespoke flowers and gifts crafted with care.",
  announcement:
    "Crafting bespoke memories. Free delivery on orders over $100. ✨",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"),
  logo: "/logo.jpeg",
  searchPlaceholder: "Find your perfect bouquet...",
} as const;

export const mainNavLinks = [
  { label: "Home", href: "/" },
  { label: "Track Order", href: "/track-order" },
  { label: "About the Founders", href: "/about" },
  {
    label: "Contact Us",
    href: "mailto:hello@chicaboo.co?subject=Chic%20A%20Boo%20inquiry",
  },
] as const;
