import { passthroughBackend, proxyBackendApi } from "@/lib/api/backend-proxy";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  return passthroughBackend(`/api/products/${encodeURIComponent(slug)}/reviews`);
}

export async function POST(request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const body = await request.json().catch(() => ({}));
  return proxyBackendApi(`/api/products/${encodeURIComponent(slug)}/reviews`, {
    method: "POST",
    body,
  });
}
