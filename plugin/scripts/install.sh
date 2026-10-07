#!/usr/bin/env bash
set -e

BASE_URL="${AGENTSPONSOR_SITE_URL:-https://ag-ysponsor.vercel.app}"
API_URL="${AGENTSPONSOR_API_URL:-https://agentsponsor-api-production.up.railway.app}"
PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST_DIR="$HOME/.gemini/config/plugins/agentsponsor"
CONFIG_DIR="$HOME/.agentsponsor"
SETTINGS_FILE="$HOME/.gemini/antigravity-cli/settings.json"

echo "============================================================"
echo "AgentSponsor CLI Plugin Installer (Antigravity Native)"
echo "============================================================"

# Check requirements
if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js is required to run the AgentSponsor status line."
    echo "Please install Node.js 18+ and try again."
    exit 1
fi

# 1. Initialize Machine Config
mkdir -p "$CONFIG_DIR"
CONFIG_FILE="$CONFIG_DIR/config.json"
if [ ! -f "$CONFIG_FILE" ]; then
    INSTALL_ID=$(node -e "console.log(require('crypto').randomUUID())" 2>/dev/null || cat /proc/sys/kernel/random/uuid 2>/dev/null || echo "inst_$(date +%s)_$RANDOM")
    echo "{\"installation_id\": \"$INSTALL_ID\", \"api_url\": \"$API_URL\", \"enabled\": true}" > "$CONFIG_FILE"
else
    INSTALL_ID=$(node -e "try{console.log(JSON.parse(require('fs').readFileSync('$CONFIG_FILE','utf8')).installation_id || '')}catch(e){}" 2>/dev/null)
fi

# 2. Install Plugin to ~/.gemini/config/plugins/agentsponsor
mkdir -p "$DEST_DIR"
rm -rf "$DEST_DIR"/*
cp -r "$PLUGIN_DIR"/* "$DEST_DIR/"
echo "✓ Plugin installed to: $DEST_DIR"

# 3. Configure Antigravity CLI statusLine
if [ -f "$SETTINGS_FILE" ]; then
    python3 -c "
import json
path = '$SETTINGS_FILE'
try:
    with open(path, 'r') as f:
        data = json.load(f)
except Exception:
    data = {}
data['statusLine'] = {
    'type': 'command',
    'command': 'node ~/.gemini/config/plugins/agentsponsor/scripts/agentsponsor-statusline.js',
    'stack_with_default': True
}
with open(path, 'w') as f:
    json.dump(data, f, indent=2)
" 2>/dev/null || true
    echo "✓ Configured statusLine in: $SETTINGS_FILE"
fi

# 4. Print Pairing Information
echo ""
echo "--------------------------------------------------------"
echo "  INSTALLATION UUID: $INSTALL_ID"
echo "--------------------------------------------------------"
echo "To link this machine to your personal earnings ledger:"
echo "  1. Sign in at: $BASE_URL/login"
echo "  2. Direct link: $BASE_URL/connect?code=$INSTALL_ID"
echo "========================================================"
echo ""
