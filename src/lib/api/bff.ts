import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";
import { getRefreshTokenFromCookies } from "@/lib/auth/cookies";
import { fetchWithAccessToken } from "@/lib/auth/server-tokens";

type ProxyOptions = {
  method?: string;
  body?: unknown;
  formData?: FormData;
};

export async function proxyUserApi(
  path: string,
  options: ProxyOptions = {}
): Promise<NextResponse> {
  const headers: Record<string, string> = {};
  let body: BodyInit | undefined;

  if (options.formData) {
    body = options.formData;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  const response = await fetchWithAccessToken(
    `${apiConfig.baseUrl}/api/user${normalized}`,
    {
      method: options.method ?? "GET",
      headers,
      body,
    }
  );

  if (response.status === 401) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function getRefreshTokenBody(): Promise<{ refresh_token: string } | null> {
  const refreshToken = await getRefreshTokenFromCookies();
  if (!refreshToken) return null;
  return { refresh_token: refreshToken };
}
