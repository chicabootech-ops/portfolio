import { proxyAuthApi } from "@/lib/api/auth-proxy";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string };
  if (!body.email?.trim()) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }
  return proxyAuthApi("/resend-verification", {
    method: "POST",
    body: { email: body.email.trim() },
  });
}
