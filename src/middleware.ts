import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/constants";

const PROTECTED_PREFIXES = ["/account", "/onboarding"];
const AUTH_PAGES = new Set(["/login", "/signup"]);

/** Cookie presence — tokens are RS256 from UserService; BFF validates on API routes. */
function hasActiveSession(request: NextRequest): boolean {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  return Boolean(accessToken || refreshToken);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasActiveSession(request);

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
