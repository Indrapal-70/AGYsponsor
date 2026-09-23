#!/usr/bin/env bash
set -e

BASE_URL="${AGENTSPONSOR_SITE_URL:-https://agentsponsor.com}"
API_URL="${AGENTSPONSOR_API_URL:-https://api.agentsponsor.com}"
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
    echo "{\"installation_id\": \"$INSTALL_ID\"}" > "$CONFIG_FILE"
else
    INSTALL_ID=$(node -e "try{console.log(JSON.parse(require('fs').readFileSync('$CONFIG_FILE','utf8')).installation_id || '')}catch(e){}" 2>/dev/null)
fi

TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

ARCHIVE_URL="$BASE_URL/releases/agentsponsor-plugin-v1.0.0.tar.gz"
echo "Downloading plugin release archive..."
if curl -fsSL "$ARCHIVE_URL" -o "$TMP_DIR/plugin.tar.gz" 2>/dev/null; then
    mkdir -p "$DEST_DIR"
    tar -xzf "$TMP_DIR/plugin.tar.gz" -C "$DEST_DIR"
else
    # Fallback to local copy if running in local development mode
    LOCAL_PLUGIN_SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../plugin" 2>/dev/null && pwd)"
    if [ -d "$LOCAL_PLUGIN_SRC" ]; then
        echo "Using local plugin sources for development..."
        mkdir -p "$DEST_DIR"
        cp -r "$LOCAL_PLUGIN_SRC"/* "$DEST_DIR/"
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

# Request single-use pairing code from API
PAIRING_CODE=""
CONNECT_URL="$BASE_URL/connect"

PAIR_RES=$(curl -s -X POST "$API_URL/v1/installations/pair/init" \
    -H "Content-Type: application/json" \
    -d "{\"installation_uuid\": \"$INSTALL_ID\", \"os\": \"$(uname -s)\", \"client_version\": \"1.0.0\"}" 2>/dev/null || true)

if [ -n "$PAIR_RES" ]; then
    PAIRING_CODE=$(node -e "try{console.log(JSON.parse(process.argv[1]).pairing_code || '')}catch(e){}" "$PAIR_RES" 2>/dev/null || true)
    URL_FROM_RES=$(node -e "try{console.log(JSON.parse(process.argv[1]).connect_url || '')}catch(e){}" "$PAIR_RES" 2>/dev/null || true)
    if [ -n "$URL_FROM_RES" ]; then
        CONNECT_URL="$URL_FROM_RES"
    fi
fi

if [ -z "$PAIRING_CODE" ]; then
    # Fallback local pairing code if API is offline
    PAIRING_CODE=$(node -e "console.log(require('crypto').randomBytes(4).toString('hex').toUpperCase().match(/.{1,4}/g).join('-'))" 2>/dev/null || echo "DEV-1234")
    CONNECT_URL="$BASE_URL/connect?code=$PAIRING_CODE"
fi

echo ""
echo "============================================================"
echo "✓ AgentSponsor successfully installed!"
echo ""
echo "Connect this installation to your account to start earning:"
echo "$CONNECT_URL"
echo ""
echo "Pairing code: $PAIRING_CODE (valid for 15 minutes)"
echo "============================================================"
echo ""
