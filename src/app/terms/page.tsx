import { PolicyPage } from "@/components/layout/policy-page";

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      description="The terms that apply when you browse or shop with Chic A Boo."
      sections={[
        {
          title: "Using our store",
          body: "By using this website, you agree to provide accurate information, use the service lawfully, and keep your account credentials secure.",
        },
        {
          title: "Products and orders",
          body: "Our pieces may show small handmade variations. Product colours can also vary by display. Orders are subject to availability and are accepted when we confirm them. We may cancel and refund orders affected by pricing, inventory, or verification errors.",
        },
        {
          title: "Payments and delivery",
          body: "Prices are shown in INR and applicable charges are displayed at checkout. Payment is handled by our secure payment provider. Delivery estimates are not guarantees and may be affected by events outside our control.",
        },
        {
          title: "Intellectual property",
          body: "Chic A Boo branding, photography, writing, and designs may not be copied or commercially reused without permission.",
        },
      ]}
    />
  );
}
