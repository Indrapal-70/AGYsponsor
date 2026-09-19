# AgentSponsor Plugin

AgentSponsor is an Antigravity plugin that fetches and displays sponsored messages in the agent's ephemeral status line. 

## Layout
- `plugin.json`: Plugin manifest.
- `hooks.json`: Lifecycle hook definitions.
- `scripts/`: Implementation scripts (`statusline.js`, `utilities.js`) and cross-platform installation scripts.
- `config/`: Default plugin configuration.

## Installation
Run the appropriate installation script for your OS:
- Linux / macOS: `bash scripts/install.sh`
- Windows: `powershell -ExecutionPolicy Bypass -File scripts\install.ps1`

## Configuration
The plugin generates a non-identifying installation UUID upon installation, saved in `~/.agentsponsor/config.json`.
Global plugin settings like API URL and Cache Duration can be modified in `config/config.json`.

## Uninstallation
Run `bash scripts/uninstall.sh` to remove symlinks/copies and configurations.
