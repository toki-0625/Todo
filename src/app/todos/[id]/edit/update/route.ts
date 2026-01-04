import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? null;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const formData = await req.formData();
  const title = String(formData.get("title") ?? "").trim();
  const detailRaw = formData.get("detail");
  const detail = detailRaw === null ? null : String(detailRaw);

  if (!title) {
    return new NextResponse("title is required", { status: 400 });
  }

  const { error } = await supabase
    .from("todos")
    .update({ title, detail })
    .eq("id", params.id);

  if (error) {
    console.error("UPDATE ERROR:", error);
    return new NextResponse(error.message, { status: 400 });
  }

  console.log("UPDATED ID:", params.id);

  const url = new URL(req.url);
  return NextResponse.redirect(new URL(`/todos/${params.id}`, url.origin), {
    status: 303,
  });
}
