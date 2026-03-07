"use client";

import { useEffect, useState } from "react";

type Submission = {
id: number;
user_id: string;
business_name: string;
category: string | null;
city: string | null;
phone: string | null;
email: string | null;
website_url: string | null;
address: string | null;
services: string | null;
status: "pending" | "approved" | "rejected" | string;
review_note: string | null;
created_at: string;
reviewed_at: string | null;
};

export default function AdminSubmissionsPage() {
const [items, setItems] = useState<Submission[]>([]);
const [loading, setLoading] = useState(true);
const [msg, setMsg] = useState("");
const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
const [notes, setNotes] = useState<Record<number, string>>({});

const load = async () => {
try {
setLoading(true);
setMsg("");
const res = await fetch("/api/admin/submissions", { cache: "no-store" });
const raw = await res.text();
let data: any = {};
try { data = raw ? JSON.parse(raw) : {}; } catch {}
if (!res.ok) {
setMsg(data?.error || `Failed to load (${res.status})`);
setItems([]);
return;
}
setItems(data.items || []);
} catch (e: any) {
setMsg(e?.message || "Failed to load submissions");
setItems([]);
} finally {
setLoading(false);
}
};

useEffect(() => { load(); }, []);

const approve = async (id: number) => {
setActionLoadingId(id);
setMsg("");
const res = await fetch("/api/admin/submissions", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ id, action: "approve" }),
});
const raw = await res.text();
let data: any = {};
try { data = raw ? JSON.parse(raw) : {}; } catch {}
setActionLoadingId(null);

if (!res.ok) return setMsg(data?.error || `Approve failed (${res.status})`);
setMsg("✅ Submission approved and published.");
await load();
};

const reject = async (id: number) => {
const review_note = (notes[id] || "").trim();
if (!review_note) return setMsg("❌ Rejection reason is required.");

setActionLoadingId(id);
setMsg("");
const res = await fetch("/api/admin/submissions", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ id, action: "reject", review_note }),
});
const raw = await res.text();
let data: any = {};
try { data = raw ? JSON.parse(raw) : {}; } catch {}
setActionLoadingId(null);

if (!res.ok) return setMsg(data?.error || `Reject failed (${res.status})`);
setMsg("✅ Submission rejected with reason.");
await load();
};

return (
<main className="min-h-screen bg-[#f8fafc] p-6">
<div className="max-w-6xl mx-auto bg-white border rounded-xl p-6 mt-8">
<h1 className="text-2xl font-bold mb-2">Admin Review - Business Submissions</h1>
{msg && <div className="mb-4 border rounded px-3 py-2 text-sm">{msg}</div>}

{loading ? (
<p>Loading submissions...</p>
) : items.length === 0 ? (
<p>No submissions found.</p>
) : (
<div className="space-y-4">
{items.map((s) => (
<div key={s.id} className="border rounded-xl p-4">
<div className="flex items-start justify-between">
<div>
<h2 className="font-semibold text-lg">{s.business_name}</h2>
<p className="text-sm text-slate-600">{s.category || "—"} • {s.city || "—"}</p>
</div>
<span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700">{s.status}</span>
</div>

<div className="mt-3 text-sm space-y-1">
<p><b>Phone:</b> {s.phone || "—"}</p>
<p><b>Email:</b> {s.email || "—"}</p>
<p><b>Website:</b> {s.website_url || "—"}</p>
<p><b>Address:</b> {s.address || "—"}</p>
<p><b>Services:</b> {s.services || "—"}</p>
</div>

{s.status === "pending" && (
<div className="mt-3 space-y-2">
<textarea
className="w-full border rounded px-3 py-2"
placeholder="Rejection reason (required for reject)"
value={notes[s.id] || ""}
onChange={(e) => setNotes((p) => ({ ...p, [s.id]: e.target.value }))}
/>
<div className="flex gap-2">
<button
onClick={() => approve(s.id)}
disabled={actionLoadingId === s.id}
className="bg-green-600 text-white px-3 py-2 rounded"
>
Approve
</button>
<button
onClick={() => reject(s.id)}
disabled={actionLoadingId === s.id}
className="bg-red-600 text-white px-3 py-2 rounded"
>
Reject
</button>
</div>
</div>
)}
</div>
))}
</div>
)}
</div>
</main>
);
}
