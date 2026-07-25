import { NextResponse } from "next/server";
import { apiConfig } from "@/config/api";
import { fetchWithAccessToken } from "@/lib/auth/server-tokens";

type ProxyOptions = {
  method?: string;
  body?: unknown;
};

/**
 * Proxy an authenticated request straight to a backend path (e.g. /api/payments/*,
 * /api/orders/*). Unlike proxyUserApi this does not prefix /api/user.
 */
export async function proxyBackendApi(
  path: string,
  options: ProxyOptions = {}
): Promise<NextResponse> {
  const headers: Record<string, string> = {};
  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  const response = await fetchWithAccessToken(`${apiConfig.baseUrl}${normalized}`, {
    method: options.method ?? "GET",
    headers,
    body,
  });

  if (response.status === 204) return new NextResponse(null, { status: 204 });
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

/** Proxy an authenticated request that returns a binary body (invoice PDF). */
export async function proxyBackendBinary(path: string): Promise<NextResponse> {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const response = await fetchWithAccessToken(`${apiConfig.baseUrl}${normalized}`);
  if (response.status >= 400) {
    const data = await response.json().catch(() => ({ error: "Unavailable" }));
    return NextResponse.json(data, { status: response.status });
  }
  const buffer = await response.arrayBuffer();
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/pdf",
      "Content-Disposition":
        response.headers.get("Content-Disposition") ?? "inline; filename=invoice.pdf",
    },
  });
}

/** Public (no-auth) passthrough. */
export async function passthroughBackend(
  path: string,
  options: ProxyOptions = {}
): Promise<NextResponse> {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  try {
    const headers: Record<string, string> = {};
    let body: BodyInit | undefined;
    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(options.body);
    }
    const response = await fetch(`${apiConfig.baseUrl}${normalized}`, {
      method: options.method ?? "GET",
      headers,
      body,
      cache: "no-store",
    });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
}
