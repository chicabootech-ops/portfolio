import { passthroughBackend } from "@/lib/api/backend-proxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();
  return passthroughBackend(`/api/search${qs ? `?${qs}` : ""}`);
}
