import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";
import { splitFullName } from "@/lib/auth/map-user";
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

  const { first_name, last_name } = splitFullName(body.name ?? "");

  const response = await fetch(`${apiConfig.baseUrl}/api/user/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: body.email?.trim(),
      password: body.password,
      first_name,
      last_name,
      accept_terms: true,
    }),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as {
    message?: string;
    error?: string;
  };

  if (!response.ok) {
    return NextResponse.json(
      { error: parseBackendError(data, response.status) },
      { status: response.status || 500 }
    );
  }

  return NextResponse.json({
    message: data.message ?? "Registration successful. Check your email for the verification code.",
    email: body.email?.trim(),
  });
}
