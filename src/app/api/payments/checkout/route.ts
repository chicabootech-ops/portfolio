import { proxyBackendApi } from "@/lib/api/backend-proxy";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return proxyBackendApi("/api/payments/checkout", { method: "POST", body });
}
