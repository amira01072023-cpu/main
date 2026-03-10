import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
try {
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
return NextResponse.json(
{
error: "Server env missing",
hasUrl: !!supabaseUrl,
hasServiceKey: !!serviceKey,
},
{ status: 500 }
);
}

const supabase = createClient(supabaseUrl, serviceKey);

const { searchParams } = new URL(req.url);
const q = (searchParams.get("q") || "").trim();
const page = Number(searchParams.get("page") || 1);
const limit = Number(searchParams.get("limit") || 10);
const from = (page - 1) * limit;
const to = from + limit - 1;

let query = supabase
.from("vendors")
.select("id, company_name, services, website_url", { count: "exact" });

if (q) query = query.or(`company_name.ilike.%${q}%,services.ilike.%${q}%`);

const { data, error, count } = await query.order("id", { ascending: false }).range(from, to);
if (error) throw error;

return NextResponse.json({
items: data ?? [],
page,
limit,
total: count ?? 0,
totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
});
} catch (e: any) {
return NextResponse.json({ error: e.message || "Failed to load vendors" }, { status: 500 });
}
}