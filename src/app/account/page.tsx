import { PageShell } from "@/components/layout";

export default function AccountPage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Account" },
      ]}
      title="My Account"
      description="Manage your profile, orders, and preferences."
    />
  );
}
