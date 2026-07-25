import { proxyBackendApi } from "@/lib/api/backend-proxy";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return proxyBackendApi("/api/cart/apply-coupon", { method: "POST", body });
}

export async function DELETE() {
  return proxyBackendApi("/api/cart/coupon", { method: "DELETE" });
}
