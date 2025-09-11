import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// client admin avec la Service Role Key (⚠️ jamais côté front)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { userId, role } = await req.json();

  if (!["scout", "chef"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    app_metadata: { role }
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, user: data.user });
}
// Cette route API permet de promouvoir un utilisateur en "scout" ou "chef" en mettant à jour son app_metadata.role