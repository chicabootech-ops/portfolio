import { proxyUserApi } from "@/lib/api/bff";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");
  const qs = new URLSearchParams();
  if (limit) qs.set("limit", limit);
  if (offset) qs.set("offset", offset);
  const query = qs.toString();
  return proxyUserApi(`/me/security/logins${query ? `?${query}` : ""}`);
}
