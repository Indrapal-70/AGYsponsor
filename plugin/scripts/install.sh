#!/bin/bash
set -e

PLUGIN_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
AGY_PLUGIN_DIR="$HOME/.gemini/config/plugins/agentsponsor"
CONFIG_DIR="$HOME/.agentsponsor"

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
