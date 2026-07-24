import { NextResponse } from "next/server";
import { clearAuthCookies, getRefreshTokenFromCookies } from "@/lib/auth/cookies";
import { refreshAuthTokens } from "@/lib/auth/server-tokens";

export async function POST() {
  const refreshToken = await getRefreshTokenFromCookies();

  if (!refreshToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const accessToken = await refreshAuthTokens(refreshToken);

  if (!accessToken) {
    await clearAuthCookies();
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
