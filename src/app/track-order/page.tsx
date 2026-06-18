import { PageShell } from "@/components/layout";

export default function TrackOrderPage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Track Order" },
      ]}
      title="Track Your Order"
      description="Enter your order details to see delivery status."
    />
  );
}
