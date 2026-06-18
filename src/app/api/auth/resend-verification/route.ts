import { proxyAuthApi } from "@/lib/api/auth-proxy";

export async function POST() {
  return proxyAuthApi("/resend-verification", { requireAuth: true });
}
