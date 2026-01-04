import { redirect, notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";

export default async function TodoEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createSupabaseServer();

  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes.user) redirect("/login");

  const { id } = await params;

  const { data, error } = await supabase
    .from("todos")
    .select("id,title,detail")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) notFound();

  return (
    <main className="card" style={{ padding: 20 }}>
      <h1 className="h1">Todo編集</h1>

      <form action={`/todos/${id}/update`} method="post" className="form">
        <div className="formGroup">
          <label className="formLabel">タイトル</label>
          <input
            name="title"
            defaultValue={data.title}
            required
            className="input"
          />
        </div>

        <div className="formGroup">
          <label className="formLabel">詳細</label>
          <textarea
            name="detail"
            defaultValue={data.detail ?? ""}
            className="textarea"
          />
        </div>

        <div className="formActions">
          <button type="submit" className="btn btnPrimary">
            更新
          </button>
        </div>
      </form>
    </main>
  );
}
