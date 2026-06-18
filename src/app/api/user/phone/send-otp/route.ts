import { proxyUserApi } from "@/lib/api/bff";

export async function POST() {
  return proxyUserApi("/phone/send-otp", { method: "POST" });
}
