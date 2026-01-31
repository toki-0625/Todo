"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onSignup = async () => {
    setMsg("");

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMsg(`登録失敗: ${error.message}`);
      return;
    }

    setMsg("登録OK！そのままログインしてね。");
    router.push("/login");
  };

  return (
    <main className="container">
      <div className="card" style={{ padding: 20, maxWidth: 520, margin: "0 auto" }}>
        <h1 className="h1" style={{ margin: 0 }}>
          新規登録
        </h1>

        <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
          <label className="formGroup">
            <div className="formLabel">Email</div>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label className="formGroup">
            <div className="formLabel">Password</div>
            <input
              className="input"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6文字以上推奨"
            />
          </label>

          <div className="row" style={{ justifyContent: "flex-end" }}>
            <button className="btn btnPrimary" onClick={onSignup} type="button">
              登録
            </button>
          </div>

          {msg && <p className="muted">{msg}</p>}
        </div>
      </div>
    </main>
  );
}
