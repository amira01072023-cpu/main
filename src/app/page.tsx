"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Listing = {
id: number;
title: string;
created_at: string;
user_id: string;
};

export default function Page() {
const [rows, setRows] = useState<Listing[]>([]);
const [title, setTitle] = useState("");
const [status, setStatus] = useState("Loading...");
const [userId, setUserId] = useState<string | null>(null);

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

// edit state
const [editingId, setEditingId] = useState<number | null>(null);
const [editTitle, setEditTitle] = useState("");

async function loadSession() {
const { data } = await supabase.auth.getSession();
setUserId(data.session?.user?.id ?? null);
}

async function loadListings() {
const { data: sessionData } = await supabase.auth.getSession();
const uid = sessionData.session?.user?.id;

if (!uid) {
setRows([]);
setStatus("Please sign in.");
return;
}

const { data, error } = await supabase
.from("listings")
.select("*")
.order("created_at", { ascending: false });

if (error) {
setStatus(`Error: ${error.message}`);
return;
}

setRows((data as Listing[]) || []);
setStatus("✅ Signed in and fetched your listings");
}

async function signUp() {
const { error } = await supabase.auth.signUp({ email, password });
setStatus(error ? `Signup error: ${error.message}` : "Signup success. Now sign in.");
}

async function signIn() {
const { error } = await supabase.auth.signInWithPassword({ email, password });
if (error) {
setStatus(`Sign-in error: ${error.message}`);
return;
}
await loadSession();
await loadListings();
}

async function signOut() {
await supabase.auth.signOut();
setUserId(null);
setRows([]);
setEditingId(null);
setEditTitle("");
setStatus("Signed out.");
}

async function addListing(e: React.FormEvent) {
e.preventDefault();
if (!title.trim() || !userId) return;

const { error } = await supabase
.from("listings")
.insert({ title: title.trim(), user_id: userId });

if (error) {
setStatus(`Insert error: ${error.message}`);
return;
}

setTitle("");
await loadListings();
}

async function deleteListing(id: number) {
const { error } = await supabase.from("listings").delete().eq("id", id);

if (error) {
setStatus(`Delete error: ${error.message}`);
return;
}

await loadListings();
}

function startEdit(row: Listing) {
setEditingId(row.id);
setEditTitle(row.title);
}

function cancelEdit() {
setEditingId(null);
setEditTitle("");
}

async function saveEdit(id: number) {
if (!editTitle.trim()) return;

const { error } = await supabase
.from("listings")
.update({ title: editTitle.trim() })
.eq("id", id);

if (error) {
setStatus(`Update error: ${error.message}`);
return;
}

cancelEdit();
await loadListings();
}

useEffect(() => {
loadSession().then(loadListings);

const {
data: { subscription },
} = supabase.auth.onAuthStateChange(() => {
loadSession().then(loadListings);
});

return () => subscription.unsubscribe();
}, []);

return (
<main style={{ padding: 24, maxWidth: 860 }}>
<h1>Supabase Listings (Auth + Edit)</h1>
<p>{status}</p>

{!userId ? (
<div style={{ marginBottom: 20 }}>
<input
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="Email"
style={{ padding: 8, marginRight: 8 }}
/>
<input
value={password}
onChange={(e) => setPassword(e.target.value)}
type="password"
placeholder="Password"
style={{ padding: 8, marginRight: 8 }}
/>
<button onClick={signUp} style={{ marginRight: 8 }}>Sign up</button>
<button onClick={signIn}>Sign in</button>
</div>
) : (
<>
<button onClick={signOut} style={{ marginBottom: 12 }}>Sign out</button>

<form onSubmit={addListing} style={{ marginBottom: 20 }}>
<input
value={title}
onChange={(e) => setTitle(e.target.value)}
placeholder="Enter listing title"
style={{ padding: 8, width: 280, marginRight: 8 }}
/>
<button type="submit" style={{ padding: "8px 12px" }}>
Add Listing
</button>
</form>

{rows.length === 0 ? (
<p>No listings yet.</p>
) : (
<ul style={{ listStyle: "none", padding: 0 }}>
{rows.map((row) => (
<li
key={row.id}
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
border: "1px solid #ddd",
borderRadius: 8,
padding: 10,
marginBottom: 8,
gap: 10,
}}
>
<div style={{ flex: 1 }}>
{editingId === row.id ? (
<input
value={editTitle}
onChange={(e) => setEditTitle(e.target.value)}
style={{ padding: 8, width: "100%" }}
/>
) : (
<span>
<strong>{row.title}</strong> —{" "}
{new Date(row.created_at).toLocaleString()}
</span>
)}
</div>

<div style={{ display: "flex", gap: 8 }}>
{editingId === row.id ? (
<>
<button onClick={() => saveEdit(row.id)}>Save</button>
<button onClick={cancelEdit}>Cancel</button>
</>
) : (
<>
<button onClick={() => startEdit(row)}>Edit</button>
<button onClick={() => deleteListing(row.id)}>Delete</button>
</>
)}
</div>
</li>
))}
</ul>
)}
</>
)}
</main>
);
}