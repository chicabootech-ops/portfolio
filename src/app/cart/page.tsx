import { PageShell } from "@/components/layout";

export default function CartPage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Shopping Cart" },
      ]}
      title="Shopping Cart"
      description="Review your items before checkout."
    />
  );
}
