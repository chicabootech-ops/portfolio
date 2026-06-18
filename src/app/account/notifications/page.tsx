import { PageShell } from "@/components/layout";

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
    />
  );
}
