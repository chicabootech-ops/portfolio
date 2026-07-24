import type { Metadata } from "next";
import { PageShell } from "@/components/layout";
import { CheckoutView } from "@/components/commerce/checkout-view";

export const metadata: Metadata = {
  title: "Checkout | Chic A Boo",
  description: "Securely complete your Chic A Boo order.",
};

export default function CheckoutPage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Bag", href: "/cart" },
        { label: "Checkout" },
      ]}
      title="Checkout"
      description="Enter your shipping details and pay securely."
    >
      <CheckoutView />
    </PageShell>
  );
}
