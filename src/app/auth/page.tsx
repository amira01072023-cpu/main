// src/app/auth/page.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function AuthPage() {
const supabase = createClient();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isSignUp, setIsSignUp] = useState(true);
const [msg, setMsg] = useState("");

const submit = async () => {
setMsg("");
if (!email || !password) return setMsg("Email and password required.");

if (isSignUp) {
const { error } = await supabase.auth.signUp({ email, password });

if (error) {
const m = (error.message || "").toLowerCase();

if (
m.includes("already registered") ||
m.includes("already exists") ||
m.includes("user already registered")
) {
setIsSignUp(false);
return setMsg("This email is already registered. Please sign in.");
}

return setMsg(error.message);
}

return setMsg("Account created. Check your email if confirmation is enabled.");
}

const { error } = await supabase.auth.signInWithPassword({ email, password });
if (error) return setMsg(error.message);

const params = new URLSearchParams(window.location.search);
const next = params.get("redirectedFrom") || "/vendors";
window.location.href = next;
};

return (
<main className="min-h-screen bg-[#f8fafc] p-6">
<div className="max-w-md mx-auto mt-12 bg-white border rounded-xl p-6">
<h1 className="text-2xl font-bold mb-2">Sign in / Sign up</h1>
<p className="text-sm text-slate-500 mb-6">Use your email and password.</p>

<input
type="email"
className="w-full border rounded-lg px-3 py-2 mb-3"
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
/>

<input
type="password"
className="w-full border rounded-lg px-3 py-2 mb-3"
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
/>

<button
onClick={submit}
className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
>
{isSignUp ? "Create account" : "Sign in"}
</button>

<button
onClick={() => {
setIsSignUp(!isSignUp);
setMsg("");
}}
className="w-full mt-3 text-sm text-blue-600"
>
{isSignUp ? "Already have account? Sign in" : "Need account? Sign up"}
</button>

{msg && <p className="mt-4 text-sm text-red-600">{msg}</p>}
</div>
</main>
);
}