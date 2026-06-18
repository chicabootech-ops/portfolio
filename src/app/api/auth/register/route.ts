import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";
import { setAuthCookies } from "@/lib/auth/cookies";
import { parseBackendError } from "@/lib/auth/errors";
import type { SignupCredentials } from "@/types/auth";

export async function POST(request: Request) {
  let body: SignupCredentials;

  try {
    body = (await request.json()) as SignupCredentials;
  } catch {
    return NextResponse.json(
      { error: "Request could not be completed. Please check your details and try again." },
      { status: 400 }
    );
  }

  const response = await fetch(`${apiConfig.baseUrl}${apiConfig.auth.register}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: body.name?.trim(),
      email: body.email?.trim(),
      password: body.password,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    refresh_token?: string;
    user?: unknown;
  };

  if (!response.ok || !data.access_token || !data.refresh_token || !data.user) {
    return NextResponse.json(
      { error: parseBackendError(data as { error?: string }, response.status) },
      { status: response.status || 500 }
    );
  }

  await setAuthCookies(data.access_token, data.refresh_token);

  return NextResponse.json({ user: data.user });
}
