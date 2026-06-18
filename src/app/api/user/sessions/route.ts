import { proxyUserApi, getRefreshTokenBody } from "@/lib/api/bff";

export async function GET() {
  const refreshBody = await getRefreshTokenBody();
  const query = refreshBody ? `?refresh_token=${encodeURIComponent(refreshBody.refresh_token)}` : "";
  return proxyUserApi(`/sessions${query}`);
}

export async function POST(request: Request) {
  const refreshBody = await getRefreshTokenBody();
  const body = refreshBody ? { refresh_token: refreshBody.refresh_token } : {};
  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  if (action === "revoke-all") {
    return proxyUserApi("/sessions/revoke-all", { method: "POST", body });
  }

  return proxyUserApi("/sessions/revoke-others", { method: "POST", body });
}
