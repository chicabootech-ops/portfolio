import { proxyUserApi } from "@/lib/api/bff";

export async function POST(request: Request) {
  const body = await request.json();
  return proxyUserApi("/account/delete", { method: "POST", body });
}
