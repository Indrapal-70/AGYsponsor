# Antigravity Compatibility & Custom Status Line Integration

This document details the exact integration architecture between AgentSponsor and Google Antigravity CLI (1.2.7+).

---

## 1. Custom Status Line API Integration

Antigravity CLI provides native support for custom terminal status lines via the `statusLine` configuration block in `~/.gemini/antigravity-cli/settings.json`.

### Supported Configuration Schema

```json
{
  "statusLine": {
    "type": "command",
    "command": "node ~/.gemini/config/plugins/agentsponsor/scripts/agentsponsor-statusline.js",
    "stack_with_default": true
  }
}
```

### Key Properties

- **`stack_with_default: true`**: Renders both the default Antigravity status line (with native tips, model information, and working spinner) and the custom status line vertically stacked.
  ```text
  Row 1: [Default Antigravity Status / Native Tips Line]
  Row 2: Sponsored · CloudForge Demo — Deploy your AI backend in seconds →
  ```
- **State-Driven Display**: Antigravity executes the status line command and pipes a JSON payload to `stdin` containing:
  ```json
  {
    "agent_state": "working",
    "conversation_id": "...",
    "terminal_columns": 80
  }
  ```
- **Supported Lifecycle States**:
  - `thinking`: Model reasoning actively in progress ──► Sponsor displayed.
  - `working`: Planning or file editing in progress ──► Sponsor displayed.
  - `tool_use`: Tool invocation in progress ──► Sponsor displayed.
  - `idle`: Agent completed turn and waiting for user input ──► Empty stdout (line hidden).
  - `initializing`: CLI booting or workspace loading ──► Empty stdout (line hidden).

---

## 2. Removal of In-Stream `ephemeralMessage` Injection

In earlier iterations, `PreInvocation` used `injectSteps` with `ephemeralMessage` to render sponsor text into the chat stream. While functional, this polluted prompt history and did not deliver the intended footer status experience.

Under the current architecture:
- `PreInvocation` and all lifecycle hooks in `hooks.json` return `{}` or `{"decision": "allow"}`.
- Visual rendering is 100% delegated to the Antigravity `statusLine` API.
- The conversation stream and transcripts remain completely clean.

---

## 3. Background Lifecycle Telemetry via `hooks.json`

The 5 lifecycle hooks defined in `plugin/hooks.json` continue to manage session tracking and impression attribution without visual rendering:

| Hook Name | Lifecycle Event | Matcher | Purpose | Output |
|---|---|---|---|---|
| `agentsponsor-pre-invocation` | `PreInvocation` | N/A | Session start & deduplicated impression telemetry | `{}` |
| `agentsponsor-post-invocation` | `PostInvocation` | N/A | Turn completion telemetry | `{}` |
| `agentsponsor-pre-tool-use` | `PreToolUse` | `*` | Fail-open safety gate (always permits tools) | `{"decision": "allow"}` |
| `agentsponsor-post-tool-use` | `PostToolUse` | `*` | Post-tool telemetry | `{}` |
| `agentsponsor-stop` | `Stop` | N/A | Session ended telemetry | `{}` |

---

## 4. Fail-Open & Resilience Guarantees

- **Ad Server Outage**: If the backend API (`:8000`) is offline, the status line script times out in 1000ms, outputs nothing, and exits with code 0.
- **Agent Unaffected**: The agent execution, tools, and user interaction continue uninterrupted.
- **Graceful Truncation**: On narrow terminals (columns < 40), the script truncates gracefully with `…` to avoid terminal line wrapping.
- **Zero Privacy Leakage**: No prompts, source code, terminal commands, or model thinking outputs are ever read, stored, or transmitted.
