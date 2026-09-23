#!/bin/bash

AGY_PLUGIN_DIR="$HOME/.gemini/config/plugins/agentsponsor"
CONFIG_DIR="$HOME/.agentsponsor"
SETTINGS_FILE="$HOME/.gemini/antigravity-cli/settings.json"

echo "Uninstalling AgentSponsor plugin..."
if [ -e "$AGY_PLUGIN_DIR" ]; then
    rm -rf "$AGY_PLUGIN_DIR"
    echo "Removed $AGY_PLUGIN_DIR"
fi

if [ -e "$CONFIG_DIR" ]; then
    rm -rf "$CONFIG_DIR"
    echo "Removed $CONFIG_DIR"
fi

if [ -f "$SETTINGS_FILE" ]; then
    python3 -c "
import json
path = '$SETTINGS_FILE'
try:
    with open(path, 'r') as f:
        data = json.load(f)
    if 'statusLine' in data:
        del data['statusLine']
        with open(path, 'w') as f:
            json.dump(data, f, indent=2)
except Exception:
    pass
" || true
    echo "Cleaned statusLine from $SETTINGS_FILE"
fi

echo "Uninstallation complete."
