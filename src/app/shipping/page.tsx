import { PolicyPage } from "@/components/layout/policy-page";

export default function ShippingPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      description="What to expect while your Chic A Boo order makes its way to you."
      sections={[
        {
          title: "Processing",
          body: "In-stock orders are usually prepared within 2–4 business days. Handmade or personalised pieces may need additional time, which will be noted on the product page or shared with you.",
        },
        {
          title: "Delivery",
          body: "Delivery times vary by destination and begin after dispatch. You will receive tracking details when available. Delays caused by carriers, weather, holidays, or incomplete addresses may be outside our control.",
        },
        {
          title: "Charges and address changes",
          body: "Shipping charges are shown before payment. Contact us promptly if an address needs correction; once dispatched, changes may not be possible.",
        },
        {
          title: "Damaged or missing parcels",
          body: "If your parcel arrives damaged or appears lost, contact us with your order number and photos within 48 hours of delivery so we can investigate.",
        },
      ]}
    />
  );
}
