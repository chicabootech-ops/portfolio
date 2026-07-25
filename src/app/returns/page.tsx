import Link from "next/link";
import { PolicyPage } from "@/components/layout/policy-page";

export default function ReturnsPolicyPage() {
  return (
    <>
      <PolicyPage
        title="Returns Policy"
        description="Simple guidance for requesting a return."
        sections={[
          {
            title: "Eligibility",
            body: "Contact us within 7 days of delivery. Eligible items should be unused, in their original condition, and returned with their packaging. Personalised, made-to-order, final-sale, and hygiene-sensitive items may not be returnable unless faulty.",
          },
          {
            title: "Requesting a return",
            body: "Sign in, open Returns in your account, and submit the order number and reason. Please wait for approval and return instructions before sending an item.",
          },
          {
            title: "Refunds",
            body: "Approved refunds are issued after inspection to the original payment method. Shipping charges are generally non-refundable unless the item was incorrect or faulty. Bank processing times may vary.",
          },
        ]}
      />
      <div className="fixed bottom-5 right-5">
        <Link
          href="/account/returns"
          className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg"
        >
          Request a return
        </Link>
      </div>
    </>
  );
}
