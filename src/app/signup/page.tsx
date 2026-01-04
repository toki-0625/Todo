"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");

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
    <main style={{ padding: 24, maxWidth: 520 }}>
      <h1>新規登録</h1>

      <div style={{ display: "grid", gap: 12 }}>
        <label>
          Email
          <input
            style={{ width: "100%", padding: 8 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>

        <label>
          Password
          <input
            style={{ width: "100%", padding: 8 }}
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6文字以上推奨"
          />
        </label>

        <button onClick={onSignup} style={{ padding: 10 }}>
          登録
        </button>

        {msg && <p>{msg}</p>}
      </div>
    </main>
  );
}
