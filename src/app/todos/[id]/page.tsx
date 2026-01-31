export const dynamic = "force-dynamic";
export const revalidate = 0;


import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
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

export default async function TodoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { id } = await params;

  // ★保険：URLが壊れてたら404
  if (!id || id === "undefined") notFound();

  const { data, error } = await supabase
    .from("todos")
    .select("id,user_id,title,detail,created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <main className="card" style={{ padding: 20 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h1 className="h1" style={{ margin: 0 }}>
            Todo詳細
          </h1>
          <Link className="btn" href="/todos">
            一覧に戻る
          </Link>
        </div>

        <p className="muted" style={{ marginTop: 12 }}>
          読み込み失敗: {error.message}
        </p>
      </main>
    );
  }

  if (!data) notFound();
  const todo = data as Todo;

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
