import { proxyBackendApi } from "@/lib/api/backend-proxy";

export async function GET() {
  return proxyBackendApi("/api/wishlist");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return proxyBackendApi("/api/wishlist", { method: "POST", body });
}
