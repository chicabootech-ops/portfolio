"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Download, Loader2 } from "lucide-react";
import { PageShell } from "@/components/layout";
import { OrderStatusBadge } from "@/components/sections/account/shared/order-status-badge";
import { Button } from "@/components/ui/button";
import { formatPaise } from "@/lib/format";
import { mapOrderStatus } from "@/lib/orders";
import { cancelOrder, fetchOrder, type OrderDetail } from "@/services/commerce.service";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchOrder(id)
      .then(setOrder)
      .catch((err) => setError(err instanceof Error ? err.message : "Order not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const onCancel = async () => {
    if (!order || !confirm("Cancel this order?")) return;
    setCancelling(true);
    try {
      const updated = await cancelOrder(order.id, "Cancelled by customer");
      setOrder(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Account", href: "/account" },
        { label: "Orders", href: "/account/orders" },
        { label: order ? `#${order.order_number}` : "Details" },
      ]}
      title={order ? `Order #${order.order_number}` : "Order details"}
      description="Invoice, items, and delivery status."
    >
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : error && !order ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : order ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <OrderStatusBadge status={mapOrderStatus(order.status)} />
            <span className="text-sm text-muted-foreground">
              Payment: {order.payment_status} · Placed{" "}
              {new Date(order.created_at).toLocaleString("en-IN")}
            </span>
          </div>

          <ul className="divide-y divide-border/30 rounded-2xl border border-border/30 bg-white/60">
            {order.items.map((item, i) => (
              <li key={`${item.sku}-${i}`} className="flex justify-between gap-4 px-5 py-4 text-sm">
                <div>
                  <p className="font-medium text-foreground">{item.product_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.variant_title} · Qty {item.quantity}
                  </p>
                </div>
                <span className="font-semibold">{formatPaise(item.line_total_paise)}</span>
              </li>
            ))}
          </ul>

          <dl className="space-y-2 rounded-2xl border border-border/30 bg-white/60 px-5 py-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatPaise(order.subtotal_paise)}</dd>
            </div>
            {order.discount_paise > 0 ? (
              <div className="flex justify-between text-emerald-700">
                <dt>Discount</dt>
                <dd>-{formatPaise(order.discount_paise)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Tax</dt>
              <dd>{formatPaise(order.tax_paise)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>{formatPaise(order.shipping_paise)}</dd>
            </div>
            <div className="flex justify-between border-t border-border/30 pt-2 font-semibold">
              <dt>Total</dt>
              <dd>{formatPaise(order.grand_total_paise)}</dd>
            </div>
          </dl>

          {order.shipping_address?.line1 ? (
            <div className="rounded-2xl border border-border/30 bg-white/60 px-5 py-4 text-sm">
              <p className="font-medium">Shipping to</p>
              <p className="mt-1 text-muted-foreground">
                {order.shipping_address.full_name}
                <br />
                {order.shipping_address.line1}
                {order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ""}
                <br />
                {order.shipping_address.city}, {order.shipping_address.state}{" "}
                {order.shipping_address.postal_code}
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link href={`/track-order?id=${order.id}`}>Track order</Link>
            </Button>
            {order.payment_status === "paid" ? (
              <Button asChild className="rounded-full">
                <a href={`/api/orders/${order.id}/invoice`} target="_blank" rel="noreferrer">
                  <Download size={16} /> Invoice PDF
                </a>
              </Button>
            ) : null}
            {["pending", "confirmed", "processing", "paid"].includes(order.status) &&
            order.payment_status !== "paid" ? (
              <Button
                variant="outline"
                className="rounded-full"
                disabled={cancelling}
                onClick={onCancel}
              >
                {cancelling ? <Loader2 className="animate-spin" size={16} /> : null}
                Cancel order
              </Button>
            ) : null}
            <Button variant="ghost" className="rounded-full" onClick={() => router.push("/account/orders")}>
              Back to orders
            </Button>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      ) : null}
    </PageShell>
  );
}
