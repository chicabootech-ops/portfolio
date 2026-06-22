import { proxyUserApi } from "@/lib/api/bff";

export async function DELETE() {
  return proxyUserApi("/me/avatar", { method: "DELETE" });
}
