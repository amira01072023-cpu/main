"use client";

import { Search, MapPin, Phone, Star, Building2, Briefcase, Stethoscope, Wrench, Car, GraduationCap, ShoppingBag, Utensils, Megaphone } from "lucide-react";

type Category = {
name: string;
icon: React.ReactNode;
count: string;
};

type Listing = {
id: number;
name: string;
category: string;
location: string;
phone: string;
rating: number;
reviews: number;
featured?: boolean;
};

const categories: Category[] = [
{ name: "Restaurants", icon: <Utensils size={18} />, count: "1,250+" },
{ name: "Shopping", icon: <ShoppingBag size={18} />, count: "980+" },
{ name: "Healthcare", icon: <Stethoscope size={18} />, count: "640+" },
{ name: "Automotive", icon: <Car size={18} />, count: "720+" },
{ name: "Education", icon: <GraduationCap size={18} />, count: "410+" },
{ name: "Home Services", icon: <Wrench size={18} />, count: "860+" },
{ name: "Real Estate", icon: <Building2 size={18} />, count: "530+" },
{ name: "Business Services", icon: <Briefcase size={18} />, count: "770+" },
];

const featuredListings: Listing[] = [
{
id: 1,
name: "Al Noor Electronics",
category: "Shopping",
location: "Dubai, UAE",
phone: "+971 4 123 4567",
rating: 4.7,
reviews: 128,
featured: true,
},
{
id: 2,
name: "Blue Wave Dental Clinic",
category: "Healthcare",
location: "Abu Dhabi, UAE",
phone: "+971 2 555 7890",
rating: 4.8,
reviews: 94,
featured: true,
},
{
id: 3,
name: "QuickFix Auto Garage",
category: "Automotive",
location: "Sharjah, UAE",
phone: "+971 6 222 8899",
rating: 4.6,
reviews: 76,
featured: true,
},
{
id: 4,
name: "Citywide Cleaning Services",
category: "Home Services",
location: "Ajman, UAE",
phone: "+971 6 888 1122",
rating: 4.5,
reviews: 52,
featured: true,
},
];

export default function Page() {
return (
<main className="min-h-screen bg-[#f8fafc] text-slate-800">
{/* Top bar */}
<header className="bg-white border-b border-slate-200 sticky top-0 z-20">
<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
<div className="flex items-center gap-2">
<Megaphone className="text-blue-600" size={20} />
<span className="font-bold text-lg">UAE Directory Pro</span>
</div>
<nav className="hidden md:flex items-center gap-5 text-sm">
<a href="#" className="hover:text-blue-600">Home</a>
<a href="#" className="hover:text-blue-600">Categories</a>
<a href="#" className="hover:text-blue-600">Cities</a>
<a href="#" className="hover:text-blue-600">Advertise</a>
</nav>
<button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">
List Your Business
</button>
</div>
</header>

{/* Hero */}
<section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">
<div className="max-w-6xl mx-auto px-4 py-16">
<p className="text-blue-100 mb-2">Trusted UAE Business Directory</p>
<h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
Find Local Businesses, Services & Contacts Across the UAE
</h1>
<p className="mt-4 text-blue-100 max-w-2xl">
Search by business name, category, or location and connect instantly.
</p>

{/* Search box */}
<div className="mt-8 bg-white rounded-xl p-3 md:p-4 shadow-lg">
<div className="grid md:grid-cols-3 gap-3">
<div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
<Search size={18} className="text-slate-500" />
<input
placeholder="What are you looking for?"
className="w-full outline-none text-slate-700"
/>
</div>
<div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
<Building2 size={18} className="text-slate-500" />
<input
placeholder="Category (e.g. Restaurants)"
className="w-full outline-none text-slate-700"
/>
</div>
<div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
<MapPin size={18} className="text-slate-500" />
<input
placeholder="City (e.g. Dubai)"
className="w-full outline-none text-slate-700"
/>
</div>
</div>
<button className="mt-3 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium">
Search Now
</button>
</div>
</div>
</section>

{/* Popular categories */}
<section className="max-w-6xl mx-auto px-4 py-12">
<div className="flex items-end justify-between mb-5">
<h2 className="text-2xl font-bold">Popular Categories</h2>
<a href="#" className="text-blue-600 text-sm hover:underline">View all</a>
</div>
<div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
{categories.map((cat) => (
<div
key={cat.name}
className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition"
>
<div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
{cat.icon}
</div>
<h3 className="font-semibold">{cat.name}</h3>
<p className="text-sm text-slate-500">{cat.count} businesses</p>
</div>
))}
</div>
</section>

{/* Featured listings */}
<section className="max-w-6xl mx-auto px-4 pb-12">
<div className="flex items-end justify-between mb-5">
<h2 className="text-2xl font-bold">Featured Listings</h2>
<a href="#" className="text-blue-600 text-sm hover:underline">Browse all</a>
</div>

<div className="grid md:grid-cols-2 gap-4">
{featuredListings.map((item) => (
<article
key={item.id}
className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition"
>
<div className="flex items-start justify-between gap-3">
<div>
<h3 className="text-lg font-bold">{item.name}</h3>
<p className="text-sm text-slate-500">{item.category}</p>
</div>
{item.featured && (
<span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-md font-medium">
Featured
</span>
)}
</div>

<div className="mt-4 space-y-2 text-sm text-slate-600">
<p className="flex items-center gap-2">
<MapPin size={15} /> {item.location}
</p>
<p className="flex items-center gap-2">
<Phone size={15} /> {item.phone}
</p>
<p className="flex items-center gap-1">
<Star size={15} className="text-amber-500 fill-amber-500" />
<span className="font-medium text-slate-700">{item.rating}</span>
<span className="text-slate-500">({item.reviews} reviews)</span>
</p>
</div>

<div className="mt-4 flex gap-2">
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
View Details
</button>
<button className="border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-50">
Call Now
</button>
</div>
</article>
))}
</div>
</section>

{/* CTA */}
<section className="bg-white border-y border-slate-200">
<div className="max-w-6xl mx-auto px-4 py-12 text-center">
<h2 className="text-2xl md:text-3xl font-bold">
Own a business in the UAE?
</h2>
<p className="text-slate-600 mt-2">
Get discovered by thousands of potential customers every day.
</p>
<button className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
Add Your Business
</button>
</div>
</section>

{/* Footer */}
<footer className="bg-slate-900 text-slate-300">
<div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
<div>
<h3 className="text-white font-bold mb-3">UAE Directory Pro</h3>
<p className="text-sm text-slate-400">
Your trusted local business directory for all Emirates.
</p>
</div>
<div>
<h4 className="text-white font-semibold mb-3">Top Cities</h4>
<ul className="space-y-1 text-sm text-slate-400">
<li>Dubai</li>
<li>Abu Dhabi</li>
<li>Sharjah</li>
<li>Ajman</li>
</ul>
</div>
<div>
<h4 className="text-white font-semibold mb-3">Support</h4>
<ul className="space-y-1 text-sm text-slate-400">
<li>Contact Us</li>
<li>Privacy Policy</li>
<li>Terms of Use</li>
</ul>
</div>
</div>
<div className="border-t border-slate-800 text-center text-xs text-slate-500 py-4">
© {new Date().getFullYear()} UAE Directory Pro. All rights reserved.
</div>
</footer>
</main>
);
}