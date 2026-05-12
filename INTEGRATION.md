Integration runbook

Overview

This document lists steps to run backend+frontend integration locally or against an external Postgres (e.g., Supabase). It also explains smoke-test usage.

Prerequisites

- Node >= 18 installed
- PostgreSQL accessible (locally or via Supabase). Set `DATABASE_URL` in `b/.env` to the connection string.
- From repo root: `b/` is backend, `f/` is frontend.

Backend (b/)

1. Generate Prisma client

```powershell
cd b
npx prisma generate --schema prisma/schema.prisma
```

2. Apply migrations (requires reachable DB)

```powershell
npx prisma migrate deploy --schema prisma/schema.prisma
```

3. Seed (requires reachable DB)

```powershell
npm run seed
```

4. Build and start

```powershell
npm run build
npm run start
```

Frontend (f/)

1. Ensure `f/.env` has `VITE_BASE_URL` pointing at your backend API, e.g.:

```
VITE_BASE_URL=http://localhost:3000/api
```

2. Start dev server

```powershell
cd f
npm run dev
```

Smoke tests

A prepared smoke-test script exists at `b/scripts/smoke-tests.js`. It uses the Node global `fetch` and will attempt the following (in order):

- GET `/` (health)
- GET `/api/auth/get-role-wise-test-account-credentials-and-token` (creates test users and returns tokens)
- GET `/api/drugs`
- GET `/api/purchases`
- GET `/api/sales`
- GET `/api/dashboard/stats`

Run it after backend is up:

```powershell
# from repo root
node b/scripts/smoke-tests.js
```

Notes

- Many endpoints require seeded data; run the seed step before running create/update flows.
- If you prefer Postman/Newman, import the API routes and sequence above as requests.
- If using Supabase, paste the provided Postgres connection string into `b/.env` as `DATABASE_URL` and follow steps above.
