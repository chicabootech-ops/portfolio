import { proxyAuthApi } from "@/lib/api/auth-proxy";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    otp?: string;
    new_password?: string;
  };

  return proxyAuthApi("/reset-password", {
    body: {
      email: body.email?.trim(),
      otp: body.otp,
      new_password: body.new_password,
    },
  });
}
