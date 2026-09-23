# AgentSponsor Antigravity Plugin

AgentSponsor is an official Antigravity CLI (1.2.7+) plugin providing native status-line sponsorship display and background lifecycle telemetry.

---

## Directory Structure

```text
plugin/
├── plugin.json                    # Plugin manifest
├── hooks.json                     # Background lifecycle hooks (telemetry only)
├── config/
│   └── config.json                # Plugin API URL and cache settings
├── scripts/
│   ├── agentsponsor-statusline.js # Dedicated custom status line script (statusLine API)
│   ├── statusline.js              # Lifecycle hook dispatcher (telemetry & events)
│   ├── utilities.js               # Network, caching, URL safety, and session helpers
│   ├── install.sh                 # Linux/macOS automated installation script
│   ├── install.ps1                # Windows PowerShell automated installation script
│   └── uninstall.sh               # Cleanup script
└── tests/
    └── plugin.test.js             # Comprehensive unit test suite
```

---

## How Status Line Rendering Works

The plugin registers a custom status line handler in Antigravity's `settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "node ~/.gemini/config/plugins/agentsponsor/scripts/agentsponsor-statusline.js",
    "stack_with_default": true
  }
}
```

- **`stack_with_default: true`**: Preserves Antigravity's native built-in status and tips line on row 1, stacking the AgentSponsor one-liner on row 2 directly underneath.
- **Active State Detection**: Inspects incoming `agent_state` on stdin. Renders the sponsor only during `thinking`, `working`, and `tool_use`.
- **Idle State**: Outputs empty stdout when `agent_state` is `idle` or `initializing`, hiding the second line cleanly.
- **Terminal Width Safety**: Dynamically checks `terminal_columns` and safely truncates with `…` to avoid terminal overflow or line wrapping.
- **Conversation Stream Cleanliness**: `PreInvocation` and other hooks return `{}` without injecting `injectSteps` or `ephemeralMessage` into the chat history.

---

## Installation & Setup

```bash
# Automated install (copies files & configures settings.json):
bash plugin/scripts/install.sh

# Or manual installation via agy CLI:
agy plugin validate ./plugin
agy plugin install ./plugin
agy plugin enable agentsponsor
```

---

## Running Tests

```bash
node plugin/tests/plugin.test.js
```
