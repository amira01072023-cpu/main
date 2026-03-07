import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
try {
const supabase = await createClient();
const {
data: { user },
} = await supabase.auth.getUser();

if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

const body = await req.json();

const payload = {
user_id: user.id,
business_name: (body.business_name || "").trim(),
category: (body.category || "").trim(),
city: (body.city || "").trim(),
phone: (body.phone || "").trim(),
email: (body.email || "").trim(),
website_url: (body.website_url || "").trim(),
address: (body.address || "").trim(),
services: (body.services || "").trim(),
status: "pending",
};

if (!payload.business_name) {
return NextResponse.json({ error: "Business name is required" }, { status: 400 });
}

const { error } = await supabase.from("business_submissions").insert(payload);
if (error) return NextResponse.json({ error: error.message }, { status: 500 });

return NextResponse.json({ success: true });
} catch (e: any) {
return NextResponse.json({ error: e.message || "Unexpected error" }, { status: 500 });
}
}