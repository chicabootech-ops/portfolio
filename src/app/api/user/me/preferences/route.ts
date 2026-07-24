import { proxyUserApi } from "@/lib/api/bff";

export async function GET() {
  return proxyUserApi("/me/preferences");
}

export async function PATCH(request: Request) {
  const body = await request.json();
  return proxyUserApi("/me/preferences", { method: "PATCH", body });
}
