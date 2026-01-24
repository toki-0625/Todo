// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // ★重要：next() で作った response に cookie を積む
  const res = NextResponse.next({
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
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // ★重要：ここで response に Set-Cookie を積む
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // ★重要：これを呼ぶことで必要なら refresh が走り、cookie が更新される
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未ログインで /todos 配下に来たら /login へ
  if (!user && req.nextUrl.pathname.startsWith("/todos")) {
    const loginUrl = new URL("/login", req.url);

    // ★重要：redirect の response にも cookie を引き継ぐ
    const redirectRes = NextResponse.redirect(loginUrl);
    res.cookies.getAll().forEach((c) => redirectRes.cookies.set(c));
    return redirectRes;
  }

  return res;
}

export const config = {
  matcher: ["/todos/:path*"],
};
