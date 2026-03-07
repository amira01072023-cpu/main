import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
metadataBase: new URL("https://uaebizconnect.com"),
title: "UAE Biz Connect | Find Businesses Across UAE",
description:
"Discover trusted businesses, services, and contacts across Dubai, Abu Dhabi, Sharjah, and all UAE emirates.",
openGraph: {
title: "UAE Biz Connect",
description: "Find local businesses and services across the UAE.",
url: "https://uaebizconnect.com",
siteName: "UAE Biz Connect",
type: "website",
},
twitter: {
card: "summary_large_image",
title: "UAE Biz Connect",
description: "Find local businesses and services across the UAE.",
},
};

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html lang="en">
<body>{children}</body>
</html>
);
}