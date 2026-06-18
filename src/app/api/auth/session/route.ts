import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";
import {
  clearAuthCookies,
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
  setAuthCookies,
} from "@/lib/auth/cookies";

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const response = await fetch(`${apiConfig.baseUrl}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    refresh_token?: string;
  };

  if (!response.ok || !data.access_token || !data.refresh_token) {
    return null;
  }

  await setAuthCookies(data.access_token, data.refresh_token);
  return data.access_token;
}

async function fetchUser(accessToken: string) {
  return fetch(`${apiConfig.baseUrl}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
}

export async function GET() {
  let accessToken = await getAccessTokenFromCookies();
  const refreshToken = await getRefreshTokenFromCookies();

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  if (!accessToken && refreshToken) {
    accessToken = (await refreshAccessToken(refreshToken)) ?? undefined;
    if (!accessToken) {
      await clearAuthCookies();
      return NextResponse.json({ user: null }, { status: 401 });
    }
  }

  let response = await fetchUser(accessToken!);

  if (response.status === 401 && refreshToken) {
    const newToken = await refreshAccessToken(refreshToken);
    if (!newToken) {
      await clearAuthCookies();
      return NextResponse.json({ user: null }, { status: 401 });
    }
    response = await fetchUser(newToken);
  }

  if (!response.ok) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await response.json();
  return NextResponse.json({ user });
}
