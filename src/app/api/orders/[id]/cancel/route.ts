import { proxyBackendApi } from "@/lib/api/backend-proxy";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  return proxyBackendApi(`/api/orders/${id}/cancel`, { method: "POST", body });
}
