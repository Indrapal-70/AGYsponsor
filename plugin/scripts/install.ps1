$ErrorActionPreference = "Stop"

$PluginDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$AgyPluginDir = Join-Path $env:USERPROFILE ".gemini\config\plugins\agentsponsor"
$ConfigDir = Join-Path $env:USERPROFILE ".agentsponsor"
$SettingsFile = Join-Path $env:USERPROFILE ".gemini\antigravity-cli\settings.json"

if (-not (Test-Path $ConfigDir)) {
    New-Item -ItemType Directory -Path $ConfigDir | Out-Null
}

$ConfigFile = Join-Path $ConfigDir "config.json"
if (-not (Test-Path $ConfigFile)) {
    $Uuid = [guid]::NewGuid().ToString()
    $ConfigContent = "{`"installation_id`": `"$Uuid`"}"
    Set-Content -Path $ConfigFile -Value $ConfigContent
}

$AgyPluginsParent = Split-Path -Parent $AgyPluginDir
if (-not (Test-Path $AgyPluginsParent)) {
    New-Item -ItemType Directory -Path $AgyPluginsParent | Out-Null
}

if (Test-Path $AgyPluginDir) {
    Remove-Item -Path $AgyPluginDir -Recurse -Force
}

Copy-Item -Path $PluginDir -Destination $AgyPluginDir -Recurse
Write-Host "Plugin installed to $AgyPluginDir"

# Configure Antigravity statusLine with stack_with_default
if (Test-Path $SettingsFile) {
    try {
        $settings = Get-Content -Raw -Path $SettingsFile | ConvertFrom-Json
        $settings | Add-Member -NotePropertyName "statusLine" -NotePropertyValue @{
            type = "command"
            command = "node ~/.gemini/config/plugins/agentsponsor/scripts/agentsponsor-statusline.js"
            stack_with_default = $true
        } -Force
        $settings | ConvertTo-Json -Depth 10 | Set-Content -Path $SettingsFile
        Write-Host "Configured statusLine in $SettingsFile"
    } catch {
        Write-Warning "Could not update statusLine in $SettingsFile: $_"
    }
}
