"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");

  const onLogin = async () => {
    setMsg("");

    const res = await fetch("/api/login", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = (await res.json()) as { ok: boolean; message?: string };

    if (!res.ok || !data.ok) {
      setMsg(`ログイン失敗: ${data.message ?? "不明なエラー"}`);
      return;
    }

    // ✅ cookie がブラウザに保存されてから遷移
    router.push("/todos");
    router.refresh();
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
