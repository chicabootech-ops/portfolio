import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";
import { parseBackendError } from "@/lib/auth/errors";

type ProxyAuthOptions = {
  method?: string;
  body?: unknown;
  requireAuth?: boolean;
};

export async function proxyAuthApi(
  path: string,
  options: ProxyAuthOptions = {}
): Promise<NextResponse> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${apiConfig.baseUrl}/api/user/auth${normalized}`, {
    method: options.method ?? "POST",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return NextResponse.json(
      { error: parseBackendError(data as { error?: string }, response.status) },
      { status: response.status }
    );
  }

  return NextResponse.json(data, { status: response.status });
}
