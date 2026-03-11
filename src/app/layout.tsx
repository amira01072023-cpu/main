// src/app/layout.tsx
import "./globals.css";
import CookieConsentBanner from "@/components/CookieConsentBanner";

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