// src/app/login/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

type Props = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const errorMsg = sp.error ? decodeURIComponent(sp.error) : "";

  async function loginAction(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      redirect("/login?error=" + encodeURIComponent("EmailとPasswordを入力してください"));
    }

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

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      redirect("/login?error=" + encodeURIComponent("ログイン失敗: " + error.message));
    }

    // ✅ ここでCookieが乗った状態で /todos に遷移する
    redirect("/todos");
  }

  return (
    <main className="card" style={{ padding: 24, maxWidth: 520 }}>
      <h1 className="h1" style={{ margin: 0 }}>
        ログイン
      </h1>

      {errorMsg && (
        <p className="muted" style={{ marginTop: 12 }}>
          {errorMsg}
        </p>
      )}

      <form action={loginAction} style={{ display: "grid", gap: 12, marginTop: 14 }}>
        <label>
          Email
          <input
            className="input"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            className="input"
            name="password"
            type="password"
            placeholder="password"
            autoComplete="current-password"
          />
        </label>

        <button className="btn btnPrimary" type="submit">
          ログイン
        </button>
      </form>
    </main>
  );
}
