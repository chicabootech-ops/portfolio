import { Bell } from "lucide-react";
import { PageShell } from "@/components/layout";
import { EmptyState } from "@/components/sections/account/shared/empty-state";

export default function NotificationsPage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Account", href: "/account" },
        { label: "Notifications" },
      ]}
      title="Notifications"
      description="Stay updated on orders, offers, and account activity."
    >
      <EmptyState
        icon={<Bell size={24} />}
        title="You're all caught up"
        description="Order and account alerts will appear here. Manage email preferences from My Account."
        actionLabel="Back to account"
        actionHref="/account"
      />
    </PageShell>
  );
}
