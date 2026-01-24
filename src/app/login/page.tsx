// src/app/login/page.tsx
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

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setMsg(`ログイン失敗: ${error.message}`);
      return;
    }

    // 念のため：セッションが保存されたか確認してから遷移
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setMsg("ログインは成功したはずなのにセッションが取得できませんでした");
      return;
    }

    router.replace("/todos");
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
