# AgentSponsor Architecture

## Overview
AgentSponsor is an ecosystem connecting developers, advertisers, and end-users, facilitating non-intrusive sponsorships within developer tools.

## Architecture Components
- **Client Plugin**: A lightweight, non-blocking extension for Antigravity CLI.
- **Backend API**: A FastAPI service handling telemetry, campaigns, and impressions.
- **Database**: PostgreSQL (Supabase) for relational data storage and strict RLS policies.
- **Frontend Dashboard**: A Next.js/React portal for developers and advertisers.

## Security Boundaries
- Client plugins only report anonymized telemetry, never sensitive code or prompts.
- Database access is protected by Supabase Row Level Security (RLS) policies.
- Authentication happens via secure tokens; API keys are rotated securely.

## Non-Blocking Requirements
- The AgentSponsor plugin runs asynchronously. Network delays or API outages will never block the host CLI execution.
- Impressions are pre-fetched and cached locally.
