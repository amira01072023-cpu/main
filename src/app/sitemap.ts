import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const baseUrl = "https://uaebizconnect.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
const staticRoutes: MetadataRoute.Sitemap = [
{ url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
{ url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
{ url: `${baseUrl}/terms-of-use`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
{ url: `${baseUrl}/accessibility-statement`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
{ url: `${baseUrl}/data-rights-request`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
{ url: `${baseUrl}/eu-compliance`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
{ url: `${baseUrl}/report-illegal-content`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
{ url: `${baseUrl}/vendors`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
{ url: `${baseUrl}/list-your-business`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },

// City pages
{ url: `${baseUrl}/city/dubai`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
{ url: `${baseUrl}/city/abu-dhabi`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
{ url: `${baseUrl}/city/sharjah`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
{ url: `${baseUrl}/city/ajman`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
{ url: `${baseUrl}/city/fujairah`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
{ url: `${baseUrl}/city/ras-al-khaimah`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
{ url: `${baseUrl}/city/umm-al-quwain`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },

// Category pages
{ url: `${baseUrl}/category/hvac`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
{ url: `${baseUrl}/category/building-maintenance`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
{ url: `${baseUrl}/category/electrical`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
{ url: `${baseUrl}/category/plumbing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
{ url: `${baseUrl}/category/general-services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
{ url: `${baseUrl}/category/directory`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnon) return staticRoutes;

const supabase = createClient(supabaseUrl, supabaseAnon);

const { data, error } = await supabase
.from("business_listings")
.select("id,last_verified_at")
.order("id", { ascending: false })
.limit(5000);

if (error || !data) return staticRoutes;

const listingRoutes: MetadataRoute.Sitemap = data.map((row) => ({
url: `${baseUrl}/listing/${row.id}`,
lastModified: row.last_verified_at ? new Date(row.last_verified_at) : new Date(),
changeFrequency: "weekly",
priority: 0.7,
}));

return [...staticRoutes, ...listingRoutes];
}