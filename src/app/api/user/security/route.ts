import { proxyUserApi } from "@/lib/api/bff";

export async function GET() {
  return proxyUserApi("/security");
}
