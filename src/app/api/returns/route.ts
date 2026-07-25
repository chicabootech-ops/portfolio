import { proxyBackendApi } from "@/lib/api/backend-proxy";

export async function GET() {
  return proxyBackendApi("/api/returns");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return proxyBackendApi("/api/returns", { method: "POST", body });
}
