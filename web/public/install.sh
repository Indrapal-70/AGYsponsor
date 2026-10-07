#!/usr/bin/env bash
set -e

BASE_URL="${AGENTSPONSOR_SITE_URL:-https://ag-ysponsor.vercel.app}"
API_URL="${AGENTSPONSOR_API_URL:-https://agentsponsor-api-production.up.railway.app}"
DEST_DIR="$HOME/.gemini/config/plugins/agentsponsor"
CONFIG_DIR="$HOME/.agentsponsor"
SETTINGS_FILE="$HOME/.gemini/antigravity-cli/settings.json"

echo "============================================================"
echo "Installing AgentSponsor Plugin..."
echo "============================================================"

# Check requirements
if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js is required to run the AgentSponsor status line."
    echo "Please install Node.js 18+ and try again."
    exit 1
fi

mkdir -p "$CONFIG_DIR"
CONFIG_FILE="$CONFIG_DIR/config.json"
if [ ! -f "$CONFIG_FILE" ]; then
    INSTALL_ID=$(node -e "console.log(require('crypto').randomUUID())" 2>/dev/null || cat /proc/sys/kernel/random/uuid 2>/dev/null || echo "inst_$(date +%s)_$RANDOM")
    echo "{\"installation_id\": \"$INSTALL_ID\", \"api_url\": \"$API_URL\", \"enabled\": true}" > "$CONFIG_FILE"
else
    INSTALL_ID=$(node -e "try{console.log(JSON.parse(require('fs').readFileSync('$CONFIG_FILE','utf8')).installation_id || '')}catch(e){}" 2>/dev/null)
fi

TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

mkdir -p "$DEST_DIR/scripts"
STATUSLINE_SCRIPT="$DEST_DIR/scripts/agentsponsor-statusline.js"

echo "Downloading statusline plugin..."
if curl -fsSL "$BASE_URL/agentsponsor-statusline.js" -o "$STATUSLINE_SCRIPT" 2>/dev/null; then
    echo "✓ Downloaded plugin from $BASE_URL"
else
    ARCHIVE_URL="$BASE_URL/releases/agentsponsor-plugin-v1.0.0.tar.gz"
    if curl -fsSL "$ARCHIVE_URL" -o "$TMP_DIR/plugin.tar.gz" 2>/dev/null; then
        tar -xzf "$TMP_DIR/plugin.tar.gz" -C "$DEST_DIR"
    fi
fi

# Configure Antigravity custom statusLine
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
fi

PAIRING_CODE="$INSTALL_ID"
CONNECT_URL="$BASE_URL/connect?code=$PAIRING_CODE"

echo ""
echo "============================================================"
echo "✓ AgentSponsor successfully installed!"
echo ""
echo "Connect this installation to your account to start earning:"
echo "👉 $CONNECT_URL"
echo "============================================================"
echo ""
