// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_req: NextRequest) {
  // 認証は middleware でやらない
  return NextResponse.next();
}

export const config = {
  matcher: ["/todos/:path*"],
};
