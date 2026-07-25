import { proxyBackendApi } from "@/lib/api/backend-proxy";

export async function POST(request: Request) {
  const body = await request.json().catch(() => []);
  return proxyBackendApi("/api/cart/merge", { method: "POST", body });
}
