import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
title: "Terms of Use | UAE Biz Connect",
description: "Terms of Use for UAE Biz Connect.",
};

export default function TermsOfUsePage() {
return (
<LegalLayout title="Terms of Use">
<p>
Welcome to <strong>UAE Biz Connect</strong> (“Website”, “we”, “our”, “us”).
By accessing or using this Website, you agree to these Terms.
</p>

<h2 className="mt-8 text-xl font-bold">1. Eligibility</h2>
<p>You must be at least 18 years old (or legal age in your jurisdiction).</p>

<h2 className="mt-8 text-xl font-bold">2. Service Model (Current Phase)</h2>
<p>
Listings are currently <strong>free of charge</strong>. We do <strong>not</strong> charge listing
fees or accept paid advertising/sponsored placements at this stage.
</p>

<h2 className="mt-8 text-xl font-bold">3. Future Monetization</h2>
<p>We may introduce paid features in future with prior notice via updated Terms.</p>

<h2 className="mt-8 text-xl font-bold">4. Governing Law</h2>
<p>
These Terms are governed by the laws of the <strong>United Arab Emirates</strong>.
</p>

<h2 className="mt-8 text-xl font-bold">5. Contact</h2>
<p>
For questions:{" "}
<a className="text-blue-600 hover:underline" href="mailto:info@uaebizconnect.com">
info@uaebizconnect.com
</a>
</p>
</LegalLayout>
);
}