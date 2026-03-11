"use client";

import { useState } from "react";
import Link from "next/link";

type Consent = "accepted" | "rejected";
const STORAGE_KEY = "ubc_cookie_consent_v1";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.localStorage.getItem(STORAGE_KEY);
  });

  const handleChoice = (choice: Consent) => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
      <p className="text-sm text-slate-700">
        We use essential cookies to keep the site secure and working. Non-essential cookies (analytics/marketing)
        are disabled by default and only enabled if you accept.
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Read more in our <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => handleChoice("rejected")}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
        >
          Reject non-essential
        </button>
        <button
          onClick={() => handleChoice("accepted")}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
        >
          Accept all
        </button>
      </div>
    </div>
  );
}
