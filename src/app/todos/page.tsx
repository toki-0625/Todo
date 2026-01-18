import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";

type Todo = {
  id: string;
  user_id: string;
  title: string;
  detail: string | null;
  created_at: string;
};

function formatDate(iso: string) {
  // ざっくり見やすく（2026/01/04 20:30みたいな感じ）
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
}

export default async function TodosPage() {
  const supabase = await createSupabaseServer();

  const { data: userRes } = await supabase.auth.getUser();
  // redirectしない

  const { data, error } = await supabase
    .from("todos")
    .select("id,user_id,title,detail,created_at")
    .order("created_at", { ascending: false });

  const todos = (data ?? []) as Todo[];

  return (
    <main className="card" style={{ padding: 20 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="h1" style={{ margin: 0 }}>
            Todo一覧
          </h1>
          <p className="muted" style={{ margin: "6px 0 0" }}>
            ログイン中のユーザーのTodoだけ表示されます
          </p>
        </div>

        <div className="row">
          <Link className="btn btnPrimary" href="/todos/new">
            新規作成
          </Link>
          <Link className="btn" href="/logout">
            ログアウト
          </Link>
        </div>
      </div>

      {error && (
        <p className="muted" style={{ marginTop: 12 }}>
          読み込み失敗: {error.message}
        </p>
      )}

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

      {todos.length === 0 && !error && (
        <div className="card" style={{ padding: 16, marginTop: 14 }}>
          <p style={{ margin: 0 }}>まだTodoがありません。</p>
          <p className="muted" style={{ margin: "6px 0 0" }}>
            「新規作成」から追加してください。
          </p>
        </div>
      )}
    </main>
  );
}
