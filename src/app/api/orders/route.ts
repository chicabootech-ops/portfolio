import { proxyBackendApi } from "@/lib/api/backend-proxy";

export async function GET(request: Request) {
  const { search } = new URL(request.url);
  return proxyBackendApi(`/api/orders${search}`);
}
