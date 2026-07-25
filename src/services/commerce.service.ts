export type CheckoutAddress = {
  full_name: string;
  phone?: string | null;
  line1: string;
  line2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
};

export type CheckoutItem = {
  slug?: string;
  variant_id?: string;
  product_id?: string;
  quantity: number;
};

export type RazorpayCheckout = {
  key_id: string;
  razorpay_order_id: string;
  amount_paise: number;
  currency: string;
  name: string;
  description: string;
  prefill_name?: string | null;
  prefill_email?: string | null;
  prefill_contact?: string | null;
};

export type CheckoutResponse = {
  order_id: string;
  order_number: number;
  grand_total_paise: number;
  payment_status: string;
  razorpay: RazorpayCheckout | null;
};

export type PaymentStatus = {
  order_id: string;
  order_number: number;
  payment_status: string;
  order_status: string;
  provider: string | null;
  provider_payment_id: string | null;
  amount_paise: number;
  invoice_number: number | null;
};

export type OrderListItem = {
  id: string;
  order_number: number;
  status: string;
  payment_status: string;
  grand_total_paise: number;
  item_count: number;
  created_at: string;
};

async function jsonOrThrow<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data as { error?: { message?: string }; detail?: string }).error?.message ??
      (data as { detail?: string }).detail ??
      "Something went wrong. Please try again.";
    throw new Error(message);
  }
  return data as T;
}

export async function getPaymentConfig(): Promise<{ enabled: boolean; key_id: string | null }> {
  const res = await fetch("/api/payments/config", { cache: "no-store" });
  return jsonOrThrow(res);
}

export type OrderDetail = {
  id: string;
  order_number: number;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  currency: string;
  subtotal_paise: number;
  discount_paise: number;
  tax_paise: number;
  shipping_paise: number;
  grand_total_paise: number;
  shipping_address: Record<string, string>;
  customer_note: string | null;
  created_at: string;
  items: {
    product_name: string;
    variant_title: string;
    sku: string;
    quantity: number;
    unit_price_paise: number;
    line_total_paise: number;
  }[];
  invoice: { invoice_number: number; has_pdf: boolean; issued_at: string | null } | null;
};

export async function createCheckout(payload: {
  items: CheckoutItem[];
  shipping_address: CheckoutAddress;
  billing_address?: CheckoutAddress;
  customer_note?: string;
  coupon_code?: string;
  idempotency_key?: string;
}): Promise<CheckoutResponse> {
  const res = await fetch("/api/payments/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return jsonOrThrow(res);
}

export async function verifyPayment(payload: {
  order_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<PaymentStatus> {
  const res = await fetch("/api/payments/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return jsonOrThrow(res);
}

export async function fetchMyOrders(): Promise<{
  items: OrderListItem[];
  total: number;
  page?: number;
  page_size?: number;
}> {
  const res = await fetch("/api/orders", { cache: "no-store" });
  return jsonOrThrow(res);
}

export async function fetchOrder(orderId: string): Promise<OrderDetail> {
  const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
  return jsonOrThrow(res);
}

export async function cancelOrder(orderId: string, reason?: string): Promise<OrderDetail> {
  const res = await fetch(`/api/orders/${orderId}/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });
  return jsonOrThrow(res);
}
