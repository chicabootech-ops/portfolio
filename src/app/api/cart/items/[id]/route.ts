import { proxyBackendApi } from "@/lib/api/backend-proxy";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const body = await request.json().catch(() => ({}));
  return proxyBackendApi(`/api/cart/items/${id}`, { method: "PATCH", body });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  return proxyBackendApi(`/api/cart/items/${id}`, { method: "DELETE" });
}
