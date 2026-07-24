import { proxyUserApi } from "@/lib/api/bff";

export async function POST(request: Request) {
  const formData = await request.formData();
  return proxyUserApi("/avatar", { method: "POST", formData });
}

export async function DELETE() {
  return proxyUserApi("/avatar", { method: "DELETE" });
}
