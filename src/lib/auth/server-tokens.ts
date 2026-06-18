import { apiConfig } from "@/config/api";
import {
  clearAuthCookies,
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
  setAuthCookies,
} from "./cookies";

const BACKEND_FETCH_TIMEOUT_MS = 10_000;

type RefreshResponse = {
  access_token?: string;
  refresh_token?: string;
};

async function backendFetch(
  url: string,
  init: RequestInit = {}
): Promise<Response | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BACKEND_FETCH_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/** Exchange refresh token for a new access + refresh pair and persist cookies. */
export async function refreshAuthTokens(
  refreshToken: string
): Promise<string | null> {
  const response = await backendFetch(`${apiConfig.baseUrl}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response) {
    return null;
  }

  const data = (await response.json().catch(() => ({}))) as RefreshResponse;

  if (!response.ok || !data.access_token || !data.refresh_token) {
    return null;
  }

  await setAuthCookies(data.access_token, data.refresh_token);
  return data.access_token;
}

/** Return a usable access token, refreshing from the refresh cookie when needed. */
export async function getValidAccessToken(): Promise<string | null> {
  const accessToken = await getAccessTokenFromCookies();
  const refreshToken = await getRefreshTokenFromCookies();

  if (!accessToken && !refreshToken) {
    return null;
  }

  if (!accessToken && refreshToken) {
    return refreshAuthTokens(refreshToken);
  }

  return accessToken ?? null;
}

export async function fetchWithAccessToken(
  url: string,
  init: RequestInit = {}
): Promise<Response> {
  const accessToken = await getValidAccessToken();
  const refreshToken = await getRefreshTokenFromCookies();

  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);

  let response = await backendFetch(url, { ...init, headers });

  if (!response) {
    return new Response(JSON.stringify({ error: "Service unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (response.status === 401 && refreshToken) {
    const newToken = await refreshAuthTokens(refreshToken);
    if (!newToken) {
      await clearAuthCookies();
      return response;
    }

    headers.set("Authorization", `Bearer ${newToken}`);
    response = await backendFetch(url, { ...init, headers });

    if (!response) {
      return new Response(JSON.stringify({ error: "Service unavailable" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return response;
}
