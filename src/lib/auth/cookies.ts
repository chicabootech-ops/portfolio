import { cookies } from "next/headers";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "./constants";

const ACCESS_MAX_AGE = 15 * 60;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_COOKIE, accessToken, cookieOptions(ACCESS_MAX_AGE));
  store.set(REFRESH_COOKIE, refreshToken, cookieOptions(REFRESH_MAX_AGE));
}

export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export async function getAccessTokenFromCookies(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value;
}

export async function getRefreshTokenFromCookies(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value;
}
