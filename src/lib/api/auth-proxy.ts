import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";
import { getAccessTokenFromCookies } from "@/lib/auth/cookies";

type ProxyAuthOptions = {
  method?: string;
  body?: unknown;
  requireAuth?: boolean;
};

export async function proxyAuthApi(
  path: string,
  options: ProxyAuthOptions = {}
): Promise<NextResponse> {
  const headers: Record<string, string> = {};

  if (options.requireAuth) {
    const accessToken = await getAccessTokenFromCookies();
    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${apiConfig.baseUrl}/api/auth${path}`, {
    method: options.method ?? "POST",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = (await response.json().catch(() => ({}))) as { error?: string };
  return NextResponse.json(
    { error: data.error ?? "Request failed" },
    { status: response.status }
  );
}
