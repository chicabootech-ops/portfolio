import { proxyUserApi } from "@/lib/api/bff";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  return proxyUserApi(`/me/security/devices/${id}/revoke`, { method: "POST" });
}
