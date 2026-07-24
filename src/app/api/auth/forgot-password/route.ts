import { proxyAuthApi } from "@/lib/api/auth-proxy";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string };
  return proxyAuthApi("/forgot-password", {
    body: { email: body.email?.trim() },
  });
}
