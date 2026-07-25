import { PolicyPage } from "@/components/layout/policy-page";

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      description="How Chic A Boo collects, uses, and protects your information."
      sections={[
        {
          title: "Information we collect",
          body: "We collect the details needed to create your account, process orders, deliver purchases, and support you. This may include your name, contact details, addresses, and order history. Payments are processed securely by our payment provider; we do not store full card details.",
        },
        {
          title: "How we use it",
          body: "We use your information to fulfil orders, communicate order updates, prevent fraud, improve our store, and—only with your consent—send marketing emails.",
        },
        {
          title: "Sharing and retention",
          body: "We share only necessary information with trusted providers such as payment, delivery, hosting, and email partners. We retain records only as long as needed for service, legal, tax, and security purposes.",
        },
        {
          title: "Your choices",
          body: "You may update account details, unsubscribe from marketing, or ask about access, correction, or deletion of eligible personal information by contacting us.",
        },
      ]}
    />
  );
}
