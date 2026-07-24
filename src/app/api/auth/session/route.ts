import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { mapCurrentUserToAuthUser } from "@/lib/auth/map-user";
import { fetchWithAccessToken, getValidAccessToken } from "@/lib/auth/server-tokens";
import type { CurrentUser } from "@/types/user";

export async function GET() {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    await clearAuthCookies();
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const response = await fetchWithAccessToken(`${apiConfig.baseUrl}/api/user/me`);

  if (!response.ok) {
    if (response.status === 503) {
      return NextResponse.json(
        { user: null, error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }

    await clearAuthCookies();
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const me = (await response.json()) as CurrentUser;
  return NextResponse.json({ user: mapCurrentUserToAuthUser(me) });
}
