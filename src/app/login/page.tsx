"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");

  const onLogin = async () => {
    setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMsg(`ログイン失敗: ${error.message}`);
      return;
    }
    router.push("/todos");
  };

  return (
    <main style={{ padding: 24, maxWidth: 520 }}>
      <h1>ログイン</h1>

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
            placeholder="password"
          />
        </label>

        <button onClick={onLogin} style={{ padding: 10 }}>
          ログイン
        </button>

        {msg && <p>{msg}</p>}
      </div>
    </main>
  );
}
