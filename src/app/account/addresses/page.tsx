import { PageShell } from "@/components/layout";

export default function AddressesPage() {
  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Account", href: "/account" },
        { label: "Saved Addresses" },
      ]}
      title="Saved Addresses"
      description="Manage delivery addresses for faster checkout."
    />
  );
}
