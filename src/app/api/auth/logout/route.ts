import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";
import {
  clearAuthCookies,
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
} from "@/lib/auth/cookies";

export async function POST() {
  const accessToken = await getAccessTokenFromCookies();
  const refreshToken = await getRefreshTokenFromCookies();

  if (accessToken && refreshToken) {
    await fetch(`${apiConfig.baseUrl}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    }).catch(() => undefined);
  }

  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
