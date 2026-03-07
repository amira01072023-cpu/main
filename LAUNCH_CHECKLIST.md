# LAUNCH_CHECKLIST.md — UAE Biz Connect Production Checklist

## 1) Core Site
- [ ] Homepage loads and search works
- [ ] Filters (category/city) load from DB
- [ ] Pagination works
- [ ] Listing cards open detail pages

## 2) Listing Detail
- [ ] `/listing/[id]` loads valid data
- [ ] Website/phone/email actions work
- [ ] "Claim / Update this Listing" opens `/claim/[listingId]`
- [ ] Related listings section renders (if available)
- [ ] JSON-LD scripts present in page source

## 3) Submission & Claims
- [ ] `/auth` sign up/sign in works
- [ ] `/list-your-business` requires login
- [ ] All required fields enforced
- [ ] Submission saved with status `pending`
- [ ] `/claim/[listingId]` requires login
- [ ] Claim form submits with filled fields

## 4) Admin
- [ ] `/admin/submissions` accessible only to admin email
- [ ] Approve inserts into `business_listings`
- [ ] Reject requires reason and saves `review_note`
- [ ] `/admin/claims` accessible only to admin email
- [ ] Approve/reject claims updates status correctly

## 5) API Endpoints
- [ ] `/api/listings` returns JSON
- [ ] `/api/listings/filters` returns JSON
- [ ] `/api/listings/popular-categories` returns JSON
- [ ] `/api/business-submissions` accepts valid payload
- [ ] `/api/claims` accepts valid payload
- [ ] `/api/admin/submissions` admin protected
- [ ] `/api/admin/claims` admin protected

## 6) SEO
- [ ] `/sitemap.xml` loads
- [ ] `/robots.txt` loads
- [ ] Google verification file accessible
- [ ] Search Console property verified
- [ ] Sitemap submitted to Search Console

## 7) Security & Hygiene
- [ ] `.env.local` exists locally and is NOT committed
- [ ] `.gitignore` includes local secrets/logs/backups
- [ ] No debug placeholders/routes left
- [ ] Admin email restriction active

## 8) Deployment
- [ ] `git add . && git commit` clean
- [ ] `git push origin main`
- [ ] Vercel deployment status = Ready
- [ ] Live smoke test passed:
- [ ] `/`
- [ ] `/listing/1`
- [ ] `/auth`
- [ ] `/admin/submissions` (admin)
- [ ] `/admin/claims` (admin)
- [ ] `/sitemap.xml`

## 9) Post-Launch Monitoring (first 72h)
- [ ] Check Vercel logs for runtime errors
- [ ] Check Supabase logs for API errors
- [ ] Check Search Console coverage
- [ ] Verify new submissions/claims processing

