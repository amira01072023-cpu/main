// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import CookieConsentBanner from "@/components/CookieConsentBanner";

export const metadata: Metadata = {
  metadataBase: new URL("https://uaebizconnect.com"),
  title: {
    default: "UAE Biz Connect",
    template: "%s | UAE Biz Connect",
  },
  description: "Find local businesses, services, and contacts across the UAE.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html lang="en">
<body>
{children}
<CookieConsentBanner />
</body>
</html>
);
}