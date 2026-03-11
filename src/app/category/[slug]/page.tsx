import type { Metadata } from "next";
import Link from "next/link";
import { Megaphone } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

type Listing = {
id: number;
business_name: string;
category: string | null;
city: string | null;
phone: string | null;
website_url: string | null;
};

function slugToLabel(slug: string) {
return slug
.split("-")
.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
.join(" ");
}

async function getCategoryListings(slug: string): Promise<Listing[]> {
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnon) return [];

const category = slugToLabel(slug);
const supabase = createClient(supabaseUrl, supabaseAnon);

const { data, error } = await supabase
.from("business_listings")
.select("id,business_name,category,city,phone,website_url")
.ilike("category", `%${category}%`)
.order("id", { ascending: false })
.limit(100);

if (error || !data) return [];
return data as Listing[];
}

export async function generateMetadata({
params,
}: {
params: Promise<{ slug: string }>;
}): Promise<Metadata> {
const { slug } = await params;
const categoryName = slugToLabel(slug);

return {
    title: `${categoryName} Services in UAE | UAE Biz Connect`,
    description: `Find trusted ${categoryName} businesses across UAE with contact details and websites.`,
    alternates: {
      canonical: `/category/${slug}`,
    },
    openGraph: {
      title: `${categoryName} Listings | UAE Biz Connect`,
      description: `Browse ${categoryName} companies and services in UAE.`,
      url: `https://uaebizconnect.com/category/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${categoryName} Listings | UAE Biz Connect`,
      description: `Browse ${categoryName} companies and services in UAE.`,
    },
  };
}

export default async function CategoryPage({
params,
}: {
params: Promise<{ slug: string }>;
}) {
const { slug } = await params;
const categoryName = slugToLabel(slug);
const listings = await getCategoryListings(slug);

return (
<main className="min-h-screen bg-[#f8fafc] text-slate-800">
<header className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-30">
<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
<div className="flex items-center gap-2">
<Megaphone className="text-blue-600" size={20} />
<span className="font-bold text-lg tracking-tight">UAE Biz Connect</span>
</div>
<Link href="/" className="text-sm text-blue-600 hover:underline">← Back to Home</Link>
</div>
</header>

<section className="max-w-6xl mx-auto px-4 py-8">
<h1 className="text-3xl font-bold">{categoryName} in UAE</h1>
<p className="text-slate-600 mt-2">
{listings.length} listing{listings.length === 1 ? "" : "s"} found
</p>

{listings.length === 0 ? (
<p className="mt-6 text-slate-500">No listings found for {categoryName} yet.</p>
) : (
<div className="mt-6 grid md:grid-cols-2 gap-4">
{listings.map((item) => (
<article key={item.id} className="bg-white border rounded-xl p-5">
<h2 className="text-lg font-bold">{item.business_name}</h2>
<p className="text-sm text-slate-500">{item.category || "General Services"}</p>
<p className="text-sm text-slate-600 mt-2">{item.city || "UAE"}</p>
<p className="text-sm text-slate-600">{item.phone || "N/A"}</p>

<div className="mt-4 flex gap-2">
<Link
href={`/listing/${item.id}`}
className="border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-50"
>
View Details
</Link>
{item.website_url ? (
<a
href={item.website_url}
target="_blank"
rel="noreferrer"
className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
>
Visit Website
</a>
) : (
<button className="bg-slate-400 text-white px-4 py-2 rounded-lg text-sm cursor-not-allowed">
No Website
</button>
)}
</div>
</article>
))}
</div>
)}
</section>
</main>
);
}