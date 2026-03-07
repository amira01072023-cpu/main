import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { MapPin, Phone, Mail, Globe, ShieldCheck } from "lucide-react";

type Listing = {
id: number;
business_name: string;
category: string | null;
city: string | null;
phone: string | null;
email: string | null;
website_url: string | null;
address: string | null;
services: string | null;
};

async function getListing(id: string): Promise<Listing | null> {
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnon) return null;

const supabase = createClient(supabaseUrl, supabaseAnon);

const { data, error } = await supabase
.from("business_listings")
.select("id,business_name,category,city,phone,email,website_url,address,services")
.eq("id", Number(id))
.maybeSingle();

if (error || !data) return null;
return data as Listing;
}

export async function generateMetadata({
params,
}: {
params: Promise<{ id: string }>;
}): Promise<Metadata> {
const { id } = await params;
const listing = await getListing(id);

if (!listing) {
return {
title: "Listing Not Found | UAE Biz Connect",
description: "The requested business listing was not found.",
};
}

const title = `${listing.business_name} | UAE Biz Connect`;
const description = `${listing.business_name}${listing.category ? ` - ${listing.category}` : ""}${
listing.city ? ` in ${listing.city}` : ""
}. Contact details and listing information.`;

return {
title,
description,
openGraph: {
title,
description,
url: `https://uaebizconnect.com/listing/${listing.id}`,
type: "website",
},
};
}

export default async function ListingDetailPage({
params,
}: {
params: Promise<{ id: string }>;
}) {
const { id } = await params;
const listing = await getListing(id);

if (!listing) notFound();

const localBusinessJsonLd = {
"@context": "https://schema.org",
"@type": "LocalBusiness",
name: listing.business_name,
telephone: listing.phone || undefined,
email: listing.email || undefined,
url: listing.website_url || undefined,
address: listing.address
? {
"@type": "PostalAddress",
streetAddress: listing.address,
addressLocality: listing.city || undefined,
addressCountry: "AE",
}
: undefined,
areaServed: listing.city || "United Arab Emirates",
description: listing.services || listing.category || undefined,
};

const breadcrumbJsonLd = {
"@context": "https://schema.org",
"@type": "BreadcrumbList",
itemListElement: [
{
"@type": "ListItem",
position: 1,
name: "Home",
item: "https://uaebizconnect.com/",
},
{
"@type": "ListItem",
position: 2,
name: "Listings",
item: "https://uaebizconnect.com/",
},
{
"@type": "ListItem",
position: 3,
name: listing.business_name,
item: `https://uaebizconnect.com/listing/${listing.id}`,
},
],
};

return (
<main className="min-h-screen bg-[#f8fafc] text-slate-800">
<script
type="application/ld+json"
dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
/>
<script
type="application/ld+json"
dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
/>

<header className="bg-white border-b border-slate-200">
<div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
<Link href="/" className="font-bold text-lg">
UAE Biz Connect
</Link>
<Link href="/" className="text-sm text-blue-600 hover:underline">
← Back to Home
</Link>
</div>
</header>

<section className="max-w-5xl mx-auto px-4 py-8">
<article className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
<div className="flex flex-wrap items-start justify-between gap-4">
<div>
<h1 className="text-3xl font-bold">{listing.business_name}</h1>
<p className="mt-2 inline-block text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
{listing.category || "General Services"}
</p>
</div>

<span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
<ShieldCheck size={14} />
Public Listing
</span>
</div>

<div className="mt-6 grid md:grid-cols-2 gap-3 text-sm">
<p className="flex items-center gap-2">
<MapPin size={15} className="text-slate-500" />
<strong>City:</strong> {listing.city || "—"}
</p>
<p className="flex items-center gap-2">
<Phone size={15} className="text-slate-500" />
<strong>Phone:</strong> {listing.phone || "—"}
</p>
<p className="flex items-center gap-2">
<Mail size={15} className="text-slate-500" />
<strong>Email:</strong> {listing.email || "—"}
</p>
<p className="flex items-center gap-2">
<Globe size={15} className="text-slate-500" />
<strong>Website:</strong>{" "}
{listing.website_url ? (
<a
href={listing.website_url}
target="_blank"
rel="noreferrer"
className="text-blue-600 hover:underline break-all"
>
{listing.website_url}
</a>
) : (
"—"
)}
</p>
<p className="md:col-span-2">
<strong>Address:</strong> {listing.address || "—"}
</p>
<p className="md:col-span-2">
<strong>Services:</strong> {listing.services || "—"}
</p>
</div>

<div className="mt-7 flex flex-wrap gap-2">
{listing.website_url && (
<a
href={listing.website_url}
target="_blank"
rel="noreferrer"
className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
>
Visit Website
</a>
)}

{listing.phone && (
<a
href={`tel:${listing.phone}`}
className="border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-50"
>
Call Now
</a>
)}

{listing.email && (
<a
href={`mailto:${listing.email}`}
className="border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-50"
>
Email
</a>
)}

<Link
href="/list-your-business"
className="border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-50"
>
Claim / Update this Listing
</Link>

<a
href="mailto:info@uaebizconnect.com?subject=Report%20Listing%20Issue"
className="border border-slate-300 px-4 py-2 rounded-lg text-sm hover:bg-slate-50"
>
Report Listing
</a>
</div>
</article>
</section>
</main>
);
}