import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";
import { getAccessTokenFromCookies } from "@/lib/auth/cookies";

export async function PATCH(request: Request) {
  const accessToken = await getAccessTokenFromCookies();

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: { name?: string; phone?: string };

  try {
    body = (await request.json()) as { name?: string; phone?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const response = await fetch(`${apiConfig.baseUrl}/api/user/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
    user?: unknown;
  };

  if (!response.ok) {
    const message =
      data.error ??
      (response.status === 403
        ? "Please verify your email before updating your profile."
        : "Could not update profile.");
    return NextResponse.json({ error: message }, { status: response.status });
  }

  return NextResponse.json({ user: data });
}
