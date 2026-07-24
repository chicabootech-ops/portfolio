import { Suspense } from "react";
import { OrderSuccess } from "@/components/commerce/order-success";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen px-4 pb-16 pt-19 sm:pt-21 lg:pt-40">
      <Suspense fallback={null}>
        <OrderSuccess />
      </Suspense>
    </main>
  );
}
