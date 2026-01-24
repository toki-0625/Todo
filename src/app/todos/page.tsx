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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("todos")
    .select("id,user_id,title,detail,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const todos = (data ?? []) as Todo[];

  return (
    <main className="card" style={{ padding: 20 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1 className="h1">Todo一覧</h1>

        <div className="row">
          <Link className="btn btnPrimary" href="/todos/new">
            新規作成
          </Link>
          <Link className="btn" href="/logout">
            ログアウト
          </Link>
        </div>
      </div>

      <ul className="list">
        {todos.map((t) => (
          <li key={t.id} className="card item">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div className="title">{t.title}</div>
              <div className="meta">{formatDate(t.created_at)}</div>
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
    </main>
  );
}
