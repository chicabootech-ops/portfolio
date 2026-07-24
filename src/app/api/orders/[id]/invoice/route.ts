import { proxyBackendBinary } from "@/lib/api/backend-proxy";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyBackendBinary(`/api/orders/${id}/invoice`);
}
