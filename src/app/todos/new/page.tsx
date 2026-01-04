import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";

export default async function TodoNewPage() {
  const supabase = await createSupabaseServer();

  const { data: userRes } = await supabase.auth.getUser();
  if (!userRes.user) redirect("/login");

  return (
    <main className="card" style={{ padding: 20 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1 className="h1" style={{ margin: 0 }}>
          Todo新規作成
        </h1>
        <Link className="btn" href="/todos">
          一覧に戻る
        </Link>
      </div>

      <p className="muted" style={{ marginTop: 8 }}>
        タイトルは必須、詳細は任意です。
      </p>

      <form action="/todos/create" method="post" className="form">
        <div className="formGroup">
          <label className="formLabel">タイトル</label>
          <input name="title" required className="input" placeholder="例：眼科" />
        </div>

        <div className="formGroup">
          <label className="formLabel">詳細</label>
          <textarea
            name="detail"
            className="textarea"
            placeholder="例：コンタクトの処方箋をもらう"
          />
        </div>

        <div className="formActions" style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="btn btnPrimary">
            作成
          </button>
        </div>
      </form>
    </main>
  );
}
