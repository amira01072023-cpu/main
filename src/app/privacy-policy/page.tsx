import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
title: "Privacy Policy | UAE Biz Connect",
description: "Privacy Policy for UAE Biz Connect.",
};

export default function PrivacyPolicyPage() {
return (
<LegalLayout title="Privacy Policy">
<p>
UAE Biz Connect (“we”, “our”, “us”) respects your privacy. This Policy
explains how we collect, use, and protect personal data.
</p>

<h2 className="mt-8 text-xl font-bold">1. Information We Collect</h2>
<ul className="list-disc pl-6 space-y-1">
<li>Information you provide (name, email, listing details, messages)</li>
<li>Usage/device data (IP, browser, pages, timestamps)</li>
<li>Cookies and similar technologies</li>
</ul>

<h2 className="mt-8 text-xl font-bold">2. How We Use Data</h2>
<ul className="list-disc pl-6 space-y-1">
<li>Operate and maintain the Website</li>
<li>Publish/manage listings</li>
<li>Improve performance and user experience</li>
<li>Support, security, and legal compliance</li>
</ul>

<h2 className="mt-8 text-xl font-bold">3. Current Non-Monetization Model</h2>
<ul className="list-disc pl-6 space-y-1">
<li>Listings are free of charge</li>
<li>No paid advertising or sponsored placement at this stage</li>
<li>No monetized ad targeting at this stage</li>
</ul>

<h2 className="mt-8 text-xl font-bold">4. No Sale of Personal Data</h2>
<p>We do <strong>not</strong> sell personal data to third parties.</p>

<h2 className="mt-8 text-xl font-bold">5. Contact</h2>
<p>
Privacy inquiries:{" "}
<a className="text-blue-600 hover:underline" href="mailto:info@uaebizconnect.com">
info@uaebizconnect.com
</a>
</p>
</LegalLayout>
);
}