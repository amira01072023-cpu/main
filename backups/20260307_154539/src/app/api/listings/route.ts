import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
const { searchParams } = new URL(req.url);

const q = (searchParams.get("q") || "").trim();
const category = (searchParams.get("category") || "").trim();
const city = (searchParams.get("city") || "").trim();

const page = Math.max(Number(searchParams.get("page") || 1), 1);
const limit = Math.min(Math.max(Number(searchParams.get("limit") || 10), 1), 50);
const from = (page - 1) * limit;
const to = from + limit - 1;

let query = supabase
.from("business_listings")
.select("id,business_name,category,city,phone,website_url", { count: "exact" });

if (q) query = query.ilike("business_name", `%${q}%`);
if (category) query = query.eq("category", category); // exact match now
if (city) query = query.eq("city", city); // exact match now

const { data, error, count } = await query.order("id", { ascending: false }).range(from, to);

if (error) return NextResponse.json({ error: error.message }, { status: 500 });

return NextResponse.json({
items: data ?? [],
page,
limit,
total: count ?? 0,
totalPages: Math.max(Math.ceil((count ?? 0) / limit), 1),
});
}