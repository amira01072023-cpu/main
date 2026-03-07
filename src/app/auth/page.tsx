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
const { error } = await supabase.auth.signUp({
email,
password,
});
if (error) setMsg(error.message);
else setMsg("Account created. Check your email if confirmation is enabled.");
} else {
const { error } = await supabase.auth.signInWithPassword({
email,
password,
});
if (error) setMsg(error.message);
else window.location.href = "/list-your-business";
}
};

return (
<main className="min-h-screen bg-[#f8fafc] p-6">
<div className="max-w-md mx-auto mt-12 bg-white border rounded-xl p-6">
<h1 className="text-2xl font-bold mb-2">Sign in / Sign up</h1>
<p className="text-sm text-slate-500 mb-6">Use your email and password.</p>

<input
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

<button onClick={submit} className="w-full bg-blue-600 text-white py-2 rounded-lg">
{isSignUp ? "Create account" : "Sign in"}
</button>

<button
className="w-full mt-3 text-sm text-blue-600"
onClick={() => setIsSignUp(!isSignUp)}
>
{isSignUp ? "Already have account? Sign in" : "Need account? Sign up"}
</button>

{msg && <p className="mt-4 text-sm text-red-600">{msg}</p>}
</div>
</main>
);
}
