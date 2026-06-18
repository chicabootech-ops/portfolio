import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/constants";

const PROTECTED_PREFIXES = ["/account", "/onboarding"];
const AUTH_PAGES = new Set(["/login", "/signup"]);

async function verifyToken(
  token: string,
  type: "access" | "refresh"
): Promise<boolean> {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      { algorithms: ["HS256"] }
    );
    return payload.type === type;
  } catch {
    return false;
  }
}

async function hasActiveSession(request: NextRequest): Promise<boolean> {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  if (accessToken && (await verifyToken(accessToken, "access"))) {
    return true;
  }

  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (refreshToken && (await verifyToken(refreshToken, "refresh"))) {
    return true;
  }

  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = await hasActiveSession(request);

  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (AUTH_PAGES.has(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: ["/account/:path*", "/onboarding", "/login", "/signup"],
};
