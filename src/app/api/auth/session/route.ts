import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";
import { getAccessTokenFromCookies } from "@/lib/auth/cookies";

export async function GET() {
  const accessToken = await getAccessTokenFromCookies();

  if (!accessToken) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const response = await fetch(`${apiConfig.baseUrl}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = await response.json();
  return NextResponse.json({ user });
}
