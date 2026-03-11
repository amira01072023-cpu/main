"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import { Search, MapPin, Phone, Star, Building2, Megaphone } from "lucide-react";
import { getBasicListingCompleteness } from "@/lib/listing-completeness";

type Listing = {
id: number;
business_name: string;
category: string | null;
city: string | null;
phone: string | null;
website_url: string | null;
};

type ListingsResponse = {
items: Listing[];
page: number;
limit: number;
total: number;
totalPages: number;
};

type FiltersResponse = {
categories: string[];
cities: string[];
};

type PopularCategory = {
name: string;
count: number;
};

export default function Page() {
const [listings, setListings] = useState<Listing[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [q, setQ] = useState("");
const [category, setCategory] = useState("");
const [city, setCity] = useState("");

const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
const [cityOptions, setCityOptions] = useState<string[]>([]);
const [popularCategories, setPopularCategories] = useState<PopularCategory[]>([]);

const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [total, setTotal] = useState(0);

const liveSectionRef = useRef<HTMLElement | null>(null);

const loadListings = async (params?: { q?: string; category?: string; city?: string; page?: number }) => {
try {
setLoading(true);
setError("");

const url = new URL("/api/listings", window.location.origin);
url.searchParams.set("limit", "10");
url.searchParams.set("page", String(params?.page ?? 1));
if (params?.q) url.searchParams.set("q", params.q);
if (params?.category) url.searchParams.set("category", params.category);
if (params?.city) url.searchParams.set("city", params.city);

const res = await fetch(url.toString(), { cache: "no-store" });
const data: ListingsResponse | { error: string } = await res.json();

if (!res.ok || "error" in data) {
throw new Error("error" in data ? data.error : "Failed to load listings");
}

setListings(data.items ?? []);
setPage(data.page ?? 1);
setTotalPages(data.totalPages ?? 1);
setTotal(data.total ?? 0);
} catch (e: unknown) {
setError(e instanceof Error ? e.message : "Something went wrong");
} finally {
setLoading(false);
}
};

const loadFilters = async () => {
try {
const res = await fetch("/api/listings/filters", { cache: "no-store" });
const data: FiltersResponse | { error: string } = await res.json();
if (!res.ok || "error" in data) {
throw new Error("error" in data ? data.error : "Failed to load filters");
}
setCategoryOptions(data.categories ?? []);
setCityOptions(data.cities ?? []);
} catch {
setCategoryOptions([]);
setCityOptions([]);
}
};

const loadPopularCategories = async () => {
try {
const res = await fetch("/api/listings/popular-categories", { cache: "no-store" });
const data = await res.json();
if (res.ok) setPopularCategories(data.categories || []);
} catch {
setPopularCategories([]);
}
};

useEffect(() => {
loadListings({ page: 1 });
loadFilters();
loadPopularCategories();
}, []);

const onSearch = async () => {
await loadListings({ q, category, city, page: 1 });
liveSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const onPrev = () => page > 1 && loadListings({ q, category, city, page: page - 1 });
const onNext = () => page < totalPages && loadListings({ q, category, city, page: page + 1 });

const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
if (e.key === "Enter") {
e.preventDefault();
onSearch();
}
};

return (
<main className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased">
<header className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-30">
<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
<div className="flex items-center gap-2">
<Megaphone className="text-blue-600" size={20} />
<span className="font-bold text-lg tracking-tight">UAE Biz Connect</span>
</div>

<div className="flex items-center gap-2">
<Link
href="/vendors"
className="bg-white text-blue-700 border border-blue-200 text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition"
>
Vendors
</Link>
<Link
href="/list-your-business"
className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
>
List Your Business
</Link>
</div>
</div>
</header>

<section className="hero-wrap relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-500 text-white">
<div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_20%_20%,#ffffff_0%,transparent_35%),radial-gradient(circle_at_80%_0%,#ffffff_0%,transparent_30%)]" />
<div className="hero-flag-accent" aria-hidden="true" />

<div className="uae-hero-art" aria-hidden="true">
<svg className="uae-art burj" viewBox="0 0 120 260">
<path
d="M60 8 L68 52 L63 52 L72 104 L64 104 L74 154 L61 154 L69 230 L55 230 L60 8"
fill="none"
stroke="currentColor"
strokeWidth="2.2"
strokeLinecap="round"
/>
<circle cx="60" cy="8" r="2.5" fill="currentColor" />
</svg>

<svg className="uae-art sail" viewBox="0 0 180 220">
<path
d="M40 200 C55 130, 65 70, 120 24 C125 70, 132 125, 145 200"
fill="none"
stroke="currentColor"
strokeWidth="2.2"
strokeLinecap="round"
/>
<path d="M40 200 H150" fill="none" stroke="currentColor" strokeWidth="2.2" />
<path d="M110 62 C98 72, 96 96, 112 110" fill="none" stroke="currentColor" strokeWidth="2" />
</svg>

<svg className="uae-art mosque" viewBox="0 0 260 140">
<path d="M20 115 H240" fill="none" stroke="currentColor" strokeWidth="2.2" />
<path d="M80 115 Q130 38 180 115" fill="none" stroke="currentColor" strokeWidth="2.2" />
<path d="M56 115 V60 M204 115 V60" fill="none" stroke="currentColor" strokeWidth="2.2" />
<path d="M56 60 L61 50 L56 40 L51 50 Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
<path d="M204 60 L209 50 L204 40 L199 50 Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
</svg>

<svg className="uae-art dunes" viewBox="0 0 320 120">
<path d="M0 90 Q45 60 90 82 T180 82 T270 78 T320 88" fill="none" stroke="currentColor" strokeWidth="2.2" />
<path d="M0 105 Q55 78 110 98 T220 96 T320 104" fill="none" stroke="currentColor" strokeWidth="2" />
</svg>

<svg className="uae-art sparkle s1" viewBox="0 0 24 24">
<path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" strokeWidth="1.8" />
</svg>
<svg className="uae-art sparkle s2" viewBox="0 0 24 24">
<path d="M12 2v20M2 12h20" fill="none" stroke="currentColor" strokeWidth="1.8" />
</svg>
<svg className="uae-art sparkle s3" viewBox="0 0 24 24">
<path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" strokeWidth="1.6" />
</svg>
<svg className="uae-art arc a1" viewBox="0 0 240 120">
<path d="M10 100 C70 30, 170 30, 230 100" fill="none" stroke="currentColor" strokeWidth="2" />
</svg>
<svg className="uae-art arc a2" viewBox="0 0 240 120">
<path d="M10 98 C70 38, 170 38, 230 98" fill="none" stroke="currentColor" strokeWidth="1.8" />
</svg>
</div>

<div className="hero-content relative max-w-6xl mx-auto px-4 py-16 md:py-20">
<h1 className="text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl">
Find Local Businesses, Services & Contacts Across the UAE
</h1>
<p className="mt-4 text-blue-100 max-w-2xl">
Search by business name, category, or emirate. Discover trusted listings quickly.
</p>

<div className="mt-5 flex flex-wrap gap-2 text-xs md:text-sm">
<span className="bg-white/15 border border-white/20 px-3 py-1 rounded-full">Verified public listings</span>
<span className="bg-white/15 border border-white/20 px-3 py-1 rounded-full">UAE-wide coverage</span>
<span className="bg-white/15 border border-white/20 px-3 py-1 rounded-full">Free business listings</span>
</div>

<div className="mt-8 bg-white/95 backdrop-blur rounded-2xl p-3 md:p-4 shadow-2xl border border-white/40">
<div className="grid md:grid-cols-3 gap-3">
<div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white">
<Search size={18} className="text-slate-500" />
<input
value={q}
onChange={(e) => setQ(e.target.value)}
onKeyDown={onSearchKeyDown}
placeholder="What are you looking for?"
className="w-full outline-none text-slate-700"
/>
</div>

<div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white">
<Building2 size={18} className="text-slate-500" />
<select
value={category}
onChange={(e) => setCategory(e.target.value)}
onKeyDown={onSearchKeyDown}
className="w-full outline-none text-slate-700 bg-transparent"
>
<option value="">All Categories</option>
{categoryOptions.map((cat) => (
<option key={cat} value={cat}>
{cat}
</option>
))}
</select>
</div>

<div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white">
<MapPin size={18} className="text-slate-500" />
<select
value={city}
onChange={(e) => setCity(e.target.value)}
onKeyDown={onSearchKeyDown}
className="w-full outline-none text-slate-700 bg-transparent"
>
<option value="">All Emirates</option>
{cityOptions.map((c) => (
<option key={c} value={c}>
{c}
</option>
))}
</select>
</div>
</div>

<button
onClick={onSearch}
className="mt-3 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
>
Search Now
</button>
</div>
</div>
</section>

<section className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
<div className="bg-white border rounded-xl p-4 shadow-sm">
<p className="text-xs text-slate-500">Total Listings</p>
<p className="text-xl font-bold">{total}</p>
</div>
<div className="bg-white border rounded-xl p-4 shadow-sm">
<p className="text-xs text-slate-500">Emirates Covered</p>
<p className="text-xl font-bold">{cityOptions.length}</p>
</div>
<div className="bg-white border rounded-xl p-4 shadow-sm">
<p className="text-xs text-slate-500">Categories</p>
<p className="text-xl font-bold">{categoryOptions.length}</p>
</div>
<div className="bg-white border rounded-xl p-4 shadow-sm">
<p className="text-xs text-slate-500">Directory Status</p>
<p className="text-xl font-bold text-green-600">Live</p>
</div>
</div>
</section>

<section ref={liveSectionRef} className="max-w-6xl mx-auto px-4 py-12">
<div className="flex items-end justify-between mb-5">
<h2 className="text-2xl font-bold">Live Listings</h2>
<span className="text-sm text-slate-500">{total} total records</span>
</div>

{loading && <p className="text-slate-500">Loading listings...</p>}
{error && <p className="text-red-600">Error: {error}</p>}
{!loading && !error && listings.length === 0 && <p className="text-slate-500">No listings found for this search.</p>}

{!loading && !error && listings.length > 0 && (
<>
<div className="grid md:grid-cols-2 gap-4">
{listings.map((item) => (
<article
key={item.id}
className="group bg-white rounded-2xl border border-slate-200/80 p-5 transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:border-blue-200"
>
<h3 className="text-lg font-bold">{item.business_name}</h3>
<p className="inline-block mt-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
{item.category || "General Services"}
</p>

<div className="mt-3 space-y-2 text-sm text-slate-600">
<p className="flex items-center gap-2">
<MapPin size={15} /> {item.city || "UAE"}
</p>
<p className="flex items-center gap-2">
<Phone size={15} /> {item.phone || "N/A"}
</p>
<p className="flex items-center gap-1">
<Star size={15} className="text-amber-500 fill-amber-500" />
<span>Verified public listing</span>
</p>
<p className="text-xs text-slate-500">
Profile completeness: {getBasicListingCompleteness(item)}%
</p>
</div>

<div className="mt-4 flex flex-wrap gap-2">
<Link
href={`/listing/${item.id}`}
className="inline-flex items-center border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-50 hover:border-slate-400 transition-colors"
>
View Details
</Link>

{item.website_url ? (
<a
href={item.website_url}
target="_blank"
rel="noreferrer"
className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
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

<div className="mt-6 flex items-center justify-between">
<p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
<div className="flex gap-2">
<button
onClick={onPrev}
disabled={page <= 1}
className="px-3 py-2 rounded border border-slate-300 disabled:opacity-50 hover:bg-slate-50"
>
Prev
</button>
<button
onClick={onNext}
disabled={page >= totalPages}
className="px-3 py-2 rounded border border-slate-300 disabled:opacity-50 hover:bg-slate-50"
>
Next
</button>
</div>
</div>
</>
)}
</section>

<section className="max-w-6xl mx-auto px-4 pb-12">
<div className="flex items-end justify-between mb-5">
<h2 className="text-2xl font-bold">Popular Categories</h2>
</div>

<div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
{popularCategories.map((cat) => (
<div key={cat.name} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition">
<div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
<Building2 size={18} />
</div>
<h3 className="font-semibold">{cat.name}</h3>
<p className="text-sm text-slate-500">{cat.count} businesses</p>
</div>
))}
</div>
</section>

<SiteFooter />


</main>
);
}