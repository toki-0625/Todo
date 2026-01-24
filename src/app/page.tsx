import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";

export default async function TodosPage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main>
      <h1>Todo一覧</h1>

      <Link href="/todos/new">新規作成</Link>
      <Link href="/logout">ログアウト</Link>

      <ul>
        {todos?.map((t) => (
          <li key={t.id}>
            <Link href={`/todos/${t.id}`}>{t.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
