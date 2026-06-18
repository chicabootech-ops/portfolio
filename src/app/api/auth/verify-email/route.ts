import { proxyAuthApi } from "@/lib/api/auth-proxy";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; otp?: string };

  return proxyAuthApi("/verify-email", {
    body: {
      email: body.email?.trim(),
      otp: body.otp,
    },
  });
}
