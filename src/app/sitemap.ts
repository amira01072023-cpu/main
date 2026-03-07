import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const baseUrl = "https://uaebizconnect.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
const staticRoutes: MetadataRoute.Sitemap = [
{
url: `${baseUrl}/`,
lastModified: new Date(),
changeFrequency: "daily",
priority: 1.0,
},
{
url: `${baseUrl}/privacy-policy`,
lastModified: new Date(),
changeFrequency: "monthly",
priority: 0.3,
},
{
url: `${baseUrl}/terms-of-use`,
lastModified: new Date(),
changeFrequency: "monthly",
priority: 0.3,
},
{
url: `${baseUrl}/list-your-business`,
lastModified: new Date(),
changeFrequency: "weekly",
priority: 0.6,
},
];

// Use public anon credentials for read-only sitemap generation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnon) {
return staticRoutes;
}

const supabase = createClient(supabaseUrl, supabaseAnon);

// If your listing detail route becomes /listing/[id], these URLs will be indexed.
const { data, error } = await supabase
.from("business_listings")
.select("id,last_verified_at")
.order("id", { ascending: false })
.limit(5000);

if (error || !data) {
return staticRoutes;
}

const listingRoutes: MetadataRoute.Sitemap = data.map((row) => ({
url: `${baseUrl}/listing/${row.id}`,
lastModified: row.last_verified_at ? new Date(row.last_verified_at) : new Date(),
changeFrequency: "weekly",
priority: 0.7,
}));

return [...staticRoutes, ...listingRoutes];
}