# Changelog

All notable changes to the AgentSponsor project will be documented in this file.

## [1.0.0] - 2026-09-24

### Added
- **Production Supabase Database**: Complete relational PostgreSQL schema in `queries.txt` covering profiles, user roles, installations, pairing codes, sponsor organizations, plans, campaigns, creatives, budgets, immutable earnings ledger, atomic balances, and payout accounts with full RLS.
- **Standalone Public Distribution**: Release packaging script (`scripts/package-release.sh`) creating standalone archives (`agentsponsor-plugin-v1.0.0.tar.gz` / `.zip`) and public installers (`web/public/install.sh`, `web/public/install.ps1`) for frictionless zero-repo distribution.
- **Terminal Pairing Flow**: 8-character single-use pairing codes (`XXXX-XXXX`) generated during installation and linked via `/connect`.
- **Payment & Payout Abstraction**: Built modular provider interfaces in `web/src/lib/payments/` and `web/src/lib/payouts/` supporting India-specific payment rails (Razorpay, UPI VPAs, Indian Bank Accounts with IFSC).
- **Cryptographic Exposure Qualification**: Server-issued signed HMAC exposure tokens, minimum 5s dwell enforcement, deduplication, and atomic campaign budget deductions.
- **Full Web Platform**: Built modern Next.js 14 web application featuring:
  - Public pages: `/`, `/for-users`, `/for-sponsors`, `/how-it-works`, `/pricing`, `/download`, `/security`
  - Terminal Pairing: `/connect`
  - Consumer Dashboard: `/dashboard` (balances, ledger, installations, UPI withdrawals)
  - Sponsor Portal: `/sponsor` (campaign creation, budget top-ups, live terminal preview)
  - Owner Admin Portal: `/admin` (campaign moderation, payout approvals, fraud telemetry, platform economics)
- **End-to-End Integration Suite**: Automated end-to-end integration test (`tests/test_e2e_production.js`) verifying pairing, rotation, token HMAC verification, dwell qualification, deduplication, and webhook processing.

### Changed
- Preserved legacy development backend in `backend/legacy-local/` as reference.
- Enhanced `plugin/scripts/agentsponsor-statusline.js` and `utilities.js` with non-blocking socket handling and multi-ad rotation support.

## [0.2.0] - 2026-09-19

### Changed
- **Migrated Rendering to Antigravity Custom Status Line**: Replaced in-stream `injectSteps` / `ephemeralMessage` rendering with Antigravity's native `statusLine` API using `stack_with_default: true`.
- **Clean Conversation History**: `PreInvocation` and all lifecycle hooks now return clean `{}` responses, keeping the conversation stream, markdown artifacts, and prompt histories completely free of ads.
- **Dedicated Status Line Handler**: Added `plugin/scripts/agentsponsor-statusline.js` to process `agent_state` from `stdin`, showing the sponsor during active states (`thinking`, `working`, `tool_use`) and disappearing when `idle`.
- **Dynamic Terminal Width Protection**: Implemented column width detection and graceful ellipsis truncation to avoid terminal overflow or broken wrapping.
- **Short-Lived Caching**: Reduced default campaign cache duration to 60s for status-line freshness while preventing high-frequency HTTP requests.
- **Automated Installation Configuration**: Updated `install.sh` and `install.ps1` to automatically configure `statusLine` in Antigravity's `settings.json`.

## [0.1.1] - 2026-09-19

### Fixed
- **Hook Command Resolution**: Resolved broken `/scripts/statusline.js` path by removing unexpanded shell variables (`${extensionPath}` / `${PLUGIN_DIR}`) and adopting the supported Antigravity cwd mechanism (`node scripts/statusline.js <HookType>`).
- **Hook JSON Syntax**: Repaired malformed quote escaping in `plugin/hooks.json` that prevented Antigravity from parsing hooks.
- **Campaign Property Mismatch**: Corrected `statusline.js` referencing `campaign.id` instead of `campaign.campaign_id || campaign.id`.
- **PreToolUse Contract**: Configured `PreToolUse` hook to explicitly return `{"decision": "allow"}` ensuring hooks fail open and never block tools.
- **Impression Flooding**: Added client-side and server-side impression deduplication per session/conversation and campaign so multiple model turns within the same task do not generate duplicate impressions.
- **Backend Test Failure**: Updated `test_health.py` to match the structured response schema returned by `/health`.

### Added
- **Root API Endpoint**: Added `GET /` to FastAPI backend returning service metadata, status, docs, and health URLs.
- **Consolidated Events Endpoint**: Added `POST /v1/events` endpoint in backend handling `session_started`, `session_ended`, and `eligible_impression` with idempotency.
- **Plugin Test Suite**: Added automated tests in `plugin/tests/plugin.test.js` covering URL validation, message formatting, hook dispatching, statusLine states, and impression deduplication.

## [0.1.0] - 2026-09-19

- Initial repository structure and MVP implementation.
