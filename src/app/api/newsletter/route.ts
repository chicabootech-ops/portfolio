import { passthroughBackend } from "@/lib/api/backend-proxy";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return passthroughBackend("/api/newsletter/subscribe", { method: "POST", body });
}

export async function GET(request: Request) {
  const { search } = new URL(request.url);
  return passthroughBackend(`/api/newsletter/confirm${search}`);
}
