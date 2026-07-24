import { PageShell } from "@/components/layout";

export default function OrdersPage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Account", href: "/account" },
        { label: "Orders" },
      ]}
      title="My Orders"
      description="View and track your Chic A Boo orders."
    />
  );
}
