"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import DeleteButton from "./DeleteButton";

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

export default function TodoDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (!id) return;

    const run = async () => {
      setLoading(true);
      setErrMsg("");

      // 1) ログイン確認（ブラウザ側セッション）
      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) {
        setErrMsg(`認証確認に失敗: ${userErr.message}`);
        setLoading(false);
        return;
      }
      if (!userRes.user) {
        router.replace("/login");
        return;
      }

      // 2) Todo 取得（RLSが効く）
      const { data, error } = await supabase
        .from("todos")
        .select("id,user_id,title,detail,created_at")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        setErrMsg(`読み込み失敗: ${error.message}`);
        setLoading(false);
        return;
      }
      if (!data) {
        // 見つからない or 権限なし
        router.replace("/todos");
        return;
      }

      setTodo(data as Todo);
      setLoading(false);
    };

    run();
  }, [id, router]);

  if (loading) {
    return (
      <main className="card" style={{ padding: 20 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h1 className="h1" style={{ margin: 0 }}>
            Todo詳細
          </h1>
          <Link className="btn" href="/todos">
            一覧へ
          </Link>
        </div>
        <p className="muted" style={{ marginTop: 12 }}>
          読み込み中…
        </p>
      </main>
    );
  }

  if (errMsg) {
    return (
      <main className="card" style={{ padding: 20 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h1 className="h1" style={{ margin: 0 }}>
            Todo詳細
          </h1>
          <Link className="btn" href="/todos">
            一覧へ
          </Link>
        </div>
        <p className="muted" style={{ marginTop: 12 }}>
          {errMsg}
        </p>
      </main>
    );
  }

  if (!todo) {
    return (
      <main className="card" style={{ padding: 20 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h1 className="h1" style={{ margin: 0 }}>
            Todo詳細
          </h1>
          <Link className="btn" href="/todos">
            一覧へ
          </Link>
        </div>
        <p className="muted" style={{ marginTop: 12 }}>
          そのTodoは存在しないか、閲覧権限がありません。
        </p>
      </main>
    );
  }

  return (
    <main className="card" style={{ padding: 20 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="h1" style={{ margin: 0 }}>
            Todo詳細
          </h1>
          <p className="muted" style={{ margin: "6px 0 0" }}>
            作成日時: {formatDate(todo.created_at)}
          </p>
        </div>

        <div className="row">
          <Link className="btn" href="/todos">
            一覧へ
          </Link>
          <Link className="btn btnPrimary" href={`/todos/${todo.id}/edit`}>
            編集
          </Link>
          <DeleteButton action={`/todos/${todo.id}/delete`} />
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginTop: 14 }}>
        <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>
          タイトル
        </div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>{todo.title}</div>
      </div>

      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>
          詳細
        </div>
        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
          {todo.detail ?? "（詳細なし）"}
        </div>
      </div>
    </main>
  );
}
