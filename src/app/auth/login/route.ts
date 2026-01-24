// src/app/auth/login/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    const url = new URL("/login", req.url);
    url.searchParams.set("error", "EmailとPasswordを入力してください");
    return NextResponse.redirect(url, { status: 303 });
  }

  // ★重要：response を作って、それに Set-Cookie を積む
  const res = NextResponse.redirect(new URL("/todos", req.url), { status: 303 });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
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

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const url = new URL("/login", req.url);
    url.searchParams.set("error", `ログイン失敗: ${error.message}`);
    return NextResponse.redirect(url, { status: 303 });
  }

  return res;
}
