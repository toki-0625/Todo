import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: 24 }}>
      <h1>見つかりませんでした</h1>
      <p>そのTodoは存在しないか、閲覧権限がありません。</p>
      <Link href="/todos">一覧へ戻る</Link>
    </main>
  );
}
