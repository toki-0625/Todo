/*

// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // ★重要：headers を引き継いだ NextResponse を作る
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value ?? null;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // ★ここが肝：セッション更新が走り、必要なら cookie が res にセットされる
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // /todos 配下はログイン必須
  if (!user && req.nextUrl.pathname.startsWith("/todos")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";

    // ★redirect でも “res の cookies” を引き継ぐ
    const redirectRes = NextResponse.redirect(url);
    for (const c of res.cookies.getAll()) {
      redirectRes.cookies.set(c);
    }
    return redirectRes;
  }

  return res;
}

export const config = {
  matcher: ["/todos/:path*"],
};
