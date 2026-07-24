import { proxyUserApi } from "@/lib/api/bff";

export async function POST(request: Request) {
  const body = await request.json();
  return proxyUserApi("/me/avatar/upload-url", { method: "POST", body });
}
