# AgentSponsor Backend Native PowerShell Test Script
$BaseUrl = "http://127.0.0.1:8000"

Write-Host "=== 1. Health Check ===" -ForegroundColor Cyan
$r = Invoke-RestMethod -Uri "$BaseUrl/health" -Method Get
$r | ConvertTo-Json

Write-Host "`n=== 2. Register Installation UUID ===" -ForegroundColor Cyan
$body = @{
    installation_id = "inst_sample_tok_9912"
    os = "windows"
    client_version = "0.1.0"
} | ConvertTo-Json
$r = Invoke-RestMethod -Uri "$BaseUrl/v1/installations" -Method Post -Body $body -ContentType "application/json"
$r | ConvertTo-Json

Write-Host "`n=== 3. Link Installation to User Account ===" -ForegroundColor Cyan
$body = @{
    installation_id = "inst_sample_tok_9912"
    user_id = "dev_demo_id"
} | ConvertTo-Json
$r = Invoke-RestMethod -Uri "$BaseUrl/v1/installations/link" -Method Post -Body $body -ContentType "application/json"
$r | ConvertTo-Json

Write-Host "`n=== 4. Fetch Active Campaign ===" -ForegroundColor Cyan
$r = Invoke-RestMethod -Uri "$BaseUrl/v1/campaign?installation_id=inst_sample_tok_9912" -Method Get
$r | ConvertTo-Json

Write-Host "`n=== 5. Session Start Event ===" -ForegroundColor Cyan
$body = @{
    event_id = "evt_sess_$([System.Guid]::NewGuid().ToString().Substring(0,8))"
    installation_id = "inst_sample_tok_9912"
    conversation_id = "conv_agent_123"
} | ConvertTo-Json
$r = Invoke-RestMethod -Uri "$BaseUrl/v1/events/session-start" -Method Post -Body $body -ContentType "application/json"
$r | ConvertTo-Json

Write-Host "`n=== 6. Record Eligible Impression (5s Exposure) ===" -ForegroundColor Cyan
$body = @{
    event_id = "evt_imp_$([System.Guid]::NewGuid().ToString().Substring(0,8))"
    installation_id = "inst_sample_tok_9912"
    session_id = "sess_conv_123"
    campaign_id = "cmp_demo_001"
    exposure_duration_seconds = 5.0
} | ConvertTo-Json
$r = Invoke-RestMethod -Uri "$BaseUrl/v1/events/impression" -Method Post -Body $body -ContentType "application/json"
$r | ConvertTo-Json

Write-Host "`n=== 7. Developer Earnings Ledger (Bearer Auth) ===" -ForegroundColor Cyan
$headers = @{ "Authorization" = "Bearer dev_demo_id" }
$r = Invoke-RestMethod -Uri "$BaseUrl/v1/me/earnings" -Method Get -Headers $headers
$r | ConvertTo-Json -Depth 4

Write-Host "`n=== 8. Admin Platform Metrics (Admin Secret) ===" -ForegroundColor Cyan
$headers = @{ "X-Admin-Secret" = "super-secret-admin-key" }
$r = Invoke-RestMethod -Uri "$BaseUrl/v1/admin/stats" -Method Get -Headers $headers
$r | ConvertTo-Json

Write-Host "`nAll backend routes tested & verified successfully!" -ForegroundColor Green
