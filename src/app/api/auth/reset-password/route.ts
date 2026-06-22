import { proxyAuthApi } from "@/lib/api/auth-proxy";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    token?: string;
    new_password?: string;
  };

  return proxyAuthApi("/reset-password", {
    body: {
      token: body.token,
      new_password: body.new_password,
    },
  });
}
