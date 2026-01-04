import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? null;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  // 念のためログインチェック（未ログインなら弾く）
  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes.user) return new NextResponse("Unauthorized", { status: 401 });

  const formData = await req.formData();
  const title = String(formData.get("title") ?? "").trim();
  const detailRaw = formData.get("detail");
  const detail = detailRaw === null ? null : String(detailRaw);

  if (!title) return new NextResponse("title is required", { status: 400 });

  const { error } = await supabase.from("todos").insert({
    title,
    detail,
    user_id: userRes.user.id, // RLSのINSERT条件に合わせる
  });

  if (error) return new NextResponse(error.message, { status: 400 });

  const url = new URL(req.url);
  return NextResponse.redirect(new URL("/todos", url.origin), { status: 303 });
}
