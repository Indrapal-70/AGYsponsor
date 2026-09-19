# Technical Report: Antigravity CLI Plugin Limitations

## Overview
During the development of AgentSponsor, we evaluated various extension points provided by the Antigravity CLI.

## Findings: Native Tips UI Non-Extensibility
The native "Tips" UI in Antigravity CLI is currently non-extensible for third-party plugins. It is hardcoded to display system-generated tips and cannot easily accept injected sponsorship content via standard hook mechanisms without modifying core Antigravity source code.

## Alternative Supported Presentation Methods
Given this limitation, AgentSponsor utilizes the following alternative presentation methods:
1. **Post-Execution Summary Hooks**: Displaying a compact sponsorship message at the end of successful command executions.
2. **Sidecar / Output Interception**: Intercepting `stdout` to safely append non-intrusive plain text sponsor messages.
3. **Custom Slash Commands**: Allowing users to explicitly interact with sponsor content (e.g., `/sponsor-offer`).

These methods comply with the non-blocking requirements and do not require unsafe patching of the Antigravity core.
