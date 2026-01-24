// src/app/login/page.tsx
import Link from "next/link";

type Props = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const errorMsg = sp.error ? decodeURIComponent(sp.error) : "";

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

      <form
        action="/auth/login"
        method="post"
        style={{ display: "grid", gap: 12, marginTop: 14 }}
      >
        <label>
          Email
          <input
            className="input"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
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
            required
          />
        </label>

        <button className="btn btnPrimary" type="submit">
          ログイン
        </button>
      </form>

      <p className="muted" style={{ marginTop: 12 }}>
        アカウントないなら <Link href="/signup">新規登録</Link>
      </p>
    </main>
  );
}
