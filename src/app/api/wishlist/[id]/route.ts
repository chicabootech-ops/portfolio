import { proxyBackendApi } from "@/lib/api/backend-proxy";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  return proxyBackendApi(`/api/wishlist/${id}`, { method: "DELETE" });
}
