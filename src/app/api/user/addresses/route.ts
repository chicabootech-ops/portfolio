import { proxyUserApi } from "@/lib/api/bff";

export async function GET() {
  return proxyUserApi("/addresses");
}

export async function POST(request: Request) {
  const body = await request.json();
  return proxyUserApi("/addresses", { method: "POST", body });
}
