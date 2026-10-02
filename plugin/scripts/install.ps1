$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  AgentSponsor CLI Plugin Installer (Antigravity Native)" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

$PluginDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$AgyPluginDir = Join-Path $env:USERPROFILE ".gemini\config\plugins\agentsponsor"
$ConfigDir = Join-Path $env:USERPROFILE ".agentsponsor"
$SettingsFile = Join-Path $env:USERPROFILE ".gemini\antigravity-cli\settings.json"

# 1. Initialize Machine Config
if (-not (Test-Path $ConfigDir)) {
    New-Item -ItemType Directory -Path $ConfigDir | Out-Null
}

$ConfigFile = Join-Path $ConfigDir "config.json"
$Uuid = $null

if (Test-Path $ConfigFile) {
    try {
        $cfg = Get-Content -Raw -Path $ConfigFile | ConvertFrom-Json
        $Uuid = $cfg.installation_id
    } catch { }
}

if (-not $Uuid) {
    $Uuid = [guid]::NewGuid().ToString()
    $ConfigContent = @{
        installation_id = $Uuid
        api_url = "http://localhost:8000"
        enabled = $true
    } | ConvertTo-Json
    Set-Content -Path $ConfigFile -Value $ConfigContent
}

# 2. Install Plugin to ~/.gemini/config/plugins/agentsponsor
$AgyPluginsParent = Split-Path -Parent $AgyPluginDir
if (-not (Test-Path $AgyPluginsParent)) {
    New-Item -ItemType Directory -Path $AgyPluginsParent | Out-Null
}

if (Test-Path $AgyPluginDir) {
    Remove-Item -Path $AgyPluginDir -Recurse -Force
}

Copy-Item -Path $PluginDir -Destination $AgyPluginDir -Recurse
Write-Host "`nPlugin installed to: $AgyPluginDir" -ForegroundColor Green

# 3. Configure Antigravity CLI statusLine
if (Test-Path $SettingsFile) {
    try {
        $settings = Get-Content -Raw -Path $SettingsFile | ConvertFrom-Json
        $settings | Add-Member -NotePropertyName "statusLine" -NotePropertyValue @{
            type = "command"
            command = "node ~/.gemini/config/plugins/agentsponsor/scripts/agentsponsor-statusline.js"
            stack_with_default = $true
        } -Force
        $settings | ConvertTo-Json -Depth 10 | Set-Content -Path $SettingsFile
        Write-Host "Configured statusLine in: $SettingsFile" -ForegroundColor Green
    } catch {
        Write-Warning "Could not update statusLine settings: $_"
    }
}

# 4. Print Pairing Information
Write-Host "`n--------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "  INSTALLATION UUID: $Uuid" -ForegroundColor Yellow
Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "To link this machine to your personal earnings ledger:" -ForegroundColor White
Write-Host "  1. Sign in at: http://localhost:3000/login" -ForegroundColor Cyan
Write-Host "  2. Direct link: http://localhost:3000/connect?code=$Uuid" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Green
