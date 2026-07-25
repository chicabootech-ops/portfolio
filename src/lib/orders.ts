export type UiOrderStatus =
  | "delivered"
  | "shipped"
  | "processing"
  | "cancelled"
  | "refunded";

export function mapOrderStatus(status: string): UiOrderStatus {
  const s = status.toLowerCase();
  if (s === "delivered" || s === "completed") return "delivered";
  if (s === "shipped" || s === "out_for_delivery") return "shipped";
  if (s === "cancelled") return "cancelled";
  if (s === "refunded" || s === "returned") return "refunded";
  return "processing";
}
