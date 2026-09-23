# AgentSponsor Production Deployment Guide

This guide details the complete deployment process for the AgentSponsor production architecture, covering the Supabase database, Vercel frontend/API deployment, domain routing, and release packaging.

---

## 1. Architecture Overview

```
                      +-----------------------------+
                      |   Private GitHub Repo       |
                      |   (Owner / Operator Only)   |
                      +--------------+--------------+
                                     |
                       CI / Release Packaging
                                     |
                                     v
+------------------------+      +-------------------------------+
|     Vercel Edge        |      |    Supabase Managed Cloud     |
| https://agentsponsor.com|      |   (PostgreSQL + RLS + Auth)   |
+------------------------+      +-------------------------------+
  - Static Web App (Next.js)      - queries.txt Schema
  - Edge / Server API Routes      - Immutable earnings_ledger
  - Public /install.sh & .ps1     - Atomic triggers & balances
  - Public Release Archives       - Row-Level Security (RLS)
            ^
            |  Status line fetch & signed exposures
+-----------+--------------------+
| Antigravity CLI Plugin (Client)|
|   ~/.gemini/config/plugins/    |
+--------------------------------+
```

---

## 2. Supabase Setup (Database & Auth)

1. **Create Supabase Project**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard) and create a new project (e.g. `agentsponsor-prod`).
   - Select region close to your primary developer base (e.g. `ap-south-1` Mumbai or `ap-southeast-1` Singapore).

2. **Execute Schema via `queries.txt`**:
   - Open the **SQL Editor** tab in Supabase.
   - Copy the full content of [`queries.txt`](file:///home/inder/agysponsor/queries.txt) from the repository root.
   - Paste and execute. All extensions, enums, tables, indexes, triggers, stored procedures, RLS policies, views, and seed plans are created in a single run.

3. **Retrieve Credentials**:
   - Navigate to **Project Settings** -> **API**:
     - `Project URL`: Set as `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_URL`.
     - `anon public key`: Set as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
     - `service_role secret`: Set as `SUPABASE_SERVICE_ROLE_KEY`.

---

## 3. Vercel Deployment (Frontend & API)

1. **Connect Private Repository**:
   - In Vercel, click **Add New Project** and import the private repository `~/agysponsor`.
   - Set **Root Directory** to `web`.
   - Build Command: `npm run build`
   - Output Directory: `.next`

2. **Environment Variables on Vercel**:
   Configure the following in **Project Settings -> Environment Variables**:

   ```ini
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   EXPOSURE_TOKEN_SECRET=your-64-character-hex-secret
   AGENTSPONSOR_API_URL=https://agentsponsor.com
   AGENTSPONSOR_SITE_URL=https://agentsponsor.com
   PAYMENT_PROVIDER=RAZORPAY
   PAYMENT_PUBLIC_KEY=rzp_live_your_key_id
   PAYMENT_SECRET_KEY=your_razorpay_secret_key
   PAYMENT_WEBHOOK_SECRET=your_razorpay_webhook_secret
   PAYOUT_PROVIDER=MOCK
   ADMIN_SECRET=your-strong-admin-passphrase
   ```

3. **Custom Domain**:
   - In Vercel Domains, attach `agentsponsor.com` (and `www.agentsponsor.com`).
   - Add CNAME records pointing to `cname.vercel-dns.com`.

---

## 4. Release Packaging & Public Installer

The public installer downloads release bundles directly from the deployed website CDN without requiring consumers to access GitHub:

```bash
# Package a new plugin release and update web/public/
./scripts/package-release.sh

# Commit the release artifacts
git add web/public/
git commit -m "chore(release): package plugin v1.0.0"
git push origin main
```

Once pushed, Vercel will automatically host:
- `https://agentsponsor.com/install.sh`
- `https://agentsponsor.com/install.ps1`
- `https://agentsponsor.com/releases/agentsponsor-plugin-v1.0.0.tar.gz`
- `https://agentsponsor.com/releases/latest.json`
