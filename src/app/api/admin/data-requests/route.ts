import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

const ALLOWED_ADMIN_EMAIL = "amira.01072023@gmail.com";

function normalize(v: string | null | undefined) {
  return (v || "").trim().toLowerCase();
}
function isAdmin(email?: string | null) {
  return normalize(email) === normalize(ALLOWED_ADMIN_EMAIL);
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdmin(user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("data_subject_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      {
        error:
          "Unable to read data_subject_requests. Ensure the table exists in Supabase with expected columns.",
        details: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ items: data ?? [] });
}
