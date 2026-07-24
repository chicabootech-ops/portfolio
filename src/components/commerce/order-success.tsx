"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Download, Package } from "lucide-react";

export function OrderSuccess() {
  const params = useSearchParams();
  const orderNumber = params.get("order");
  const orderId = params.get("id");
  const invoice = params.get("invoice");

  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 size={44} strokeWidth={1.5} />
      </div>
      <h1 className="mt-6 font-heading text-3xl font-semibold text-foreground">
        Thank you for your order!
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Your payment was successful and your order is confirmed. A confirmation has
        been emailed to you.
      </p>

      {orderNumber && (
        <div className="mx-auto mt-8 w-full rounded-2xl border border-border/40 bg-white/70 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Order number</p>
          <p className="mt-1 font-heading text-2xl font-semibold text-primary">
            CAB{orderNumber}
          </p>
          {invoice && (
            <p className="mt-2 text-xs text-muted-foreground">Invoice #{invoice} generated</p>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {orderId && (
          <a
            href={`/api/orders/${orderId}/invoice`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-primary/40 bg-white/70 px-7 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-primary/10"
          >
            <Download size={16} /> Download invoice
          </a>
        )}
        <Link
          href="/account/orders"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-primary/40 bg-white/70 px-7 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-primary/10"
        >
          <Package size={16} /> View my orders
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
