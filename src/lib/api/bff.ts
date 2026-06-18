import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";
import {
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
} from "@/lib/auth/cookies";

type ProxyOptions = {
  method?: string;
  body?: unknown;
  formData?: FormData;
};

export async function proxyUserApi(
  path: string,
  options: ProxyOptions = {}
): Promise<NextResponse> {
  const accessToken = await getAccessTokenFromCookies();

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };

  let body: BodyInit | undefined;
  if (options.formData) {
    body = options.formData;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const response = await fetch(`${apiConfig.baseUrl}/api/user${path}`, {
    method: options.method ?? "GET",
    headers,
    body,
    cache: "no-store",
  });

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
