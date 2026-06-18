export type NavCategory = {
  label: string;
  href: string;
};

export const shopCategories: NavCategory[] = [
  { label: "Trending Flowers", href: "/category/trending" },
  { label: "Personalized Roses", href: "/category/personalized" },
  { label: "Bespoke Garlands", href: "/category/garlands" },
  { label: "Gifts for Her", href: "/category/gifts-her" },
  { label: "Corporate Gifting", href: "/category/corporate" },
];

export const categoryTitles: Record<string, string> = Object.fromEntries(
  shopCategories.map((category) => [
    category.href.replace("/category/", ""),
    category.label,
  ])
);
