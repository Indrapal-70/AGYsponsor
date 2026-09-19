$ErrorActionPreference = "Stop"

$PluginDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$AgyPluginDir = Join-Path $env:USERPROFILE ".gemini\config\plugins\agentsponsor"
$ConfigDir = Join-Path $env:USERPROFILE ".agentsponsor"

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
