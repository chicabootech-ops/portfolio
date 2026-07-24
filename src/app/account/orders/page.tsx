import { Package } from "lucide-react";
import { PageShell } from "@/components/layout";
import { EmptyState } from "@/components/sections/account/shared/empty-state";

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
    >
      <EmptyState
        icon={<Package size={24} />}
        title="No orders yet"
        description="When you place an order, it will show up here with tracking and status."
        actionLabel="Continue shopping"
        actionHref="/"
      />
    </PageShell>
  );
}
