import { passthroughBackend } from "@/lib/api/backend-proxy";

export async function GET() {
  return passthroughBackend("/api/payments/config");
}
