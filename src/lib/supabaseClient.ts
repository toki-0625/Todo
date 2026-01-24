// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,     // ★ブラウザに保存
      autoRefreshToken: true,   // ★自動更新
      detectSessionInUrl: true, // ★OAuth等にも対応（今回は保険）
    },
  }
);
