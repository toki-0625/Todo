"use client";

export default function DeleteButton({ action }: { action: string }) {
  return (
    <form
      action={action}
      method="post"
      onSubmit={(e) => {
        if (!confirm("このTodoを削除しますか？")) e.preventDefault();
      }}
    >
      <button type="submit" className="btn" style={{ color: "#ff6b6b" }}>
        削除
      </button>
    </form>
  );
}
