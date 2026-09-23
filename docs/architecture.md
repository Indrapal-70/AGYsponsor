# AgentSponsor Architecture

## System Overview

AgentSponsor enables developers to monetize AI agent working time through a dual-channel integration with Google Antigravity CLI:

1. **Native Status Line Channel (`statusLine`)**: Renders unobtrusive, compact sponsor creatives stacked directly below Antigravity's built-in tips/status line during active agent processing (`thinking`, `working`, `tool_use`).
2. **Lifecycle Telemetry Channel (`hooks.json`)**: Runs background hooks to track sessions, measure exposure windows, and record revenue-eligible impressions with strict idempotency and deduplication.

```
┌─────────────────────────────────────────────────────────────┐
│                       Antigravity CLI                       │
│                                                             │
│  [Row 1: Built-in Antigravity Status & Tips Line]           │
│  [Row 2: Sponsored · CloudForge Demo — Deploy AI backend →] │
│                                                             │
│         ▲                                   ▲               │
│         │ statusLine API                    │ hooks.json    │
│         │ (stdin: agent_state)              │ (telemetry)   │
│         │                                   │               │
│  agentsponsor-statusline.js            statusline.js        │
│  - Active state ──► Render ad          - session_start      │
│  - Idle state   ──► Empty (hide)       - session_end        │
│  - Truncates to terminal width         - impression event   │
└─────────┬───────────────────────────────────┬───────────────┘
          │                                   │
          │ Campaign Fetch                    │ Telemetry Post
          ▼                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    AgentSponsor Backend                     │
│                       (FastAPI :8000)                       │
│                                                             │
│  - GET  /              ──► Service status & links           │
│  - GET  /health        ──► System health monitor            │
│  - GET  /docs          ──► OpenAPI Swagger UI               │
│  - GET  /v1/campaign   ──► Active campaign data             │
│  - POST /v1/events     ──► Idempotent session & impressions │
│                                                             │
│               In-Memory / PostgreSQL Storage                │
│    [Campaigns]   [Sessions]   [Impressions]   [Earnings]    │
└─────────────────────────────────────────────────────────────┘
```

## Security & Privacy Architecture

- **Zero Content Access**: The status line script and lifecycle hooks only receive system metadata (`agent_state`, `conversationId`, `terminal_columns`). They never read or transmit prompts, source files, terminal outputs, or user commands.
- **Fail-Open Policy**: Network timeouts (1.0s) and malformed responses immediately fall back to silent exit. The host agent is never blocked.
- **URL Sanitation**: Advertiser links are validated to ensure only `http://` and `https://` schemes are permitted.
