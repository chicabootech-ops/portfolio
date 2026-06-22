import { proxyUserApi } from "@/lib/api/bff";

export async function GET() {
  return proxyUserApi("/me/addresses");
}

export async function POST(request: Request) {
  const body = await request.json();
  return proxyUserApi("/me/addresses", { method: "POST", body });
}
