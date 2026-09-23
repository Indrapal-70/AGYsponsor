# AgentSponsor — Production MVP

> Non-intrusive monetization & sponsorship platform for Google Antigravity CLI agents.

AgentSponsor displays clearly labeled, verified sponsor lines in Antigravity's **custom status line** stacked underneath the built-in status/tips line while preserving host developer experience, codebase privacy, and terminal responsiveness.

---

## 1. Core Principles

- **Private Source Repository**: The core codebase remains private. Consumers and sponsors interact only via the web platform and the standalone installer.
- **Native Status Line UX**: Visual ads appear strictly in the secondary status line (`stack_with_default: true`), never polluting the conversation stream or injecting chat boxes.
- **Zero-Snoop Guarantee**: No prompts, source code files, model thinking traces, or conversation logs are ever read or transmitted.
- **Fail-Open Architecture**: If the backend is unreachable, the plugin exits in under 2ms with zero output, never interrupting the agent or failing tool calls.
- **Cryptographic Exposure Qualification**: Rewards are backed by server-issued HMAC tokens, dwell thresholds, and an immutable financial ledger.
- **India Payment Rails**: Direct support for Indian sponsor payments (UPI, Net Banking, Cards via Razorpay) and developer payouts (UPI / Bank Accounts).

---

## 2. Supported Platforms & Environments

- **Antigravity CLI**: `1.2.7` (and Antigravity 2.0)
- **Status Line Mechanism**: Custom `statusLine` command with `stack_with_default: true`
- **Supported Platforms**: Linux, macOS, WSL2 Ubuntu, Windows 11 (PowerShell 5.1+)
- **Runtime Dependencies**: Node.js 18+ (client plugin), Python 3.10+ (legacy backend), Next.js 14 (web platform)

---

## 3. Architecture & Data Flow

```text
┌─────────────────────────────────────────────────────────────┐
│                       Antigravity CLI                       │
│                                                             │
│   Row 1: [Normal Antigravity built-in status / Tips line]   │
│   Row 2: [Sponsored · CloudForge — Deploy AI backend in s →]│
│                                                             │
│   Active states: "working", "thinking", "tool_use" ──► Shown │
│   Idle states:   "idle", "initializing" ─────────────► Hidden│
└──────────────────────────────┬──────────────────────────────┘
                               │
               statusLine API  │  stdin { "agent_state": "working" }
                               ▼
            plugin/scripts/agentsponsor-statusline.js
                               │
            Campaign Cache (TTL: 60s) / GET /v1/campaign
                               │
        +──────────────────────┴──────────────────────+
        │             AgentSponsor Platform           │
        │      (Next.js 14 App Router + Supabase)     │
        +──────────────────────┬──────────────────────+
                               │
             ┌─────────────────┴─────────────────┐
             ▼                                   ▼
   Supabase PostgreSQL Engine             Web Portals
   - Immutable earnings_ledger            - Consumer (/dashboard)
   - Atomic sync_earnings_balances        - Terminal Pairing (/connect)
   - RLS security & role-based access     - Sponsor Portal (/sponsor)
   - Deduplication & HMAC tokens          - Owner/Admin Portal (/admin)
```

---

## 4. Consumer Installation Flow

Developers install the plugin with a single command without repository access:

### Linux / macOS / WSL2:
```bash
curl -sSL https://agentsponsor.com/install.sh | bash
```

### Windows (PowerShell):
```powershell
irm https://agentsponsor.com/install.ps1 | iex
```

### Terminal Pairing:
Upon installation, the terminal prints an 8-character single-use code:
```text
============================================================
✓ AgentSponsor successfully installed!

Connect this installation to your account to start earning:
https://agentsponsor.com/connect?code=8F4K-92JD

Pairing code: 8F4K-92JD (valid for 15 minutes)
============================================================
```
Developers visit `/connect` to pair their installation, track dwell sessions, and configure their UPI ID for withdrawals.

---

## 5. Database Schema & `queries.txt`

The complete Supabase production database schema is consolidated in a single, dependency-ordered file:
[`queries.txt`](file:///home/inder/agysponsor/queries.txt)

To configure your Supabase instance:
1. Open your [Supabase SQL Editor](https://supabase.com/dashboard).
2. Paste the entire content of [`queries.txt`](file:///home/inder/agysponsor/queries.txt).
3. Click **Run**.
4. See [`docs/database.md`](file:///home/inder/agysponsor/docs/database.md) for full ERD, trigger logic, and RLS documentation.

---

## 6. Automated Testing & Verification

Run the entire verification suite locally:

```bash
# 1. Plugin status-line unit tests:
node plugin/tests/plugin.test.js

# 2. Antigravity CLI plugin validation:
agy plugin validate ./plugin

# 3. Python backend test suite:
.venv/bin/pytest backend/tests

# 4. Next.js web application build:
npm run build --prefix web

# 5. Full End-to-End production integration test:
node tests/test_e2e_production.js
```

All 5 test suites pass cleanly with exit code 0.

---

## 7. Project Structure

```text
agysponsor/
├── queries.txt               # Mandatory Supabase production SQL schema
├── plugin/                   # Standalone Antigravity CLI Plugin
│   ├── hooks.json            # Background lifecycle telemetry hooks
│   ├── scripts/
│   │   ├── agentsponsor-statusline.js # Custom status-line renderer
│   │   ├── statusline.js     # Lifecycle hook dispatcher
│   │   ├── utilities.js      # Networking, HMAC, & caching helpers
│   │   └── install.sh        # Local development installer
│   └── tests/
│       └── plugin.test.js    # Plugin unit tests
├── web/                      # Production Next.js App Router Web Platform
│   ├── src/app/              # Public, Consumer, Sponsor, & Admin pages
│   │   ├── api/v1/           # Server API routes (campaign, exposures, pairing, webhooks)
│   │   ├── connect/          # Terminal pairing page
│   │   ├── download/         # Public install instructions
│   │   ├── dashboard/        # Consumer earnings ledger & UPI withdrawal
│   │   ├── sponsor/          # Sponsor campaign creation & funding
│   │   └── admin/            # Platform owner operations portal
│   ├── src/lib/              # Shared libraries (payments, payouts, HMAC, Supabase)
│   └── public/               # Public release archives, install.sh, install.ps1
├── backend/                  # FastAPI reference/development backend
│   └── legacy-local/         # Preserved development server
├── scripts/
│   └── package-release.sh    # Builds release tarballs and updates public installer
└── docs/                     # Production architecture documentation
    ├── architecture.md
    ├── database.md
    ├── deployment.md
    ├── payments.md
    ├── payouts.md
    └── fraud.md
```
