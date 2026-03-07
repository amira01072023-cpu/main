import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
try {
const supabase = await createClient();
const {
data: { user },
} = await supabase.auth.getUser();

if (!user) {
return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const body = await req.json();

// exact keys expected from claim form
const listing_id = Number(body?.listing_id);
const claimant_name = String(body?.claimant_name || "").trim();
const claimant_email = String(body?.claimant_email || "").trim().toLowerCase();
const claimant_phone = String(body?.claimant_phone || "").trim();
const relation_to_business = String(body?.relation_to_business || "").trim();
const message = String(body?.message || "").trim();

if (
!listing_id ||
!claimant_name ||
!claimant_email ||
!claimant_phone ||
!relation_to_business
) {
return NextResponse.json(
{ error: "Missing required fields in claim request." },
{ status: 400 }
);
}

const { error } = await supabase.from("listing_claim_requests").insert({
listing_id,
claimant_user_id: user.id,
claimant_name,
claimant_email,
claimant_phone,
relation_to_business,
message: message || null,
status: "pending",
});

if (error) {
return NextResponse.json({ error: error.message }, { status: 500 });
}

return NextResponse.json({ success: true });
} catch (e: any) {
return NextResponse.json(
{ error: e?.message || "Unexpected error while creating claim." },
{ status: 500 }
);
}
}