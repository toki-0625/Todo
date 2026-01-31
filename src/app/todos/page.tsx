export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServer } from "@/lib/supabaseServer";


type Todo = {
  id: string;
  title: string;
  created_at: string;
};

export default async function TodosPage() {
  // ✅ サーバー側に届いてる cookie 名を確認（Vercel Logs に出る）
  const cookieStore = await cookies();
  console.log(
    "[todos] cookies:",
    cookieStore.getAll().map((c) => c.name)
  );

  const supabase = await createSupabaseServer();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) console.log("[todos] getUser error:", userErr);

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("todos")
    .select("id,title,created_at")
    .order("created_at", { ascending: false });

  if (error) console.log("[todos] select error:", error);

  const todos = (data ?? []) as Todo[];

  return (
    <main>
      <h1>Todo一覧</h1>

      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/todos/new">新規作成</Link>
        <Link href="/logout">ログアウト</Link>
      </div>

      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <Link href={`/todos/${t.id}`}>{t.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
