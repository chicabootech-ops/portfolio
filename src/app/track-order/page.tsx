"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PageShell } from "@/components/layout";
import { OrderStatusBadge } from "@/components/sections/account/shared/order-status-badge";
import { Button } from "@/components/ui/button";
import { formatPaise } from "@/lib/format";
import { mapOrderStatus } from "@/lib/orders";
import {
  fetchMyOrders,
  fetchOrder,
  type OrderDetail,
  type OrderListItem,
} from "@/services/commerce.service";

export default function TrackOrderPage() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("order") ?? "");
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function resolve(orderId?: string | null, orderNumber?: string | null) {
    setLoading(true);
    setError(null);
    try {
      if (orderId) {
        setOrder(await fetchOrder(orderId));
        return;
      }
      const list = await fetchMyOrders();
      const match = (list.items ?? []).find(
        (o: OrderListItem) =>
          String(o.order_number) === String(orderNumber)?.replace(/^#/, "")
      );
      if (!match) {
        setOrder(null);
        setError("No matching order found in your account.");
        return;
      }
      setOrder(await fetchOrder(match.id));
    } catch (err) {
      setOrder(null);
      setError(err instanceof Error ? err.message : "Could not load order");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = params.get("id");
    const num = params.get("order");
    if (id || num) void resolve(id, num);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void resolve(null, query.trim());
  };

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Track Order" },
      ]}
      title="Track Your Order"
      description="Enter your order number to see delivery status."
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1.5 text-sm">
          <span className="text-muted-foreground">Order number</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 10042"
            className="h-11 rounded-xl border border-border/60 bg-white/80 px-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </label>
        <Button type="submit" className="h-11 rounded-full px-8" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Track"}
        </Button>
      </form>

      {error ? (
        <p className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error} Sign in if you haven’t yet.
        </p>
      ) : null}

      {order ? (
        <div className="mt-8 space-y-4 rounded-2xl border border-border/30 bg-white/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-heading text-xl">Order #{order.order_number}</p>
              <p className="text-sm text-muted-foreground">
                {formatPaise(order.grand_total_paise)} ·{" "}
                {new Date(order.created_at).toLocaleString("en-IN")}
              </p>
            </div>
            <OrderStatusBadge status={mapOrderStatus(order.status)} />
          </div>
          <p className="text-sm text-muted-foreground">
            Fulfillment: {order.fulfillment_status} · Payment: {order.payment_status}
          </p>
          <ol className="space-y-2 border-l border-border/40 pl-4 text-sm">
            <li>
              <span className="font-medium capitalize">{order.status}</span>
              <span className="text-muted-foreground"> — current status</span>
            </li>
            {order.payment_status === "paid" ? (
              <li className="text-muted-foreground">Payment confirmed</li>
            ) : (
              <li className="text-muted-foreground">Awaiting payment confirmation</li>
            )}
          </ol>
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/account/orders/${order.id}`}>View full details</Link>
          </Button>
        </div>
      ) : null}
    </PageShell>
  );
}
