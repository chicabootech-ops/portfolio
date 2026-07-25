import { proxyBackendApi } from "@/lib/api/backend-proxy";

export async function GET() {
  return proxyBackendApi("/api/cart");
}
