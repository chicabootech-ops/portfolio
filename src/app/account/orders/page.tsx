"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Package } from "lucide-react";
import { PageShell } from "@/components/layout";
import { EmptyState } from "@/components/sections/account/shared/empty-state";
import { OrderStatusBadge } from "@/components/sections/account/shared/order-status-badge";
import { Button } from "@/components/ui/button";
import { formatPaise } from "@/lib/format";
import { mapOrderStatus } from "@/lib/orders";
import { fetchMyOrders, type OrderListItem } from "@/services/commerce.service";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyOrders()
      .then((res) => setOrders(res.items ?? []))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "My Account", href: "/account" },
        { label: "Orders" },
      ]}
      title="My Orders"
      description="View and track your Chic A Boo orders."
    >
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : error ? (
        <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<Package size={24} />}
          title="No orders yet"
          description="When you place an order, it will show up here with tracking and status."
          actionLabel="Continue shopping"
          actionHref="/"
        />
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/30 bg-white/60 px-5 py-4"
            >
              <div>
                <p className="font-medium text-foreground">Order #{order.order_number}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleString("en-IN")} · {order.item_count} item
                  {order.item_count === 1 ? "" : "s"}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <OrderStatusBadge status={mapOrderStatus(order.status)} />
                  <span className="text-sm font-semibold">{formatPaise(order.grand_total_paise)}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link href={`/track-order?id=${order.id}`}>Track</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full">
                  <Link href={`/account/orders/${order.id}`}>Details</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
