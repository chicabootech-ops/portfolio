import { proxyUserApi } from "@/lib/api/bff";

export async function POST() {
  return proxyUserApi("/me/security/logout-all", { method: "POST" });
}
