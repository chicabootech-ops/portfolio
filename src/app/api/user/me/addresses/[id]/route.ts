import { proxyUserApi } from "@/lib/api/bff";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  return proxyUserApi(`/me/addresses/${id}`);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  return proxyUserApi(`/me/addresses/${id}`, { method: "PATCH", body });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  return proxyUserApi(`/me/addresses/${id}`, { method: "DELETE" });
}
