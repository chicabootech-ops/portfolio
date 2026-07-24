import { PageShell } from "@/components/layout";

export default function WishlistPage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Wishlist" },
      ]}
      title="Wishlist"
      description="Save your favorite bouquets and gifts for later."
    />
  );
}
