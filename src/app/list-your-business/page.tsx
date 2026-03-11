"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, Home } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

export default function ListYourBusinessPage() {
const supabase = createClient();
const [ready, setReady] = useState(false);

const [form, setForm] = useState({
business_name: "",
category: "",
city: "",
phone: "",
email: "",
website_url: "",
address: "",
services: "",
});

const [msg, setMsg] = useState("");
const [submitting, setSubmitting] = useState(false);

useEffect(() => {
(async () => {
const { data } = await supabase.auth.getUser();
if (!data.user) {
window.location.href = "/auth";
} else {
setReady(true);
}
})();
}, [supabase]);

const signOut = async () => {
await supabase.auth.signOut();
window.location.href = "/auth";
};

const setField = (k: string, v: string) =>
setForm((p) => ({ ...p, [k]: v }));

const submit = async (e: React.FormEvent) => {
e.preventDefault();
setMsg("");

if (
!form.business_name.trim() ||
!form.category.trim() ||
!form.city.trim() ||
!form.phone.trim() ||
!form.email.trim() ||
!form.website_url.trim() ||
!form.address.trim() ||
!form.services.trim()
) {
return setMsg("All fields are required.");
}

setSubmitting(true);

try {
const res = await fetch("/api/business-submissions", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(form),
});

const data = await res.json();

if (!res.ok) {
setMsg(data.error || "Failed to submit");
return;
}

setMsg("✅ Submitted successfully. Status: Pending admin approval.");

setForm({
business_name: "",
category: "",
city: "",
phone: "",
email: "",
website_url: "",
address: "",
services: "",
});

setTimeout(() => {
window.location.href = "/";
}, 1500);
} catch {
setMsg("Something went wrong. Please try again.");
} finally {
setSubmitting(false);
}
};

if (!ready) {
return <main className="p-8">Checking session...</main>;
}

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
href="/"
className="inline-flex items-center gap-2 bg-white text-blue-700 border border-blue-200 text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition"
>
<Home size={16} />
Home
</Link>
<Link
href="/vendors"
className="bg-white text-blue-700 border border-blue-200 text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition"
>
Vendors
</Link>
</div>
</div>
</header>

<section className="p-6">
<div className="max-w-2xl mx-auto bg-white border rounded-xl p-6 mt-8">
<div className="flex items-center justify-between mb-4">
<h1 className="text-2xl font-bold">List Your Business</h1>
<button
onClick={signOut}
className="text-sm border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50"
>
Sign out
</button>
</div>

<form onSubmit={submit} className="space-y-3">
<input
className="w-full border rounded-lg px-3 py-2"
placeholder="Business Name *"
value={form.business_name}
onChange={(e) => setField("business_name", e.target.value)}
required
/>
<input
className="w-full border rounded-lg px-3 py-2"
placeholder="Category *"
value={form.category}
onChange={(e) => setField("category", e.target.value)}
required
/>
<input
className="w-full border rounded-lg px-3 py-2"
placeholder="City *"
value={form.city}
onChange={(e) => setField("city", e.target.value)}
required
/>
<input
className="w-full border rounded-lg px-3 py-2"
placeholder="Phone *"
value={form.phone}
onChange={(e) => setField("phone", e.target.value)}
required
/>
<input
type="email"
className="w-full border rounded-lg px-3 py-2"
placeholder="Email *"
value={form.email}
onChange={(e) => setField("email", e.target.value)}
required
/>
<input
type="url"
className="w-full border rounded-lg px-3 py-2"
placeholder="Website URL *"
value={form.website_url}
onChange={(e) => setField("website_url", e.target.value)}
required
/>
<input
className="w-full border rounded-lg px-3 py-2"
placeholder="Address *"
value={form.address}
onChange={(e) => setField("address", e.target.value)}
required
/>
<textarea
className="w-full border rounded-lg px-3 py-2 min-h-[100px]"
placeholder="Services *"
value={form.services}
onChange={(e) => setField("services", e.target.value)}
required
/>

<button
disabled={submitting}
className="bg-blue-600 text-white px-5 py-2 rounded-lg disabled:opacity-60"
>
{submitting ? "Submitting..." : "Submit"}
</button>
</form>

{msg && <p className="mt-4 text-sm">{msg}</p>}
</div>
</section>

<footer className="footer-image-bg relative overflow-hidden text-slate-300">
<div className="footer-overlay" />

<div className="relative z-10 max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
<div>
<h3 className="text-white font-bold mb-3">UAE Biz Connect</h3>
<p className="text-sm text-slate-200">Your trusted local business directory for all Emirates.</p>
</div>

<div>
<h4 className="text-white font-semibold mb-3">Support</h4>
<ul className="space-y-1 text-sm text-slate-200">
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