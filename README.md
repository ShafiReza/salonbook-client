# SalonBook Client

Next.js (App Router) front end for **SalonBook**, a salon appointment booking platform.

## Features
- Premium responsive UI (rose, blush and charcoal palette), loading skeletons, empty/error states, 404 and unauthorized pages, toasts
- Home page with live featured services, categories, benefits, how-it-works and promo sections
- Browse services with search, category filter, price sort and pagination (URL-driven)
- Protected service details with booking form (date, live slot availability, message)
- Better Auth: email/password and Google, navbar updates instantly on login/logout
- Customer dashboard: stats, appointments (details, cancel pending, Pay Now), profile
- Admin dashboard: stats, service CRUD with image upload, appointments, customers (block/unblock), transactions
- Stripe Checkout redirect with success/cancel pages (payment status comes only from the webhook)
- Route protection in Next middleware, route guards and on the API

## Tech stack
Next.js 15, React 19, TypeScript, Tailwind CSS 4, Better Auth client (jwt plugin), React Hook Form, Zod, Lucide, Sonner.

## Architecture
```
app/          routes: (public), (auth), dashboard, admin, payment pages
components/   ui, layout, services, dashboard, auth
contexts/     AuthContext
hooks/        useAsync, useDebounce
services/     api.ts (fetch + JWT), endpoints.ts, server.ts
lib/ types/ utils/ public/
```
Better Auth requests go to `<site>/api/auth/*` and are **rewritten** to the Express server (`next.config.mjs`), keeping the session cookie first-party. API calls go straight to `NEXT_PUBLIC_API_URL` with a Better Auth JWT as Bearer token.

## Installation & local development
```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```
Run `salonbook-server` first (default `http://localhost:5000`).

## Environment variables
`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_BETTER_AUTH_URL` (this site's origin), `NEXT_PUBLIC_SITE_URL`.

## Deployment (Vercel)
Set the three variables above (API URL = deployed server URL, the other two = your Vercel URL), redeploy, and add `https://<vercel-domain>/api/auth/callback/google` to Google OAuth. Set the server's `CLIENT_URL` to the Vercel URL.

## Links
- Live website: _add after deployment_
- Client repository: _add after creating the repo_
- Server repository: _add after creating the repo_

## Screenshots
_Add screenshots (home, browse, details, dashboards) here._
