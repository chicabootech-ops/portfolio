import type { AuthResponse, AuthUser } from "@/types/auth";

const ACCESS_TOKEN_KEY = "chicaboo_access_token";
const REFRESH_TOKEN_KEY = "chicaboo_refresh_token";
const USER_KEY = "chicaboo_user";

export function saveAuthSession(response: AuthResponse): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
  localStorage.setItem(USER_KEY, JSON.stringify(response.user));
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}
