"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import type { AccountOrder } from "@/types/account";
import { SectionCard } from "./shared/section-card";
import { OrderStatusBadge } from "./shared/order-status-badge";
import { EmptyState } from "./shared/empty-state";

type RecentOrdersProps = {
  orders: AccountOrder[];
};

function formatOrderDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <SectionCard
      title="Recent Orders"
      action={
        <Link
          href="/account/orders"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      }
    >
      {orders.length === 0 ? (
        <EmptyState
          icon={<Package size={24} />}
          title="No orders yet"
          description="Your bespoke bouquets and gifts will appear here once you place an order."
          actionLabel="Start Shopping"
          actionHref="/"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order, index) => (
            <motion.article
              key={order.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className="flex flex-col gap-3 rounded-xl border border-border/25 bg-background/60 p-3 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={order.productImage}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">
                    {order.productName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.orderNumber}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-sm font-semibold text-foreground">
                      {formatPrice(order.price)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatOrderDate(order.orderedAt)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 sm:flex-col sm:gap-1.5">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-11 min-h-[44px] flex-1 rounded-full sm:flex-none sm:px-4"
                >
                  <Link href={`/track-order?order=${order.orderNumber}`}>
                    Track
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="h-11 min-h-[44px] flex-1 rounded-full sm:flex-none sm:px-4"
                >
                  <Link href={`/account/orders/${order.id}`}>Details</Link>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
