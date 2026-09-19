#!/bin/bash

AGY_PLUGIN_DIR="$HOME/.gemini/config/plugins/agentsponsor"
CONFIG_DIR="$HOME/.agentsponsor"

echo "Uninstalling AgentSponsor plugin..."
if [ -e "$AGY_PLUGIN_DIR" ]; then
    rm -rf "$AGY_PLUGIN_DIR"
    echo "Removed $AGY_PLUGIN_DIR"
fi

if [ -e "$CONFIG_DIR" ]; then
    rm -rf "$CONFIG_DIR"
    echo "Removed $CONFIG_DIR"
fi

echo "Uninstallation complete."
