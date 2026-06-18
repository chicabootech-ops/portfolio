import { proxyUserApi } from "@/lib/api/bff";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { phone?: string };
  const payload =
    typeof body.phone === "string" && body.phone.trim()
      ? { phone: body.phone.trim() }
      : undefined;

  return proxyUserApi("/phone/send-otp", {
    method: "POST",
    body: payload,
  });
}
