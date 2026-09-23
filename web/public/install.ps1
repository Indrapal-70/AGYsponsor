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
