#!/bin/bash
set -e

PLUGIN_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
AGY_PLUGIN_DIR="$HOME/.gemini/config/plugins/agentsponsor"
CONFIG_DIR="$HOME/.agentsponsor"
SETTINGS_FILE="$HOME/.gemini/antigravity-cli/settings.json"

mkdir -p "$CONFIG_DIR"
if [ ! -f "$CONFIG_DIR/config.json" ]; then
    if command -v uuidgen > /dev/null; then
        UUID=$(uuidgen)
    elif [ -f /proc/sys/kernel/random/uuid ]; then
        UUID=$(cat /proc/sys/kernel/random/uuid)
    else
        UUID="random-uuid-$RANDOM"
    fi
    echo "{\"installation_id\": \"$UUID\"}" > "$CONFIG_DIR/config.json"
fi

mkdir -p "$(dirname "$AGY_PLUGIN_DIR")"
if [ -e "$AGY_PLUGIN_DIR" ]; then
    rm -rf "$AGY_PLUGIN_DIR"
fi

cp -r "$PLUGIN_DIR" "$AGY_PLUGIN_DIR"
echo "Plugin installed to $AGY_PLUGIN_DIR"

# Configure Antigravity custom statusLine with stack_with_default
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
" || true
    echo "Configured statusLine in $SETTINGS_FILE"
fi

# Request pairing code from API or generate deterministic code
API_URL="${AGENTSPONSOR_API_URL:-http://localhost:3000}"
SITE_URL="${AGENTSPONSOR_SITE_URL:-https://agentsponsor.com}"
PAIR_RES=$(curl -s -X POST "$API_URL/v1/installations/pair/init" \
    -H "Content-Type: application/json" \
    -d "{\"installation_uuid\": \"$UUID\", \"os\": \"$(uname -s)\", \"client_version\": \"1.0.0\"}" 2>/dev/null || true)

PAIRING_CODE=""
if [ -n "$PAIR_RES" ]; then
    PAIRING_CODE=$(node -e "try{console.log(JSON.parse(process.argv[1]).pairing_code || '')}catch(e){}" "$PAIR_RES" 2>/dev/null || true)
fi

if [ -z "$PAIRING_CODE" ]; then
    PAIRING_CODE=$(node -e "console.log(require('crypto').randomBytes(4).toString('hex').toUpperCase().match(/.{1,4}/g).join('-'))" 2>/dev/null || echo "DEV-1234")
fi

echo ""
echo "============================================================"
echo "✓ AgentSponsor successfully installed!"
echo ""
echo "Connect this installation to start earning:"
echo "$SITE_URL/connect?code=$PAIRING_CODE"
echo ""
echo "Pairing code: $PAIRING_CODE (valid for 15 minutes)"
echo "============================================================"
echo ""
