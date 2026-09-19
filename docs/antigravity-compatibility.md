# Antigravity Compatibility Report

This document records actual environment findings and architectural capabilities of the installed Antigravity CLI and official customization specifications.

## Environment & Specification Findings

- **Antigravity CLI Version**: Antigravity 2.0 (Snap Build 21)
- **Plugin Support**: Verified. Plugins are packaged shareable bundles placed in `.agents/plugins/<name>/` or `~/.gemini/config/plugins/` containing `plugin.json`, `hooks.json`, `rules/`, `skills/`, and `mcp_config.json`.
- **Plugin Installation Command**: `agy plugin enable <plugin-name>` / `agy plugin disable <plugin-name>` (persisted in user `config.json`).
- **Status-line Support**: Verified via lifecycle hooks (`hooks.json`) and TUI output channels.
- **Status-line Input**: Structured JSON payload delivered via `stdin` to configured hook handlers.
- **Available Agent State Information**:
  - `conversationId` (string)
  - `workspacePaths` (array of directory strings)
  - `transcriptPath` (string path to transcript log)
  - `artifactDirectoryPath` (string path to artifacts)
  - `modelName` (string model identifier)
  - `stepIdx` / `invocationNum` / `executionNum` (integers)
  - `toolCall` (`name` and `args` for `PreToolUse` / `PostToolUse`)
  - `terminationReason` (`model_stop`, `max_steps_exceeded`, `error` for `Stop`)
  - `fullyIdle` (boolean flag)
- **Hooks Available**:
  - `PreToolUse`
  - `PostToolUse`
  - `PreInvocation`
  - `PostInvocation`
  - `Stop`
- **Tips UI Officially Extensible**: **Unverified / Not Supported Natively**.
  - Current Antigravity CLI specifications do NOT expose an official public extension API to inject custom rows into the native terminal Tips UI component (`Existing Tips ↓ Sponsored message`).
- **Limitations**:
  - Native Tips UI placement (`Existing Tips → Sponsored message`) is not officially extensible via `plugin.json` or `hooks.json`.
  - Hook commands are run via subprocess stdin/stdout JSON protocol and must execute fast (default timeout: 30s) to avoid delaying the agent loop.

## Native Tips Extensibility Determination

**Status**: NOT officially supported.

**Detailed Finding**:
The desired user experience of directly appending a sponsored message into the native Antigravity terminal "Tips" UI container is not supported by any official extension or plugin schema in Antigravity. The native Tips container is rendered internally by the Antigravity TUI renderer.

**Alternative Supported UX Options**:
1. Delivering unobtrusive status notifications or injected system context via `PreInvocation` / `PostInvocation` hooks (`ephemeralMessage` / transient notification).
2. Presenting sponsorship content in a dedicated sidecar or web dashboard panel.
3. Rendering sponsorship banners via CLI status line or custom hook outputs.
