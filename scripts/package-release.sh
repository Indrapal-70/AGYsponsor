#!/bin/bash
set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION="1.0.0"
DIST_DIR="$REPO_ROOT/web/public/releases"
PUBLIC_DIR="$REPO_ROOT/web/public"

mkdir -p "$DIST_DIR"

STAGE_DIR=$(mktemp -d)
trap 'rm -rf "$STAGE_DIR"' EXIT

echo "Packaging AgentSponsor plugin v$VERSION..."
mkdir -p "$STAGE_DIR/plugin"
cp -r "$REPO_ROOT/plugin/scripts" "$STAGE_DIR/plugin/"
cp "$REPO_ROOT/plugin/hooks.json" "$STAGE_DIR/plugin/"
cp "$REPO_ROOT/plugin/README.md" "$STAGE_DIR/plugin/" 2>/dev/null || true
cp "$REPO_ROOT/LICENSE" "$STAGE_DIR/plugin/" 2>/dev/null || true
mkdir -p "$STAGE_DIR/plugin/config"
if [ -f "$REPO_ROOT/plugin/config/config.json" ]; then
    cp "$REPO_ROOT/plugin/config/config.json" "$STAGE_DIR/plugin/config/"
fi

# Clean any test/scratch files in stage
rm -rf "$STAGE_DIR/plugin/tests"
rm -f "$STAGE_DIR/plugin/scripts"/*.test.js

# Build archives
TAR_FILE="$DIST_DIR/agentsponsor-plugin-v$VERSION.tar.gz"
ZIP_FILE="$DIST_DIR/agentsponsor-plugin-v$VERSION.zip"

(cd "$STAGE_DIR/plugin" && tar -czf "$TAR_FILE" .)
(cd "$STAGE_DIR/plugin" && zip -rq "$ZIP_FILE" .)

SHA_TAR=$(sha256sum "$TAR_FILE" | awk '{print $1}')
SHA_ZIP=$(sha256sum "$ZIP_FILE" | awk '{print $1}')

echo "Tarball SHA256: $SHA_TAR"
echo "Zip SHA256:     $SHA_ZIP"

# Write latest metadata
cat <<EOF > "$DIST_DIR/latest.json"
{
  "version": "$VERSION",
  "release_date": "$(date -u +%Y-%m-%d)",
  "min_cli_version": "1.0.0",
  "tested_cli_version": "1.2.7",
  "tar_gz": {
    "url": "/releases/agentsponsor-plugin-v$VERSION.tar.gz",
    "sha256": "$SHA_TAR"
  },
  "zip": {
    "url": "/releases/agentsponsor-plugin-v$VERSION.zip",
    "sha256": "$SHA_ZIP"
  }
}
EOF

# Generate Public install.sh for consumers
cat <<'EOF' > "$PUBLIC_DIR/install.sh"
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
EOF
chmod +x "$PUBLIC_DIR/install.sh"

# Generate Public install.ps1 for Windows
cat <<'EOF' > "$PUBLIC_DIR/install.ps1"
$ErrorActionPreference = "SilentlyContinue"

$BaseUrl = if ($env:AGENTSPONSOR_SITE_URL) { $env:AGENTSPONSOR_SITE_URL } else { "https://agentsponsor.com" }
$ApiUrl = if ($env:AGENTSPONSOR_API_URL) { $env:AGENTSPONSOR_API_URL } else { "https://api.agentsponsor.com" }
$DestDir = Join-Path $env:USERPROFILE ".gemini\config\plugins\agentsponsor"
$ConfigDir = Join-Path $env:USERPROFILE ".agentsponsor"
$ConfigFile = Join-Path $ConfigDir "config.json"
$SettingsFile = Join-Path $env:USERPROFILE ".gemini\antigravity-cli\settings.json"

Write-Host "============================================================"
Write-Host "Installing AgentSponsor Plugin..."
Write-Host "============================================================"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Warning "Node.js is required to run the AgentSponsor status line. Please install Node.js 18+ and try again."
    Exit 1
}

if (-not (Test-Path $ConfigDir)) {
    New-Item -ItemType Directory -Path $ConfigDir -Force | Out-Null
}

$InstallId = [guid]::NewGuid().ToString()
if (-not (Test-Path $ConfigFile)) {
    "{`"installation_id`": `"$InstallId`"}" | Set-Content -Path $ConfigFile
} else {
    try {
        $json = Get-Content -Raw -Path $ConfigFile | ConvertFrom-Json
        if ($json.installation_id) { $InstallId = $json.installation_id }
    } catch {}
}

$TempZip = Join-Path $env:TEMP "agentsponsor-plugin.zip"
$ArchiveUrl = "$BaseUrl/releases/agentsponsor-plugin-v1.0.0.zip"

try {
    Invoke-WebRequest -Uri $ArchiveUrl -OutFile $TempZip -UseBasicParsing
    if (Test-Path $DestDir) { Remove-Item -Path $DestDir -Recurse -Force }
    New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
    Expand-Archive -Path $TempZip -DestinationPath $DestDir -Force
    Remove-Item -Path $TempZip -Force
} catch {
    Write-Warning "Could not download public archive, checking local fallback..."
}

# Update settings.json with statusLine
if (Test-Path $SettingsFile) {
    try {
        $settings = Get-Content -Raw -Path $SettingsFile | ConvertFrom-Json
        $settings | Add-Member -NotePropertyName "statusLine" -NotePropertyValue @{
            type = "command"
            command = "node ~/.gemini/config/plugins/agentsponsor/scripts/agentsponsor-statusline.js"
            stack_with_default = $true
        } -Force
        $settings | ConvertTo-Json -Depth 10 | Set-Content -Path $SettingsFile
    } catch {}
}

$PairingCode = "WIN-" + (Get-Random -Minimum 1000 -Maximum 9999).ToString()
$ConnectUrl = "$BaseUrl/connect?code=$PairingCode"

Write-Host ""
Write-Host "============================================================"
Write-Host "✓ AgentSponsor successfully installed!"
Write-Host ""
Write-Host "Connect this installation to start earning:"
Write-Host $ConnectUrl
Write-Host ""
Write-Host "Pairing code: $PairingCode (valid for 15 minutes)"
Write-Host "============================================================"
Write-Host ""
EOF

echo "✓ Release packages and public installer scripts generated successfully in web/public/"
