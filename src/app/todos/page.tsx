"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Todo = {
  id: string;
  user_id: string;
  title: string;
  detail: string | null;
  created_at: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
}

export default function TodosPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setMsg("");
      setLoading(true);

      // 1) セッション確認（なければログインへ）
      const { data: sessionRes } = await supabase.auth.getSession();
      if (!sessionRes.session) {
        router.replace("/login");
        return;
      }

      // 2) Todo取得（RLSで自分の分だけ返る）
      const { data, error } = await supabase
        .from("todos")
        .select("id,user_id,title,detail,created_at")
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (error) {
        setMsg(`読み込み失敗: ${error.message}`);
        setTodos([]);
      } else {
        setTodos((data ?? []) as Todo[]);
      }

      setLoading(false);
    };

    load();

    // セッション変化（ログアウト等）にも追従
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/login");
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  const onLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <main className="card" style={{ padding: 20 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="h1" style={{ margin: 0 }}>
            Todo一覧
          </h1>
          <p className="muted" style={{ margin: "6px 0 0" }}>
            ログイン中のユーザーのTodoだけ表示されます（RLS）
          </p>
        </div>

        <div className="row">
          <Link className="btn btnPrimary" href="/todos/new">
            新規作成
          </Link>
          <button className="btn" type="button" onClick={onLogout}>
            ログアウト
          </button>
        </div>
      </div>

      {msg && (
        <p className="muted" style={{ marginTop: 12 }}>
          {msg}
        </p>
      )}

      {loading ? (
        <p className="muted" style={{ marginTop: 12 }}>
          読み込み中…
        </p>
      ) : (
        <>
          <div className="row" style={{ marginTop: 14 }}>
            <span className="muted">件数:</span>
            <strong>{todos.length}</strong>
          </div>

          <ul className="list">
            {todos.map((t) => (
              <li key={t.id} className="card item">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div className="title">{t.title}</div>
                  <div className="meta">{formatDate(t.created_at)}</div>
                </div>

                <div className="muted" style={{ fontSize: 13 }}>
                  {t.detail
                    ? t.detail.length > 80
                      ? `${t.detail.slice(0, 80)}…`
                      : t.detail
                    : "（詳細なし）"}
                </div>

                <div className="row" style={{ marginTop: 8 }}>
                  <Link className="btn" href={`/todos/${t.id}`}>
                    詳細
                  </Link>
                  <Link className="btn" href={`/todos/${t.id}/edit`}>
                    編集
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          {todos.length === 0 && !msg && (
            <div className="card" style={{ padding: 16, marginTop: 14 }}>
              <p style={{ margin: 0 }}>まだTodoがありません。</p>
              <p className="muted" style={{ margin: "6px 0 0" }}>
                「新規作成」から追加してください。
              </p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
