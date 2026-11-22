# Stephen K — Cinematic Portfolio

A React + TypeScript + Vite portfolio with a Supabase-backed owner panel for
uploading/replacing the profile photo, resume, and CV.

## Setup

```bash
npm install
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
npm run dev
```

Scripts: `npm run dev`, `npm run build`, `npm run preview`, `npm run typecheck`, `npm run lint`.

## Database

Apply `supabase/migrations/20260914042654_portfolio_files_system.sql` to your
Supabase project. It creates the `portfolio_files` table, a public
`portfolio-files` storage bucket, and read-only RLS policies.

## Owner authentication

The `portfolio-owner` Edge Function handles login, token verification, upload,
and delete. **It has no hardcoded credentials.** Configure these secrets before
deploying:

```bash
# 1. Generate a strong password hash (SHA-256 hex of the password):
node -e "const c=require('crypto');console.log(c.createHash('sha256').update('YOUR_PASSWORD').digest('hex'))"

# 2. Generate a 32-byte session secret:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 3. Set them as Supabase Edge Function secrets:
supabase secrets set OWNER_PASSWORD_HASH=<hash> SESSION_SECRET=<secret>
```

For local Edge Function development, put the same values (plus
`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`) in `supabase/functions/.env`,
which is gitignored. Deploy with:

```bash
supabase functions deploy portfolio-owner --no-verify-jwt
```

Security notes:

- `OWNER_PASSWORD_HASH` and `SESSION_SECRET` are required. The function fails
  closed if either is missing; there are no fallback values.
- Tokens are HMAC-SHA256 signed, include a nonce and a 4-hour expiry, and are
  compared in constant time.
- `/auth` allows at most 5 failed attempts per 15 minutes per client IP.
- Uploads are restricted by MIME type and size (8 MB photos, 10 MB documents).
- The old password and fallback secret that used to be committed in git history
  must be considered compromised. Rotate them and remove them from any
  deployment where they may still be configured.

## Deployment

Build with `npm run build` and serve the `dist/` directory. Before going live,
set a canonical URL in `index.html` once the final domain is known, and add a
matching `public/sitemap.xml` if search-engine indexing is a priority.
