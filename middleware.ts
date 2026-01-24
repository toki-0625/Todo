import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const hasSession =
    req.cookies.has("sb-access-token") ||
    req.cookies.has("sb-refresh-token");

  // 未ログインで /todos に来たらログインへ
  if (!hasSession && req.nextUrl.pathname.startsWith("/todos")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/todos/:path*"],
};
