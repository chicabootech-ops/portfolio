import { Suspense } from "react";
import TrackOrderClient from "./track-order-client";

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <TrackOrderClient />
    </Suspense>
  );
}
