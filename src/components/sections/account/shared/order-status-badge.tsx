import type { OrderStatus } from "@/types/account";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: "success" | "default" | "warning" | "destructive" | "muted" }
> = {
  delivered: { label: "Delivered", variant: "success" },
  shipped: { label: "Shipped", variant: "default" },
  processing: { label: "Processing", variant: "warning" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  refunded: { label: "Refunded", variant: "muted" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
