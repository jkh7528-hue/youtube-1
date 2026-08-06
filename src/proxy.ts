import { NextResponse, type NextRequest } from "next/server";

// Simple shared-password gate for this personal tool — not a full auth
// system. See src/lib/actions.ts `login`/`logout` for how the cookie gets
// set, and src/app/login/page.tsx for the form.
const COOKIE_NAME = "site_password";
const PUBLIC_PATH_PREFIXES = ["/login", "/api/cron"]; // cron uses CRON_SECRET, not this cookie

export function proxy(request: NextRequest) {
  const appPassword = process.env.APP_PASSWORD ?? "";
  if (!appPassword) return NextResponse.next(); // gate disabled when unset

  const { pathname } = request.nextUrl;
  if (PUBLIC_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (cookie === appPassword) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
