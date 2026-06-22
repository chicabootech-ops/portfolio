import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";
import { setAuthCookies } from "@/lib/auth/cookies";
import { mapCurrentUserToAuthUser } from "@/lib/auth/map-user";
import { parseBackendError } from "@/lib/auth/errors";
import { fetchWithAccessToken } from "@/lib/auth/server-tokens";
import type { LoginCredentials } from "@/types/auth";
import type { CurrentUser } from "@/types/user";

export async function POST(request: Request) {
  let body: LoginCredentials;

  try {
    body = (await request.json()) as LoginCredentials;
  } catch {
    return NextResponse.json(
      { error: "Request could not be completed. Please check your details and try again." },
      { status: 400 }
    );
  }

  const response = await fetch(`${apiConfig.baseUrl}/api/user/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email?.trim(),
      password: body.password,
    }),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    refresh_token?: string;
    error?: string;
  };

  if (!response.ok || !data.access_token || !data.refresh_token) {
    return NextResponse.json(
      { error: parseBackendError(data, response.status) },
      { status: response.status || 500 }
    );
  }

  await setAuthCookies(data.access_token, data.refresh_token);

  const meResponse = await fetchWithAccessToken(`${apiConfig.baseUrl}/api/user/me`);
  if (!meResponse.ok) {
    return NextResponse.json(
      { error: "Signed in but could not load profile." },
      { status: 502 }
    );
  }

  const me = (await meResponse.json()) as CurrentUser;
  return NextResponse.json({ user: mapCurrentUserToAuthUser(me) });
}
