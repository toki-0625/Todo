"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onLogin = async () => {
    setMsg("");

    console.log("[login] start", { email: email.trim() });

    try {
      const res = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      console.log("[login] signInWithPassword result", res);

      if (res.error) {
        setMsg(`ログイン失敗: ${res.error.message}`);
        return;
      }

      const sessionRes = await supabase.auth.getSession();
      console.log("[login] getSession result", sessionRes);

      if (!sessionRes.data.session) {
        setMsg("ログイン後セッションが取得できません（保存に失敗してる可能性）");
        return;
      }

      router.replace("/todos");
    } catch (e: any) {
      console.error("[login] unexpected error", e);
      setMsg(`予期しないエラー: ${String(e?.message ?? e)}`);
    }
  };

  return (
    <main className="card" style={{ padding: 24, maxWidth: 520 }}>
      <h1 className="h1" style={{ margin: 0 }}>
        ログイン
      </h1>

      <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
        <label>
          Email
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            className="input"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            autoComplete="current-password"
          />
        </label>

        <button className="btn btnPrimary" type="button" onClick={onLogin}>
          ログイン
        </button>

        {msg && (
          <p className="muted" style={{ margin: 0 }}>
            {msg}
          </p>
        )}
      </div>
    </main>
  );
}
