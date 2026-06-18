import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";
import { clearAuthCookies, getRefreshTokenFromCookies, setAuthCookies } from "@/lib/auth/cookies";

export async function POST() {
  const refreshToken = await getRefreshTokenFromCookies();

  if (!refreshToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const response = await fetch(`${apiConfig.baseUrl}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    refresh_token?: string;
    error?: string;
  };

  if (!response.ok || !data.access_token || !data.refresh_token) {
    await clearAuthCookies();
    return NextResponse.json({ error: data.error ?? "Session expired" }, { status: 401 });
  }

  await setAuthCookies(data.access_token, data.refresh_token);
  return NextResponse.json({ ok: true });
}
