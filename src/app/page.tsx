import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Todo App</h1>
      <ul>
        <li><Link href="/signup">新規登録</Link></li>
        <li><Link href="/login">ログイン</Link></li>
        <li><Link href="/todos">Todo一覧</Link></li>
      </ul>
    </main>
  );
}
