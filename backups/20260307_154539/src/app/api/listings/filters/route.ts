import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type Bucket = { name: string; count: number };

function buildBuckets(values: string[]): Bucket[] {
const map = new Map<string, number>();
for (const raw of values) {
const value = raw.trim();
if (!value) continue;
map.set(value, (map.get(value) || 0) + 1);
}
return [...map.entries()]
.map(([name, count]) => ({ name, count }))
.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export async function GET() {
try {
const [{ data: categoriesData, error: cErr }, { data: citiesData, error: ciErr }] =
await Promise.all([
supabase.from("business_listings").select("category").not("category", "is", null),
supabase.from("business_listings").select("city").not("city", "is", null),
]);

if (cErr || ciErr) {
return NextResponse.json({ error: cErr?.message || ciErr?.message }, { status: 500 });
}

const categoryBuckets = buildBuckets((categoriesData ?? []).map((r) => r.category || ""));
const cityBuckets = buildBuckets((citiesData ?? []).map((r) => r.city || ""));

return NextResponse.json({
categories: categoryBuckets.map((c) => c.name),
cities: cityBuckets.map((c) => c.name),
categoryBuckets,
cityBuckets,
});
} catch (e: any) {
return NextResponse.json({ error: e?.message || "Failed to load filters" }, { status: 500 });
}
}