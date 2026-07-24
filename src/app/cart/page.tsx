import { PageShell } from "@/components/layout";
import { CartView } from "@/components/commerce/cart-view";

export default function CartPage() {
  return (
    <PageShell
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shopping Bag" }]}
      title="Shopping Bag"
      description="Review your handcrafted picks before checkout."
    >
      <CartView />
    </PageShell>
  );
}
