import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";
import { clearAuthCookies } from "@/lib/auth/cookies";
import {
  fetchWithAccessToken,
  getValidAccessToken,
} from "@/lib/auth/server-tokens";

export async function GET() {
  const accessToken = await getValidAccessToken();

  if (!accessToken) {
    await clearAuthCookies();
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const response = await fetchWithAccessToken(`${apiConfig.baseUrl}/api/auth/me`);

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

  const user = await response.json();
  return NextResponse.json({ user });
}
