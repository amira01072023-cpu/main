"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Phone, Star, Building2, Megaphone } from "lucide-react";

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

if (!res.ok || "error" in data) throw new Error("error" in data ? data.error : "Failed to load listings");

setListings(data.items ?? []);
setPage(data.page ?? 1);
setTotalPages(data.totalPages ?? 1);
setTotal(data.total ?? 0);
} catch (e: any) {
setError(e.message || "Something went wrong");
} finally {
setLoading(false);
}
};

const loadFilters = async () => {
try {
const res = await fetch("/api/listings/filters", { cache: "no-store" });
const data: FiltersResponse | { error: string } = await res.json();
if (!res.ok || "error" in data) throw new Error("error" in data ? data.error : "Failed to load filters");
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
<main className="min-h-screen bg-[#f8fafc] text-slate-800">
<header className="bg-white border-b border-slate-200 sticky top-0 z-20">
<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
<div className="flex items-center gap-2">
<Megaphone className="text-blue-600" size={20} />
<span className="font-bold text-lg tracking-tight">UAE Biz Connect</span>
</div>
<Link
href="/list-your-business"
className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
>
List Your Business
</Link>
</div>
</header>

<section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">
<div className="max-w-6xl mx-auto px-4 py-16">
<h1 className="text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl">
Find Local Businesses, Services & Contacts Across the UAE
</h1>

<div className="mt-8 bg-white rounded-xl p-3 md:p-4 shadow-lg">
<div className="grid md:grid-cols-3 gap-3">
<div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
<Search size={18} className="text-slate-500" />
<input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onSearchKeyDown}
placeholder="What are you looking for?" className="w-full outline-none text-slate-700" />
</div>
<div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
<Building2 size={18} className="text-slate-500" />
<select value={category} onChange={(e) => setCategory(e.target.value)} onKeyDown={onSearchKeyDown}
className="w-full outline-none text-slate-700 bg-transparent">
<option value="">All Categories</option>
{categoryOptions.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
</select>
</div>
<div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
<MapPin size={18} className="text-slate-500" />
<select value={city} onChange={(e) => setCity(e.target.value)} onKeyDown={onSearchKeyDown}
className="w-full outline-none text-slate-700 bg-transparent">
<option value="">All Cities</option>
{cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
</select>
</div>
</div>
<button onClick={onSearch} className="mt-3 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium">
Search Now
</button>
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
<article key={item.id} className="bg-white rounded-xl border border-slate-200 p-5">
<h3 className="text-lg font-bold">{item.business_name}</h3>
<p className="text-sm text-slate-500">{item.category || "General Services"}</p>
<div className="mt-3 space-y-2 text-sm text-slate-600">
<p className="flex items-center gap-2"><MapPin size={15} /> {item.city || "UAE"}</p>
<p className="flex items-center gap-2"><Phone size={15} /> {item.phone || "N/A"}</p>
<p className="flex items-center gap-1"><Star size={15} className="text-amber-500 fill-amber-500" /> <span>Verified public listing</span></p>
</div>
<div className="mt-4">
{item.website_url ? (
<a href={item.website_url} target="_blank" rel="noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
Visit Website
</a>
) : (
<button className="bg-slate-400 text-white px-4 py-2 rounded-lg text-sm cursor-not-allowed">No Website</button>
)}
</div>
</article>
))}
</div>

<div className="mt-6 flex items-center justify-between">
<p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
<div className="flex gap-2">
<button onClick={onPrev} disabled={page <= 1} className="px-3 py-2 rounded border border-slate-300 disabled:opacity-50">Prev</button>
<button onClick={onNext} disabled={page >= totalPages} className="px-3 py-2 rounded border border-slate-300 disabled:opacity-50">Next</button>
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
<div key={cat.name} className="bg-white rounded-xl border border-slate-200 p-4">
<div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
<Building2 size={18} />
</div>
<h3 className="font-semibold">{cat.name}</h3>
<p className="text-sm text-slate-500">{cat.count} businesses</p>
</div>
))}
</div>
</section>

<footer className="bg-slate-900 text-slate-300">
<div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
<div>
<h3 className="text-white font-bold mb-3">UAE Biz Connect</h3>
<p className="text-sm text-slate-400">Your trusted local business directory for all Emirates.</p>
</div>
<div>
<h4 className="text-white font-semibold mb-3">Support</h4>
<ul className="space-y-1 text-sm text-slate-400">
<li><a className="hover:text-white" href="mailto:info@uaebizconnect.com">Contact Us</a></li>
<li><Link className="hover:text-white" href="/privacy-policy">Privacy Policy</Link></li>
<li><Link className="hover:text-white" href="/terms-of-use">Terms of Use</Link></li>
</ul>
</div>
</div>
</footer>
</main>
);
}
